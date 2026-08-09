"""Category-based environmental impact estimates.

Example/project estimates only - not scientific guarantees. Used later by
Feature #35 (POST /api/eco-impact/calculate) and Feature #25
(GET /api/users/me/eco-stats).
"""

IMPACT_FACTORS = {
    "plastic": {
        "co2_saved_kg_per_kg": 1.8,
        "energy_saved_kwh_per_kg": 5.0,
    },
    "e-waste": {
        "co2_saved_kg_per_kg": 2.5,
        "energy_saved_kwh_per_kg": 10.0,
    },
    "batteries": {
        "co2_saved_kg_per_kg": 2.0,
        "energy_saved_kwh_per_kg": 3.5,
    },
    "paper": {
        "co2_saved_kg_per_kg": 1.1,
        "energy_saved_kwh_per_kg": 4.0,
    },
    "glass": {
        "co2_saved_kg_per_kg": 0.6,
        "energy_saved_kwh_per_kg": 1.5,
    },
    "metal": {
        "co2_saved_kg_per_kg": 3.0,
        "energy_saved_kwh_per_kg": 8.0,
    },
}


def calculate_impact(quantity_kg: float, waste_type: str):
    if quantity_kg <= 0:
        raise ValueError("quantity_kg must be greater than 0.")

    normalized_type = waste_type.strip().lower()

    if normalized_type not in IMPACT_FACTORS:
        supported = ", ".join(sorted(IMPACT_FACTORS.keys()))
        raise ValueError(
            f"Unsupported waste type '{waste_type}'. Supported types: {supported}"
        )

    factors = IMPACT_FACTORS[normalized_type]

    co2_saved_kg = quantity_kg * factors["co2_saved_kg_per_kg"]
    energy_saved_kwh = quantity_kg * factors["energy_saved_kwh_per_kg"]

    return {
        "waste_type": normalized_type,
        "quantity_kg": quantity_kg,
        "co2_saved_kg": co2_saved_kg,
        "energy_saved_kwh": energy_saved_kwh,
    }


if __name__ == "__main__":
    print(calculate_impact(2.0, "Plastic"))
    print(calculate_impact(1.5, " paper "))
