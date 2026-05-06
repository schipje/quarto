from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Airport, Route
from schemas import AirportCreate, AirportOut, RouteCreate, RouteOut

router = APIRouter(tags=["Routes"])


# ── Airports ─────────────────────────────────────────────

@router.get("/airports", response_model=list[AirportOut])
def list_airports(db: Session = Depends(get_db)):
    return db.query(Airport).order_by(Airport.icao).all()


@router.get("/airports/{icao}", response_model=AirportOut)
def get_airport(icao: str, db: Session = Depends(get_db)):
    ap = db.query(Airport).filter(Airport.icao == icao.upper()).first()
    if not ap:
        raise HTTPException(404, f"Airport {icao} niet gevonden")
    return ap


@router.post("/airports", response_model=AirportOut, status_code=201)
def create_airport(payload: AirportCreate, db: Session = Depends(get_db)):
    if db.query(Airport).filter(Airport.icao == payload.icao.upper()).first():
        raise HTTPException(409, f"Airport {payload.icao} bestaat al")
    ap = Airport(**payload.model_dump())
    ap.icao = ap.icao.upper()
    db.add(ap)
    db.commit()
    db.refresh(ap)
    return ap


@router.delete("/airports/{icao}", status_code=204)
def delete_airport(icao: str, db: Session = Depends(get_db)):
    ap = db.query(Airport).filter(Airport.icao == icao.upper()).first()
    if not ap:
        raise HTTPException(404, f"Airport {icao} niet gevonden")
    db.delete(ap)
    db.commit()


# ── Routes ───────────────────────────────────────────────

@router.get("/routes", response_model=list[RouteOut])
def list_routes(db: Session = Depends(get_db)):
    return db.query(Route).all()


@router.get("/routes/{route_id}", response_model=RouteOut)
def get_route(route_id: int, db: Session = Depends(get_db)):
    r = db.query(Route).filter(Route.id == route_id).first()
    if not r:
        raise HTTPException(404, "Route niet gevonden")
    return r


@router.post("/routes", response_model=RouteOut, status_code=201)
def create_route(payload: RouteCreate, db: Session = Depends(get_db)):
    for icao in [payload.origin_icao, payload.destination_icao]:
        if not db.query(Airport).filter(Airport.icao == icao.upper()).first():
            raise HTTPException(422, f"Airport {icao} bestaat niet — voeg het eerst toe")
    r = Route(**payload.model_dump())
    r.origin_icao = r.origin_icao.upper()
    r.destination_icao = r.destination_icao.upper()
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


@router.delete("/routes/{route_id}", status_code=204)
def delete_route(route_id: int, db: Session = Depends(get_db)):
    r = db.query(Route).filter(Route.id == route_id).first()
    if not r:
        raise HTTPException(404, "Route niet gevonden")
    db.delete(r)
    db.commit()
