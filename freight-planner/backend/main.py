from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from database import engine
from models import Base
from routers import fleet, routes, dgr
from seed import seed

Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(
    title="Air Freight Planner — MVP",
    description="Fleet, route en gevaarlijke goederen planning voor luchtvracht",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fleet.router)
app.include_router(routes.router)
app.include_router(dgr.router)

# Serve frontend
frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.isdir(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/", include_in_schema=False)
    def serve_frontend():
        return FileResponse(os.path.join(frontend_dir, "index.html"))


@app.get("/health", tags=["System"])
def health():
    return {"status": "ok", "version": "0.1.0"}
