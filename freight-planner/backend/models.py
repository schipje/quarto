from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, Text, ForeignKey
from database import Base


class Aircraft(Base):
    __tablename__ = "aircraft"

    id             = Column(Integer, primary_key=True)
    registration   = Column(String(10), unique=True, nullable=False, index=True)
    type           = Column(String(20), nullable=False)
    max_payload_kg = Column(Float, nullable=False)
    volume_m3      = Column(Float)
    range_nm       = Column(Integer)
    uld_types      = Column(JSON)   # ["PMC","PAG","AKE"]
    dg_classes_permitted = Column(JSON)  # ["1","3","8"]
    home_base      = Column(String(4))   # ICAO
    status         = Column(String(20), default="ACTIVE")  # ACTIVE|AOG|MAINTENANCE


class Airport(Base):
    __tablename__ = "airports"

    id                 = Column(Integer, primary_key=True)
    icao               = Column(String(4), unique=True, nullable=False, index=True)
    iata               = Column(String(3))
    name               = Column(String(100), nullable=False)
    city               = Column(String(50))
    country            = Column(String(50))
    latitude           = Column(Float)
    longitude          = Column(Float)
    timezone           = Column(String(50))
    curfew_start       = Column(String(5))   # HH:MM local, null = geen curfew
    curfew_end         = Column(String(5))
    max_mtow_kg        = Column(Float)
    dg_capable_classes = Column(JSON)        # DG-klassen afhandelbaar op dit airport
    cargo_terminal     = Column(String(50))


class Route(Base):
    __tablename__ = "routes"

    id                   = Column(Integer, primary_key=True)
    origin_icao          = Column(String(4), ForeignKey("airports.icao"), nullable=False)
    destination_icao     = Column(String(4), ForeignKey("airports.icao"), nullable=False)
    distance_nm          = Column(Integer)
    est_flight_time_min  = Column(Integer)
    fuel_required_kg     = Column(Float)
    alternate_airports   = Column(JSON)   # ["EBBR","EDDL"]
    waypoints            = Column(JSON)   # ["HELEN","KONAN","DCT"]
    overflight_countries = Column(JSON)   # ["BE","DE","FR"]


class UnSubstance(Base):
    __tablename__ = "un_substances"

    id                   = Column(Integer, primary_key=True)
    un_number            = Column(String(6), unique=True, nullable=False, index=True)
    proper_shipping_name = Column(String(200), nullable=False)
    dg_class             = Column(String(5), nullable=False)  # "3", "6.1", "8"
    division             = Column(String(5))
    packing_group        = Column(String(3))   # I | II | III
    cao_only             = Column(Boolean, default=False)
    max_qty_pax_kg       = Column(Float)
    max_qty_cao_kg       = Column(Float)
    special_provisions   = Column(JSON)
    description          = Column(Text)


class SegregationRule(Base):
    __tablename__ = "segregation_rules"

    id      = Column(Integer, primary_key=True)
    class_a = Column(String(5), nullable=False)
    class_b = Column(String(5), nullable=False)
    rule    = Column(String(20), nullable=False)  # FORBIDDEN|DISTANCE_1M|DISTANCE_3M|SEPARATION
    notes   = Column(Text)
