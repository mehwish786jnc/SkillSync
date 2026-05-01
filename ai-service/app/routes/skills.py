from fastapi import APIRouter
from pydantic import BaseModel

from app.nlp import extract_skill_names

router = APIRouter()


class SkillMatchRequest(BaseModel):
    candidate_skills: list[str]
    required_skills: list[str]


class SkillMatchResponse(BaseModel):
    match_score: float
    matched_skills: list[str]
    missing_skills: list[str]
    suggestions: list[str]


@router.post("/match", response_model=SkillMatchResponse)
async def match_skills(request: SkillMatchRequest) -> SkillMatchResponse:
    """Compare candidate skills against required skills and return a match analysis."""
    candidate_set = {s.lower() for s in request.candidate_skills}
    required_set = {s.lower() for s in request.required_skills}

    matched = candidate_set & required_set
    missing = required_set - candidate_set

    score = len(matched) / len(required_set) if required_set else 0.0

    return SkillMatchResponse(
        match_score=round(score, 2),
        matched_skills=sorted(matched),
        missing_skills=sorted(missing),
        suggestions=[f"Consider learning: {skill}" for skill in sorted(missing)[:5]],
    )


class SkillExtractRequest(BaseModel):
    text: str


class SkillExtractResponse(BaseModel):
    skills: list[str]


@router.post("/extract", response_model=SkillExtractResponse)
async def extract_skills_from_text(request: SkillExtractRequest) -> SkillExtractResponse:
    """Extract skills from free-form text using NLP-based taxonomy matching."""
    skills = extract_skill_names(request.text)
    return SkillExtractResponse(skills=skills)
