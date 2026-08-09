from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.location import AddressResponse, LocationRequest, LocationResponse
from app.utils.geocoding import GeocodingError, reverse_geocode

router = APIRouter(prefix="/api/location", tags=["Location"])


@router.post("", response_model=LocationResponse)
async def receive_location(request: LocationRequest):
    return LocationResponse(
        latitude=request.latitude,
        longitude=request.longitude,
    )


@router.get("/address", response_model=AddressResponse)
async def get_location_address(
    latitude: float = Query(ge=-90.0, le=90.0),
    longitude: float = Query(ge=-180.0, le=180.0),
):
    try:
        address = reverse_geocode(latitude, longitude)
    except GeocodingError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        )

    return AddressResponse(address=address)
