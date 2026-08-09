from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    phone: str | None = None


class RecentCenterResponse(BaseModel):
    id: int
    name: str
    address: str
    latitude: float
    longitude: float
    verified: bool
    viewed_at: datetime


class SearchHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    query: str
    search_type: str
    created_at: datetime
