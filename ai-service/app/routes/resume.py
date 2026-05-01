"""
Resume parsing & job matching endpoints.

POST /api/resume/parse       — Extract skills + profile summary from resume text
POST /api/resume/match       — Match resume against a single job description
POST /api/resume/match-batch — Match resume against multiple jobs at once
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.nlp import extract_skills
from app.nlp.matcher import match_resume_to_job, batch_match

router = APIRouter()


# ── Schemas ─────────────────────────────────────────────────────────────────

class ResumeParseRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Raw resume text")


class ExtractedSkillOut(BaseModel):
    name: str
    variant: str


class ResumeParseResponse(BaseModel):
    skills: list[ExtractedSkillOut]
    skill_count: int
    categories: dict[str, list[str]]


class ResumeMatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Raw resume text")
    job_description: str = Field(..., min_length=10, description="Job description text")


class MatchResponse(BaseModel):
    overall_score: float = Field(..., ge=0, le=100, description="0-100 match score")
    semantic_score: float = Field(..., ge=0, le=100)
    skill_score: float = Field(..., ge=0, le=100)
    matched_skills: list[str]
    missing_skills: list[str]
    extra_skills: list[str]
    resume_skills: list[str]
    job_skills: list[str]


class JobInput(BaseModel):
    id: str
    description: str = Field(..., min_length=10)


class BatchMatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=10)
    jobs: list[JobInput] = Field(..., min_length=1, max_length=50)


class BatchMatchResult(BaseModel):
    job_id: str
    overall_score: float
    semantic_score: float
    skill_score: float
    matched_skills: list[str]
    missing_skills: list[str]


class BatchMatchResponse(BaseModel):
    results: list[BatchMatchResult]


# ── Skill category mapping (for grouping extracted skills) ──────────────────

SKILL_CATEGORIES: dict[str, set[str]] = {
    "Languages": {
        "Python", "JavaScript", "TypeScript", "Java", "C#", "C++", "C", "Go",
        "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "Dart", "Lua",
        "Perl", "Shell", "SQL",
    },
    "Frontend": {
        "React", "Angular", "Vue.js", "Svelte", "Next.js", "Nuxt.js", "HTML",
        "CSS", "Tailwind CSS", "Bootstrap", "Sass", "jQuery", "Redux", "Webpack",
        "Vite",
    },
    "Backend": {
        "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot",
        "ASP.NET", "Ruby on Rails", "Laravel", "NestJS", "GraphQL", "REST", "gRPC",
    },
    "Data & ML": {
        "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow",
        "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Spark", "Hadoop", "Airflow",
        "Kafka", "Data Engineering", "Data Science", "Statistics",
    },
    "Databases": {
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Elasticsearch",
        "DynamoDB", "Cassandra", "Neo4j", "Firebase", "Supabase", "Prisma",
    },
    "DevOps & Cloud": {
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible",
        "Jenkins", "GitHub Actions", "CI/CD", "Linux", "Nginx", "Apache",
    },
    "Tools & Practices": {
        "Git", "Agile", "Jira", "Figma", "Microservices", "Serverless",
        "WebSockets", "OAuth", "JWT", "Unit Testing", "TDD", "API Design",
    },
}


def _categorize_skills(skill_names: list[str]) -> dict[str, list[str]]:
    """Group skill names into categories."""
    result: dict[str, list[str]] = {}
    categorized = set()

    for category, members in SKILL_CATEGORIES.items():
        found = [s for s in skill_names if s in members]
        if found:
            result[category] = found
            categorized.update(found)

    uncategorized = [s for s in skill_names if s not in categorized]
    if uncategorized:
        result["Other"] = uncategorized

    return result


# ── Routes ──────────────────────────────────────────────────────────────────

@router.post("/parse", response_model=ResumeParseResponse)
async def parse_resume(request: ResumeParseRequest) -> ResumeParseResponse:
    """
    Extract skills from resume text.

    Returns canonical skill names, the text variant that matched,
    total count, and skills grouped by category.
    """
    extracted = extract_skills(request.text)
    skill_names = [s.name for s in extracted]

    return ResumeParseResponse(
        skills=[ExtractedSkillOut(name=s.name, variant=s.variant) for s in extracted],
        skill_count=len(extracted),
        categories=_categorize_skills(skill_names),
    )


@router.post("/match", response_model=MatchResponse)
async def match_resume(request: ResumeMatchRequest) -> MatchResponse:
    """
    Match a resume against a single job description.

    Returns an overall score (0-100) combining:
    - Semantic similarity (TF-IDF cosine) — 45% weight
    - Skill overlap ratio — 55% weight

    Plus detailed breakdowns of matched/missing/extra skills.
    """
    result = match_resume_to_job(request.resume_text, request.job_description)

    return MatchResponse(
        overall_score=result.overall_score,
        semantic_score=result.semantic_score,
        skill_score=result.skill_score,
        matched_skills=result.matched_skills,
        missing_skills=result.missing_skills,
        extra_skills=result.extra_skills,
        resume_skills=result.resume_skills,
        job_skills=result.job_skills,
    )


@router.post("/match-batch", response_model=BatchMatchResponse)
async def match_resume_batch(request: BatchMatchRequest) -> BatchMatchResponse:
    """
    Match a resume against multiple job descriptions at once.

    Returns results sorted by overall_score descending.
    Capped at 50 jobs per request for performance.
    """
    jobs_input = [{"id": j.id, "description": j.description} for j in request.jobs]
    results = batch_match(request.resume_text, jobs_input)

    return BatchMatchResponse(
        results=[BatchMatchResult(**r) for r in results],
    )
