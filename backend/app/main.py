from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from . import models
from .routes import router


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Task Manager API",
    description="Task Manager Backend using FastAPI and MySQL",
    version="1.0.0"
)


# ---------------------------------------
# CORS
# ---------------------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "https://tasks-with-7bokvofg1-murugasamy375s-projects.vercel.app"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# Register routes
app.include_router(router)


# ---------------------------------------
# ROOT
# ---------------------------------------

@app.get("/")
def root():

    return {
        "message": "Task Manager API is running"
    }