from fastapi import APIRouter, HTTPException, status

from app.schemas.eco import ImpactCalculateRequest, ImpactCalculateResponse
from app.utils.eco_impact import calculate_impact

router = APIRouter(prefix="/api/eco-impact", tags=["Eco Impact"])


@router.post(
    "/calculate",
    response_model=ImpactCalculateResponse,
)
async def calculate_eco_impact(request: ImpactCalculateRequest):
    try:
        return calculate_impact(request.quantity_kg, request.waste_type)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
