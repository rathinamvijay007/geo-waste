from pydantic import BaseModel


class EcoCategoryStats(BaseModel):
    waste_type: str
    quantity_kg: float
    co2_saved_kg: float
    energy_saved_kwh: float


class EcoStatsResponse(BaseModel):
    total_recycled_kg: float
    total_co2_saved_kg: float
    total_energy_saved_kwh: float
    activity_count: int
    by_category: list[EcoCategoryStats]
