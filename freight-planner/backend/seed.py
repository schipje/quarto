"""Seed data: airports, aircraft, UN substances, segregation rules."""
from database import SessionLocal
from models import Airport, Aircraft, UnSubstance, SegregationRule


AIRPORTS = [
    dict(icao="EHAM", iata="AMS", name="Amsterdam Schiphol", city="Amsterdam",
         country="Netherlands", latitude=52.308, longitude=4.764,
         timezone="Europe/Amsterdam", curfew_start="23:00", curfew_end="06:00",
         dg_capable_classes=["1","2","3","4","5","6","7","8","9"],
         cargo_terminal="Cargo City Schiphol"),
    dict(icao="EGLL", iata="LHR", name="London Heathrow", city="London",
         country="United Kingdom", latitude=51.477, longitude=-0.461,
         timezone="Europe/London", curfew_start="23:30", curfew_end="06:00",
         dg_capable_classes=["2","3","8","9"], cargo_terminal="World Cargo Centre"),
    dict(icao="EDDF", iata="FRA", name="Frankfurt Main", city="Frankfurt",
         country="Germany", latitude=50.033, longitude=8.571,
         timezone="Europe/Berlin", curfew_start="23:00", curfew_end="05:00",
         dg_capable_classes=["1","2","3","4","5","6","7","8","9"],
         cargo_terminal="Cargo City Süd"),
    dict(icao="KJFK", iata="JFK", name="New York JFK", city="New York",
         country="United States", latitude=40.640, longitude=-73.779,
         timezone="America/New_York",
         dg_capable_classes=["1","2","3","4","5","6","7","8","9"],
         cargo_terminal="Building 261"),
    dict(icao="OMDB", iata="DXB", name="Dubai International", city="Dubai",
         country="UAE", latitude=25.253, longitude=55.364,
         timezone="Asia/Dubai",
         dg_capable_classes=["2","3","8","9"], cargo_terminal="SkyCargo"),
    dict(icao="VHHH", iata="HKG", name="Hong Kong International", city="Hong Kong",
         country="Hong Kong", latitude=22.309, longitude=113.915,
         timezone="Asia/Hong_Kong",
         dg_capable_classes=["2","3","8","9"], cargo_terminal="SuperTerminal 1"),
    dict(icao="RJAA", iata="NRT", name="Tokyo Narita", city="Tokyo",
         country="Japan", latitude=35.765, longitude=140.386,
         timezone="Asia/Tokyo", curfew_start="23:00", curfew_end="06:00",
         dg_capable_classes=["2","3","8","9"], cargo_terminal="Cargo Terminal"),
]

AIRCRAFT = [
    dict(registration="PH-BVA", type="B747-8F", max_payload_kg=134000,
         volume_m3=858, range_nm=8130,
         uld_types=["PMC","PAG","AKE","P6P"],
         dg_classes_permitted=["1","2","3","4","5","6","7","8","9"],
         home_base="EHAM", status="ACTIVE"),
    dict(registration="PH-BVB", type="B747-8F", max_payload_kg=134000,
         volume_m3=858, range_nm=8130,
         uld_types=["PMC","PAG","AKE"],
         dg_classes_permitted=["2","3","8","9"],
         home_base="EHAM", status="ACTIVE"),
    dict(registration="PH-CKA", type="B777F", max_payload_kg=102000,
         volume_m3=652, range_nm=9070,
         uld_types=["PMC","AKE"],
         dg_classes_permitted=["2","3","8","9"],
         home_base="EDDF", status="ACTIVE"),
    dict(registration="PH-CKB", type="B777F", max_payload_kg=102000,
         volume_m3=652, range_nm=9070,
         uld_types=["PMC","AKE"],
         dg_classes_permitted=["2","3","4","5","8","9"],
         home_base="EHAM", status="AOG"),
    dict(registration="PH-AFA", type="A330F", max_payload_kg=70000,
         volume_m3=475, range_nm=7400,
         uld_types=["PMC","AKE"],
         dg_classes_permitted=["2","3","8","9"],
         home_base="EHAM", status="ACTIVE"),
]

UN_SUBSTANCES = [
    # Class 1 — Explosives
    dict(un_number="UN0336", proper_shipping_name="FIREWORKS", dg_class="1",
         division="4G", packing_group=None, cao_only=True,
         max_qty_pax_kg=None, max_qty_cao_kg=75.0,
         description="Consumer fireworks, Division 1.4G"),
    # Class 2 — Gases
    dict(un_number="UN1072", proper_shipping_name="OXYGEN, COMPRESSED", dg_class="2",
         division="2.2", packing_group=None, cao_only=False,
         max_qty_pax_kg=75.0, max_qty_cao_kg=150.0,
         description="Compressed oxygen, non-flammable"),
    dict(un_number="UN1978", proper_shipping_name="PROPANE", dg_class="2",
         division="2.1", packing_group=None, cao_only=False,
         max_qty_pax_kg=None, max_qty_cao_kg=150.0,
         description="Flammable gas"),
    # Class 3 — Flammable liquids
    dict(un_number="UN1203", proper_shipping_name="GASOLINE", dg_class="3",
         packing_group="II", cao_only=False,
         max_qty_pax_kg=None, max_qty_cao_kg=60.0,
         description="Petrol / motor spirit, PG II"),
    dict(un_number="UN1170", proper_shipping_name="ETHANOL (ETHYL ALCOHOL)", dg_class="3",
         packing_group="II", cao_only=False,
         max_qty_pax_kg=60.0, max_qty_cao_kg=220.0,
         description="Ethyl alcohol solutions > 24%"),
    dict(un_number="UN1263", proper_shipping_name="PAINT", dg_class="3",
         packing_group="II", cao_only=False,
         max_qty_pax_kg=60.0, max_qty_cao_kg=220.0,
         description="Paint, lacquer, enamel, stain, varnish"),
    # Class 4 — Flammable solids
    dict(un_number="UN1325", proper_shipping_name="FLAMMABLE SOLID, ORGANIC, N.O.S.", dg_class="4",
         division="4.1", packing_group="II", cao_only=False,
         max_qty_pax_kg=15.0, max_qty_cao_kg=50.0,
         description="Flammable solid, organic"),
    dict(un_number="UN2813", proper_shipping_name="WATER-REACTIVE SOLID, N.O.S.", dg_class="4",
         division="4.3", packing_group="II", cao_only=False,
         max_qty_pax_kg=None, max_qty_cao_kg=15.0,
         description="Dangerous when wet"),
    # Class 5 — Oxidizers
    dict(un_number="UN1942", proper_shipping_name="AMMONIUM NITRATE", dg_class="5",
         division="5.1", packing_group="III", cao_only=False,
         max_qty_pax_kg=25.0, max_qty_cao_kg=100.0,
         description="Oxidizing fertilizer"),
    dict(un_number="UN2015", proper_shipping_name="HYDROGEN PEROXIDE, AQUEOUS SOLUTION", dg_class="5",
         division="5.1", packing_group="I", cao_only=True,
         max_qty_pax_kg=None, max_qty_cao_kg=10.0,
         description=">60% concentration, strong oxidizer"),
    # Class 6 — Toxic & Infectious
    dict(un_number="UN2811", proper_shipping_name="TOXIC SOLID, ORGANIC, N.O.S.", dg_class="6",
         division="6.1", packing_group="II", cao_only=False,
         max_qty_pax_kg=25.0, max_qty_cao_kg=100.0,
         description="Toxic solid, organic"),
    dict(un_number="UN2814", proper_shipping_name="INFECTIOUS SUBSTANCE, AFFECTING HUMANS", dg_class="6",
         division="6.2", packing_group=None, cao_only=False,
         max_qty_pax_kg=50.0, max_qty_cao_kg=50.0,
         description="Category A infectious substance (e.g. Ebola)"),
    # Class 7 — Radioactive
    dict(un_number="UN2982", proper_shipping_name="RADIOACTIVE MATERIAL, N.O.S.", dg_class="7",
         packing_group=None, cao_only=False,
         max_qty_pax_kg=None, max_qty_cao_kg=None,
         special_provisions=["A51","A136"],
         description="Requires Transport Index calculation"),
    # Class 8 — Corrosives
    dict(un_number="UN1789", proper_shipping_name="HYDROCHLORIC ACID", dg_class="8",
         packing_group="II", cao_only=False,
         max_qty_pax_kg=1.0, max_qty_cao_kg=30.0,
         description="Corrosive acid solution"),
    dict(un_number="UN1823", proper_shipping_name="SODIUM HYDROXIDE, SOLID", dg_class="8",
         packing_group="II", cao_only=False,
         max_qty_pax_kg=1.0, max_qty_cao_kg=100.0,
         description="Caustic soda"),
    dict(un_number="UN2794", proper_shipping_name="BATTERIES, WET, FILLED WITH ACID", dg_class="8",
         packing_group=None, cao_only=False,
         max_qty_pax_kg=None, max_qty_cao_kg=None,
         description="Lead-acid batteries"),
    # Class 9 — Miscellaneous
    dict(un_number="UN3480", proper_shipping_name="LITHIUM ION BATTERIES", dg_class="9",
         packing_group=None, cao_only=False,
         max_qty_pax_kg=35.0, max_qty_cao_kg=35.0,
         special_provisions=["A88","A99","A154","A164","A183","A201"],
         description="Standalone lithium ion batteries, Wh > 100"),
    dict(un_number="UN3481", proper_shipping_name="LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT",
         dg_class="9", packing_group=None, cao_only=False,
         max_qty_pax_kg=35.0, max_qty_cao_kg=35.0,
         description="Li-ion batteries installed in device"),
    dict(un_number="UN3077", proper_shipping_name="ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.",
         dg_class="9", packing_group="III", cao_only=False,
         max_qty_pax_kg=100.0, max_qty_cao_kg=400.0,
         description="Marine pollutant, solid"),
    dict(un_number="UN1845", proper_shipping_name="CARBON DIOXIDE, SOLID (DRY ICE)", dg_class="9",
         packing_group=None, cao_only=False,
         max_qty_pax_kg=200.0, max_qty_cao_kg=200.0,
         description="Dry ice used as refrigerant"),
]

SEGREGATION_RULES = [
    # Class 1 Explosives combinations
    dict(class_a="1", class_b="3",  rule="FORBIDDEN",    notes="Explosives + flammable liquids"),
    dict(class_a="1", class_b="4",  rule="FORBIDDEN",    notes="Explosives + flammable solids"),
    dict(class_a="1", class_b="5",  rule="FORBIDDEN",    notes="Explosives + oxidizers"),
    dict(class_a="1", class_b="6",  rule="FORBIDDEN",    notes="Explosives + toxic substances"),
    dict(class_a="1", class_b="8",  rule="FORBIDDEN",    notes="Explosives + corrosives"),
    # Class 3 Flammable liquids
    dict(class_a="3", class_b="5",  rule="DISTANCE_3M",  notes="Flammable liquids + oxidizers: min. 3m afstand"),
    dict(class_a="3", class_b="8",  rule="DISTANCE_1M",  notes="Flammable liquids + corrosives: min. 1m afstand"),
    # Class 4 Flammable solids
    dict(class_a="4", class_b="5",  rule="FORBIDDEN",    notes="Flammable solids + oxidizers"),
    dict(class_a="4", class_b="6",  rule="DISTANCE_1M",  notes="Flammable solids + toxics"),
    # Class 5 Oxidizers
    dict(class_a="5", class_b="8",  rule="DISTANCE_1M",  notes="Oxidizers + corrosives"),
    # Class 6.2 Infectious
    dict(class_a="6", class_b="8",  rule="SEPARATION",   notes="Infectieuze stoffen gescheiden houden van corrosieven"),
    # Class 7 Radioactive
    dict(class_a="7", class_b="9",  rule="DISTANCE_3M",  notes="Radioactief materiaal: minimale afstand tot andere lading"),
]


def seed():
    db = SessionLocal()
    try:
        if db.query(Airport).count() == 0:
            db.bulk_insert_mappings(Airport, AIRPORTS)
            print(f"  + {len(AIRPORTS)} airports")

        if db.query(Aircraft).count() == 0:
            db.bulk_insert_mappings(Aircraft, AIRCRAFT)
            print(f"  + {len(AIRCRAFT)} aircraft")

        if db.query(UnSubstance).count() == 0:
            db.bulk_insert_mappings(UnSubstance, UN_SUBSTANCES)
            print(f"  + {len(UN_SUBSTANCES)} UN substances")

        if db.query(SegregationRule).count() == 0:
            db.bulk_insert_mappings(SegregationRule, SEGREGATION_RULES)
            print(f"  + {len(SEGREGATION_RULES)} segregation rules")

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    from database import engine
    from models import Base
    Base.metadata.create_all(bind=engine)
    print("Seeding database...")
    seed()
    print("Klaar.")
