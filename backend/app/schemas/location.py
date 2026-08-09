from pydantic import BaseModel, Field


class LocationRequest(BaseModel):
    latitude: float = Field(ge=-90.0, le=90.0)
    longitude: float = Field(ge=-180.0, le=180.0)


class LocationResponse(BaseModel):
    latitude: float
    longitude: float


class AddressResponse(BaseModel):
    address: str
