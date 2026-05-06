from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Aircraft
from schemas import AircraftCreate, AircraftOut

router = APIRouter(prefix="/aircraft", tags=["Fleet"])


@router.get("/", response_model=list[AircraftOut])
def list_aircraft(db: Session = Depends(get_db)):
    return db.query(Aircraft).all()


@router.get("/{registration}", response_model=AircraftOut)
def get_aircraft(registration: str, db: Session = Depends(get_db)):
    ac = db.query(Aircraft).filter(Aircraft.registration == registration.upper()).first()
    if not ac:
        raise HTTPException(404, f"Aircraft {registration} niet gevonden")
    return ac


@router.post("/", response_model=AircraftOut, status_code=201)
def create_aircraft(payload: AircraftCreate, db: Session = Depends(get_db)):
    if db.query(Aircraft).filter(Aircraft.registration == payload.registration.upper()).first():
        raise HTTPException(409, f"Registratie {payload.registration} bestaat al")
    ac = Aircraft(**payload.model_dump())
    ac.registration = ac.registration.upper()
    db.add(ac)
    db.commit()
    db.refresh(ac)
    return ac


@router.put("/{registration}", response_model=AircraftOut)
def update_aircraft(registration: str, payload: AircraftCreate, db: Session = Depends(get_db)):
    ac = db.query(Aircraft).filter(Aircraft.registration == registration.upper()).first()
    if not ac:
        raise HTTPException(404, f"Aircraft {registration} niet gevonden")
    for k, v in payload.model_dump().items():
        setattr(ac, k, v)
    db.commit()
    db.refresh(ac)
    return ac


@router.delete("/{registration}", status_code=204)
def delete_aircraft(registration: str, db: Session = Depends(get_db)):
    ac = db.query(Aircraft).filter(Aircraft.registration == registration.upper()).first()
    if not ac:
        raise HTTPException(404, f"Aircraft {registration} niet gevonden")
    db.delete(ac)
    db.commit()
