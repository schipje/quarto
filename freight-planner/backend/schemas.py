from pydantic import BaseModel, field_validator
from typing import Optional


# ── Aircraft ─────────────────────────────────────────────

class AircraftBase(BaseModel):
    registration:        str
    type:                str
    max_payload_kg:      float
    volume_m3:           Optional[float] = None
    range_nm:            Optional[int]   = None
    uld_types:           Optional[list]  = []
    dg_classes_permitted: Optional[list] = []
    home_base:           Optional[str]   = None
    status:              Optional[str]   = "ACTIVE"

class AircraftCreate(AircraftBase):
    pass

class AircraftOut(AircraftBase):
    id: int
    model_config = {"from_attributes": True}


# ── Airport ──────────────────────────────────────────────

class AirportBase(BaseModel):
    icao:               str
    iata:               Optional[str]   = None
    name:               str
    city:               Optional[str]   = None
    country:            Optional[str]   = None
    latitude:           Optional[float] = None
    longitude:          Optional[float] = None
    timezone:           Optional[str]   = None
    curfew_start:       Optional[str]   = None
    curfew_end:         Optional[str]   = None
    max_mtow_kg:        Optional[float] = None
    dg_capable_classes: Optional[list]  = []
    cargo_terminal:     Optional[str]   = None

class AirportCreate(AirportBase):
    pass

class AirportOut(AirportBase):
    id: int
    model_config = {"from_attributes": True}


# ── Route ────────────────────────────────────────────────

class RouteBase(BaseModel):
    origin_icao:          str
    destination_icao:     str
    distance_nm:          Optional[int]   = None
    est_flight_time_min:  Optional[int]   = None
    fuel_required_kg:     Optional[float] = None
    alternate_airports:   Optional[list]  = []
    waypoints:            Optional[list]  = []
    overflight_countries: Optional[list]  = []

class RouteCreate(RouteBase):
    pass

class RouteOut(RouteBase):
    id: int
    model_config = {"from_attributes": True}


# ── DGR ─────────────────────────────────────────────────

class UnSubstanceOut(BaseModel):
    id:                   int
    un_number:            str
    proper_shipping_name: str
    dg_class:             str
    division:             Optional[str]   = None
    packing_group:        Optional[str]   = None
    cao_only:             bool
    max_qty_pax_kg:       Optional[float] = None
    max_qty_cao_kg:       Optional[float] = None
    special_provisions:   Optional[list]  = []
    description:          Optional[str]   = None
    model_config = {"from_attributes": True}


class DgShipmentIn(BaseModel):
    un_number:    str
    packing_group: Optional[str] = None
    net_qty_kg:   float
    num_packages: int = 1

class ValidateRequest(BaseModel):
    aircraft_registration: str
    shipments: list[DgShipmentIn]

class ConflictOut(BaseModel):
    severity: str   # HARD | WARNING | INFO
    code:     str
    message:  str

class ValidateResponse(BaseModel):
    valid:     bool
    conflicts: list[ConflictOut]


class SegregationCheckRequest(BaseModel):
    shipments: list[DgShipmentIn]

class SegregationCheckResponse(BaseModel):
    valid:     bool
    conflicts: list[ConflictOut]
