from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import health, skills, resume

app = FastAPI(
    title="SkillSync AI Service",
    version="0.1.0",
    description="AI-powered skill extraction, resume parsing, and job matching",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(skills.router, prefix="/api/skills", tags=["skills"])
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
