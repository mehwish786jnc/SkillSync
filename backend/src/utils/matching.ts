/**
 * Matching engine — scores how well a candidate fits a job.
 *
 * Scoring breakdown (0–100):
 *   - Skill overlap   : up to 60 pts  (core match signal)
 *   - Keyword relevance: up to 25 pts  (title + description vs bio)
 *   - Bio presence     : up to 15 pts  (profile completeness bonus)
 *
 * All text comparisons are case-insensitive and normalised.
 */

// ── Types ────────────────────────────────────────────────

export interface CandidateProfile {
  id: string;
  name: string;
  skills: string[];
  bio: string | null;
}

export interface JobProfile {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface MatchResult {
  candidateId: string;
  candidateName: string;
  jobId: string;
  score: number;          // 0–100
  breakdown: {
    skillScore: number;   // 0–60
    keywordScore: number; // 0–25
    profileScore: number; // 0–15
  };
  matchedSkills: string[];
  missingSkills: string[];
}

// ── Helpers ──────────────────────────────────────────────

/** Normalise a string for comparison: lowercase, trim, collapse whitespace */
function norm(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

/** Build a Set of normalised tokens from a string array */
function toNormSet(arr: string[]): Set<string> {
  return new Set(arr.map(norm).filter(Boolean));
}

/**
 * Extract meaningful keywords from a text block.
 * Strips common stop-words to reduce noise.
 */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'need', 'must', 'we', 'you',
  'they', 'he', 'she', 'it', 'i', 'me', 'my', 'our', 'your', 'their',
  'this', 'that', 'these', 'those', 'from', 'as', 'not', 'no', 'so',
  'if', 'then', 'than', 'too', 'very', 'just', 'about', 'also', 'more',
  'some', 'any', 'all', 'each', 'every', 'both', 'few', 'many', 'much',
  'own', 'same', 'other', 'such', 'only', 'into', 'over', 'after',
]);

function extractKeywords(text: string): Set<string> {
  const words = norm(text).replace(/[^a-z0-9\s\-+#.]/g, '').split(/\s+/);
  return new Set(words.filter((w) => w.length > 1 && !STOP_WORDS.has(w)));
}

// ── Scoring functions ────────────────────────────────────

/**
 * Skill overlap score (0–60).
 * Uses Jaccard-inspired weighting biased toward job requirements coverage.
 * Full coverage of job skills = 60 pts. Partial = proportional.
 */
function computeSkillScore(
  candidateSkills: Set<string>,
  jobSkills: Set<string>,
): { score: number; matched: string[]; missing: string[] } {
  if (jobSkills.size === 0) {
    // No skills listed — give benefit of the doubt
    return { score: candidateSkills.size > 0 ? 30 : 0, matched: [], missing: [] };
  }

  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of jobSkills) {
    // Check exact match or substring containment (e.g. "react" matches "reactjs")
    const found = candidateSkills.has(skill) ||
      [...candidateSkills].some((cs) => cs.includes(skill) || skill.includes(cs));
    if (found) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  // Coverage ratio — how many required skills does the candidate have?
  const coverage = matched.length / jobSkills.size;
  const score = Math.round(coverage * 60);

  return { score, matched, missing };
}

/**
 * Keyword relevance score (0–25).
 * Checks how many keywords from the job title + description appear in the
 * candidate's bio and skill list.
 */
function computeKeywordScore(
  candidateBio: string | null,
  candidateSkills: Set<string>,
  jobTitle: string,
  jobDescription: string,
): number {
  const jobKeywords = extractKeywords(`${jobTitle} ${jobDescription}`);
  if (jobKeywords.size === 0) return 0;

  // Combine candidate signals into one keyword pool
  const candidatePool = new Set<string>([
    ...candidateSkills,
    ...extractKeywords(candidateBio || ''),
  ]);

  let hits = 0;
  for (const kw of jobKeywords) {
    if (candidatePool.has(kw) || [...candidatePool].some((cp) => cp.includes(kw))) {
      hits++;
    }
  }

  // Diminishing returns — first matches matter more than later ones
  const ratio = hits / jobKeywords.size;
  return Math.round(ratio * 25);
}

/**
 * Profile completeness score (0–15).
 * Encourages candidates to fill out their profile.
 */
function computeProfileScore(candidate: CandidateProfile): number {
  let score = 0;
  if (candidate.bio && candidate.bio.length >= 20) score += 8;
  else if (candidate.bio && candidate.bio.length > 0) score += 4;
  if (candidate.skills.length >= 5) score += 7;
  else if (candidate.skills.length >= 2) score += 4;
  else if (candidate.skills.length >= 1) score += 2;
  return score;
}

// ── Public API ───────────────────────────────────────────

/**
 * Score a single candidate against a single job.
 * Pure function — no DB calls, easy to test.
 */
export function scoreMatch(candidate: CandidateProfile, job: JobProfile): MatchResult {
  const candidateSkills = toNormSet(candidate.skills);
  const jobSkills = toNormSet(job.skills);

  const { score: skillScore, matched, missing } = computeSkillScore(candidateSkills, jobSkills);
  const keywordScore = computeKeywordScore(candidate.bio, candidateSkills, job.title, job.description);
  const profileScore = computeProfileScore(candidate);

  const totalScore = Math.min(100, skillScore + keywordScore + profileScore);

  return {
    candidateId: candidate.id,
    candidateName: candidate.name,
    jobId: job.id,
    score: totalScore,
    breakdown: { skillScore, keywordScore, profileScore },
    matchedSkills: matched,
    missingSkills: missing,
  };
}

/**
 * Batch-score multiple candidates against one job.
 * Returns results sorted by score descending.
 */
export function rankCandidates(candidates: CandidateProfile[], job: JobProfile): MatchResult[] {
  return candidates
    .map((c) => scoreMatch(c, job))
    .sort((a, b) => b.score - a.score);
}

/**
 * Batch-score multiple jobs against one candidate.
 * Returns results sorted by score descending.
 */
export function rankJobs(candidate: CandidateProfile, jobs: JobProfile[]): MatchResult[] {
  return jobs
    .map((j) => scoreMatch(candidate, j))
    .sort((a, b) => b.score - a.score);
}
