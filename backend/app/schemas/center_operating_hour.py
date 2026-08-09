from datetime import time

from pydantic import BaseModel, ConfigDict


class CenterOperatingHourResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    center_id: int
    day_of_week: int
    open_time: time
    close_time: time


class CenterAvailabilityResponse(BaseModel):
    center_id: int
    is_open: bool
    day_of_week: int
    open_time: time | None
    close_time: time | None
    message: str
