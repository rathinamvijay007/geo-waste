from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.admin_centers import router as admin_centers_router
from app.routers.auth import router as auth_router
from app.routers.centers import router as centers_router
from app.routers.eco import router as eco_router
from app.routers.favorites import router as favorites_router
from app.routers.location import router as location_router
from app.routers.reviews import router as reviews_router
from app.routers.users import router as users_router
from app.routers.waste_categories import router as waste_categories_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_centers_router)
app.include_router(auth_router)
app.include_router(centers_router)
app.include_router(users_router)
app.include_router(waste_categories_router)
app.include_router(reviews_router)
app.include_router(favorites_router)
app.include_router(eco_router)
app.include_router(location_router)


@app.get("/")
def read_root():
    return {"message": "EcoConnect API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
