import json
import urllib.error
import urllib.parse
import urllib.request

NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"
USER_AGENT = "EcoDrop/1.0"


class GeocodingError(Exception):
    pass


def reverse_geocode(latitude: float, longitude: float) -> str:
    params = urllib.parse.urlencode(
        {
            "lat": latitude,
            "lon": longitude,
            "format": "jsonv2",
        }
    )
    request = urllib.request.Request(
        f"{NOMINATIM_URL}?{params}",
        headers={"User-Agent": USER_AGENT},
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, urllib.error.HTTPError, OSError, ValueError) as exc:
        raise GeocodingError("Geocoding service unavailable.") from exc

    display_name = data.get("display_name")
    if not display_name:
        raise GeocodingError("No address found for the given coordinates.")

    return display_name
