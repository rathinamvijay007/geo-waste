from pydantic import BaseModel


class AdminCenterCreateRequest(BaseModel):
    name: str
    description: str | None = None
    address: str
    latitude: float
    longitude: float
    phone: str | None = None
    verified: bool = False


class AdminCenterUpdateRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    phone: str | None = None
    verified: bool | None = None
