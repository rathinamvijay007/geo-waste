from pydantic import BaseModel


class ImpactCalculateRequest(BaseModel):
    waste_type: str
    quantity_kg: float


class ImpactCalculateResponse(BaseModel):
    waste_type: str
    quantity_kg: float
    co2_saved_kg: float
    energy_saved_kwh: float
