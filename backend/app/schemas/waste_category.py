from datetime import datetime

from pydantic import BaseModel, ConfigDict


class WasteCategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    disposal_instructions: str | None
    created_at: datetime
