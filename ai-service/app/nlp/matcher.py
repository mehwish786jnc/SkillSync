"""
Job matching engine using TF-IDF + cosine similarity.

Combines two signals:
  1. Semantic similarity  (TF-IDF on full text)   — captures context & experience
  2. Skill overlap        (set intersection)       — captures hard requirements

Final score = weighted blend of both (0–100).
"""

from dataclasses import dataclass

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.nlp import extract_skill_names

# ── Weights for final score blending ────────────────────────────────────────
SEMANTIC_WEIGHT = 0.45   # How much TF-IDF text similarity matters
SKILL_WEIGHT = 0.55      # How much explicit skill overlap matters


@dataclass
class MatchBreakdown:
    """Detailed breakdown of a match score."""
    overall_score: float          # 0–100
    semantic_score: float         # 0–100 (TF-IDF cosine similarity)
    skill_score: float            # 0–100 (skill overlap ratio)
    matched_skills: list[str]     # Skills found in both resume and job
    missing_skills: list[str]     # Job skills not found in resume
    extra_skills: list[str]       # Resume skills not required by job
    resume_skills: list[str]      # All skills extracted from resume
    job_skills: list[str]         # All skills extracted from job description


def _compute_semantic_similarity(text_a: str, text_b: str) -> float:
    """
    Compute TF-IDF cosine similarity between two documents.

    TF-IDF captures word importance relative to the document pair,
    naturally down-weighting common words like "the", "and", etc.
    Cosine similarity then measures the angle between the two
    term-frequency vectors (0 = unrelated, 1 = identical).
    """
    if not text_a.strip() or not text_b.strip():
        return 0.0

    vectorizer = TfidfVectorizer(
        stop_words="english",   # Remove common English stop words
        ngram_range=(1, 2),     # Unigrams + bigrams for phrase matching
        max_features=5000,      # Cap vocabulary to control memory
        sublinear_tf=True,      # Apply log normalization to term frequencies
    )

    tfidf_matrix = vectorizer.fit_transform([text_a, text_b])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])

    return float(similarity[0][0])


def _compute_skill_overlap(
    resume_skills: list[str], job_skills: list[str]
) -> tuple[float, list[str], list[str], list[str]]:
    """
    Compute skill overlap between resume and job description.

    Returns: (ratio, matched, missing, extra)
    - ratio: fraction of job skills covered by resume (0.0–1.0)
    - matched: skills in both
    - missing: job skills not in resume
    - extra: resume skills not in job requirements
    """
    resume_set = {s.lower() for s in resume_skills}
    job_set = {s.lower() for s in job_skills}

    if not job_set:
        # No skills listed in job → can't penalize candidate
        return (1.0 if resume_set else 0.5, [], [], sorted(resume_skills))

    # Use canonical names for display
    resume_lookup = {s.lower(): s for s in resume_skills}
    job_lookup = {s.lower(): s for s in job_skills}

    matched_lower = resume_set & job_set
    missing_lower = job_set - resume_set
    extra_lower = resume_set - job_set

    matched = sorted(job_lookup.get(s, s) for s in matched_lower)
    missing = sorted(job_lookup.get(s, s) for s in missing_lower)
    extra = sorted(resume_lookup.get(s, s) for s in extra_lower)

    ratio = len(matched_lower) / len(job_set)
    return (ratio, matched, missing, extra)


def match_resume_to_job(resume_text: str, job_description: str) -> MatchBreakdown:
    """
    Score how well a resume matches a job description.

    Combines:
    - TF-IDF cosine similarity on the full text (semantic signal)
    - Explicit skill overlap from extracted skills (hard-skill signal)

    Returns a MatchBreakdown with overall score (0–100) and details.
    """
    # Step 1: Extract skills from both documents
    resume_skills = extract_skill_names(resume_text)
    job_skills = extract_skill_names(job_description)

    # Step 2: Compute semantic similarity (full text)
    semantic_raw = _compute_semantic_similarity(resume_text, job_description)
    semantic_score = round(semantic_raw * 100, 1)

    # Step 3: Compute skill overlap
    skill_ratio, matched, missing, extra = _compute_skill_overlap(resume_skills, job_skills)
    skill_score = round(skill_ratio * 100, 1)

    # Step 4: Weighted blend
    overall = round(
        (semantic_raw * SEMANTIC_WEIGHT + skill_ratio * SKILL_WEIGHT) * 100, 1
    )
    # Clamp to 0–100
    overall = max(0.0, min(100.0, overall))

    return MatchBreakdown(
        overall_score=overall,
        semantic_score=semantic_score,
        skill_score=skill_score,
        matched_skills=matched,
        missing_skills=missing,
        extra_skills=extra,
        resume_skills=resume_skills,
        job_skills=job_skills,
    )


def batch_match(
    resume_text: str, job_descriptions: list[dict[str, str]]
) -> list[dict]:
    """
    Match one resume against multiple jobs.

    Args:
        resume_text: The candidate's resume text.
        job_descriptions: List of dicts with "id" and "description" keys.

    Returns sorted list of match results (highest score first).
    """
    results = []
    for job in job_descriptions:
        breakdown = match_resume_to_job(resume_text, job["description"])
        results.append({
            "job_id": job["id"],
            "overall_score": breakdown.overall_score,
            "semantic_score": breakdown.semantic_score,
            "skill_score": breakdown.skill_score,
            "matched_skills": breakdown.matched_skills,
            "missing_skills": breakdown.missing_skills,
        })

    results.sort(key=lambda r: r["overall_score"], reverse=True)
    return results
