from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import UnSubstance, SegregationRule, Aircraft
from schemas import (
    UnSubstanceOut, ValidateRequest, ValidateResponse,
    SegregationCheckRequest, SegregationCheckResponse, ConflictOut,
)

router = APIRouter(prefix="/dg", tags=["Dangerous Goods"])


# ── UN Substance lookup ──────────────────────────────────

@router.get("/substances", response_model=list[UnSubstanceOut])
def list_substances(
    q: str = Query(default="", description="Zoek op UN-nummer of naam"),
    db: Session = Depends(get_db),
):
    query = db.query(UnSubstance)
    if q:
        like = f"%{q.upper()}%"
        query = query.filter(
            UnSubstance.un_number.ilike(like) |
            UnSubstance.proper_shipping_name.ilike(f"%{q}%")
        )
    return query.order_by(UnSubstance.un_number).limit(100).all()


@router.get("/substances/{un_number}", response_model=UnSubstanceOut)
def get_substance(un_number: str, db: Session = Depends(get_db)):
    s = db.query(UnSubstance).filter(
        UnSubstance.un_number == un_number.upper()
    ).first()
    if not s:
        raise HTTPException(404, f"{un_number} niet gevonden in IATA DGR database")
    return s


# ── Validate shipment(s) against aircraft ────────────────

@router.post("/validate", response_model=ValidateResponse)
def validate_shipments(payload: ValidateRequest, db: Session = Depends(get_db)):
    conflicts: list[ConflictOut] = []

    # Resolve aircraft
    ac = db.query(Aircraft).filter(
        Aircraft.registration == payload.aircraft_registration.upper()
    ).first()
    if not ac:
        raise HTTPException(404, f"Aircraft {payload.aircraft_registration} niet gevonden")

    cao_aircraft = "PAX" not in (ac.type or "")  # simplification: treat all freighters as CAO
    permitted_classes = ac.dg_classes_permitted or []

    for shipment in payload.shipments:
        un = db.query(UnSubstance).filter(
            UnSubstance.un_number == shipment.un_number.upper()
        ).first()

        # 1. UN-nummer bestaat?
        if not un:
            conflicts.append(ConflictOut(
                severity="HARD",
                code="DGR_UNKNOWN_UN",
                message=f"{shipment.un_number}: niet gevonden in IATA DGR database",
            ))
            continue

        # 2. CAO-only check
        if un.cao_only and not cao_aircraft:
            conflicts.append(ConflictOut(
                severity="HARD",
                code="DGR_CAO_ONLY",
                message=f"{un.un_number} ({un.proper_shipping_name}) is CAO-only maar vliegtuig voert passagiers",
            ))

        # 3. Klasse toegestaan op dit vliegtuig?
        if permitted_classes and un.dg_class not in permitted_classes:
            conflicts.append(ConflictOut(
                severity="HARD",
                code="DGR_CLASS_NOT_PERMITTED",
                message=f"Klasse {un.dg_class} niet toegestaan op {ac.registration} (toegestaan: {', '.join(permitted_classes)})",
            ))

        # 4. Hoeveelheidslimiet
        limit = un.max_qty_cao_kg if cao_aircraft else un.max_qty_pax_kg
        if limit is not None and shipment.net_qty_kg > limit:
            conflicts.append(ConflictOut(
                severity="HARD",
                code="DGR_QTY_EXCEEDED",
                message=(
                    f"{un.un_number}: nettohoeveelheid {shipment.net_qty_kg} kg "
                    f"overschrijdt maximum van {limit} kg"
                ),
            ))

    # 5. Segregatiecheck over alle zendingen
    seg_conflicts = _check_segregation(payload.shipments, db)
    conflicts.extend(seg_conflicts)

    return ValidateResponse(
        valid=not any(c.severity == "HARD" for c in conflicts),
        conflicts=conflicts,
    )


# ── Standalone segregation check ────────────────────────

@router.post("/segregation-check", response_model=SegregationCheckResponse)
def segregation_check(payload: SegregationCheckRequest, db: Session = Depends(get_db)):
    conflicts = _check_segregation(payload.shipments, db)
    return SegregationCheckResponse(
        valid=not any(c.severity == "HARD" for c in conflicts),
        conflicts=conflicts,
    )


# ── Internal helpers ─────────────────────────────────────

def _check_segregation(shipments, db: Session) -> list[ConflictOut]:
    conflicts = []
    classes_present: list[str] = []

    for s in shipments:
        un = db.query(UnSubstance).filter(
            UnSubstance.un_number == s.un_number.upper()
        ).first()
        if un:
            classes_present.append(un.dg_class)

    classes_present = list(set(classes_present))

    for i, cls_a in enumerate(classes_present):
        for cls_b in classes_present[i + 1:]:
            rule = db.query(SegregationRule).filter(
                (
                    (SegregationRule.class_a == cls_a) &
                    (SegregationRule.class_b == cls_b)
                ) | (
                    (SegregationRule.class_a == cls_b) &
                    (SegregationRule.class_b == cls_a)
                )
            ).first()

            if rule:
                severity = "HARD" if rule.rule == "FORBIDDEN" else "WARNING"
                conflicts.append(ConflictOut(
                    severity=severity,
                    code=f"DGR_SEG_{rule.rule}",
                    message=(
                        f"Klasse {cls_a} en klasse {cls_b}: {rule.rule}"
                        + (f" — {rule.notes}" if rule.notes else "")
                    ),
                ))

    return conflicts
