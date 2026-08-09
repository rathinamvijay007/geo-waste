from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ReportCreateRequest(BaseModel):
    reason: str = Field(min_length=1, description="Reason for the report")
    description: str | None = None

    @field_validator("reason")
    @classmethod
    def validate_reason_not_empty(cls, value):
        if not value.strip():
            raise ValueError("Reason must not be empty.")
        return value.strip()


class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    center_id: int
    reason: str
    description: str | None
    status: str
    created_at: datetime
    updated_at: datetime
