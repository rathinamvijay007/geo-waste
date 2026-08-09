from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CollectionCenterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    address: str
    latitude: float
    longitude: float
    phone: str | None
    verified: bool
    created_at: datetime
    updated_at: datetime


class NearbyCollectionCenterResponse(BaseModel):
    id: int
    name: str
    description: str | None
    address: str
    latitude: float
    longitude: float
    phone: str | None
    verified: bool
    distance_km: float
    average_rating: float = 0.0
    review_count: int = 0


class PopularCenterResponse(BaseModel):
    id: int
    name: str
    description: str | None
    address: str
    latitude: float
    longitude: float
    phone: str | None
    verified: bool
    average_rating: float
    review_count: int
    favorite_count: int
