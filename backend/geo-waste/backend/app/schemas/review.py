from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewCreateRequest(BaseModel):
    rating: int = Field(ge=1, le=5, description="Rating from 1 to 5")
    comment: str | None = None


class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    center_id: int
    rating: int
    comment: str | None
    created_at: datetime
    updated_at: datetime
