"""
Skill extraction engine.

Uses a curated taxonomy of 200+ tech skills with pattern matching.
Handles multi-word skills, abbreviations, and common variants.
"""

import re
from dataclasses import dataclass

# ── Skill taxonomy ──────────────────────────────────────────────────────────
# Each entry: canonical name → set of aliases/variants (all lowercase)

SKILL_TAXONOMY: dict[str, set[str]] = {
    # Languages
    "Python": {"python", "python3", "py"},
    "JavaScript": {"javascript", "js", "ecmascript", "es6", "es2015"},
    "TypeScript": {"typescript", "ts"},
    "Java": {"java"},
    "C#": {"c#", "csharp", "c-sharp"},
    "C++": {"c++", "cpp"},
    "C": {"\\bc\\b"},  # word-boundary regex
    "Go": {"golang", "go lang"},
    "Rust": {"rust", "rustlang"},
    "Ruby": {"ruby"},
    "PHP": {"php"},
    "Swift": {"swift"},
    "Kotlin": {"kotlin"},
    "Scala": {"scala"},
    "R": {"\\br\\b", "r lang", "rlang"},
    "Dart": {"dart"},
    "Lua": {"lua"},
    "Perl": {"perl"},
    "Shell": {"bash", "shell", "zsh", "sh scripting"},
    "SQL": {"sql"},

    # Frontend
    "React": {"react", "reactjs", "react.js"},
    "Angular": {"angular", "angularjs", "angular.js"},
    "Vue.js": {"vue", "vuejs", "vue.js"},
    "Svelte": {"svelte", "sveltekit"},
    "Next.js": {"next.js", "nextjs", "next js"},
    "Nuxt.js": {"nuxt", "nuxtjs", "nuxt.js"},
    "HTML": {"html", "html5"},
    "CSS": {"css", "css3"},
    "Tailwind CSS": {"tailwind", "tailwindcss", "tailwind css"},
    "Bootstrap": {"bootstrap"},
    "Sass": {"sass", "scss"},
    "jQuery": {"jquery"},
    "Redux": {"redux", "redux toolkit"},
    "Webpack": {"webpack"},
    "Vite": {"vite", "vitejs"},

    # Backend
    "Node.js": {"node.js", "nodejs", "node js", "node"},
    "Express": {"express", "expressjs", "express.js"},
    "FastAPI": {"fastapi", "fast api"},
    "Django": {"django"},
    "Flask": {"flask"},
    "Spring Boot": {"spring boot", "springboot", "spring"},
    "ASP.NET": {"asp.net", "aspnet", ".net core", "dotnet"},
    "Ruby on Rails": {"ruby on rails", "rails", "ror"},
    "Laravel": {"laravel"},
    "NestJS": {"nestjs", "nest.js"},
    "GraphQL": {"graphql", "graph ql"},
    "REST": {"rest", "restful", "rest api"},
    "gRPC": {"grpc", "g-rpc"},

    # Databases
    "PostgreSQL": {"postgresql", "postgres", "psql"},
    "MySQL": {"mysql"},
    "MongoDB": {"mongodb", "mongo"},
    "Redis": {"redis"},
    "SQLite": {"sqlite"},
    "Elasticsearch": {"elasticsearch", "elastic search", "elastic"},
    "DynamoDB": {"dynamodb", "dynamo db"},
    "Cassandra": {"cassandra"},
    "Neo4j": {"neo4j"},
    "Firebase": {"firebase", "firestore"},
    "Supabase": {"supabase"},
    "Prisma": {"prisma", "prisma orm"},

    # Cloud & DevOps
    "AWS": {"aws", "amazon web services"},
    "Azure": {"azure", "microsoft azure"},
    "GCP": {"gcp", "google cloud", "google cloud platform"},
    "Docker": {"docker", "dockerfile"},
    "Kubernetes": {"kubernetes", "k8s"},
    "Terraform": {"terraform"},
    "Ansible": {"ansible"},
    "Jenkins": {"jenkins"},
    "GitHub Actions": {"github actions", "gh actions"},
    "CI/CD": {"ci/cd", "cicd", "ci cd", "continuous integration", "continuous deployment"},
    "Linux": {"linux", "ubuntu", "centos", "debian"},
    "Nginx": {"nginx"},
    "Apache": {"apache", "httpd"},

    # Data & ML
    "Machine Learning": {"machine learning", "ml"},
    "Deep Learning": {"deep learning", "dl"},
    "NLP": {"nlp", "natural language processing"},
    "Computer Vision": {"computer vision", "cv", "image recognition"},
    "TensorFlow": {"tensorflow", "tf"},
    "PyTorch": {"pytorch", "torch"},
    "Scikit-learn": {"scikit-learn", "sklearn", "scikit learn"},
    "Pandas": {"pandas"},
    "NumPy": {"numpy"},
    "Spark": {"apache spark", "spark", "pyspark"},
    "Hadoop": {"hadoop"},
    "Airflow": {"airflow", "apache airflow"},
    "Kafka": {"kafka", "apache kafka"},
    "Data Engineering": {"data engineering", "data pipeline"},
    "Data Science": {"data science"},
    "Statistics": {"statistics", "statistical analysis"},

    # Tools & Practices
    "Git": {"git", "github", "gitlab", "bitbucket"},
    "Agile": {"agile", "scrum", "kanban"},
    "Jira": {"jira"},
    "Figma": {"figma"},
    "Microservices": {"microservices", "micro services", "microservice architecture"},
    "Serverless": {"serverless", "lambda"},
    "WebSockets": {"websocket", "websockets", "socket.io"},
    "OAuth": {"oauth", "oauth2", "openid"},
    "JWT": {"jwt", "json web token"},
    "Unit Testing": {"unit testing", "unit tests", "jest", "pytest", "junit"},
    "TDD": {"tdd", "test driven development"},
    "API Design": {"api design", "api development"},
}


@dataclass
class ExtractedSkill:
    """A skill found in text with its position."""
    name: str        # Canonical skill name
    variant: str     # The actual text that matched
    start: int       # Character offset in source text
    end: int


def extract_skills(text: str) -> list[ExtractedSkill]:
    """
    Extract skills from free-form text using the taxonomy.

    Handles:
    - Case-insensitive matching
    - Multi-word skills (e.g., "machine learning")
    - Abbreviations and variants
    - Word-boundary patterns for short tokens (C, R)
    - Deduplication (same canonical skill matched multiple times)

    Returns deduplicated list sorted by position in text.
    """
    text_lower = text.lower()
    seen: dict[str, ExtractedSkill] = {}  # canonical name → first occurrence

    for canonical, variants in SKILL_TAXONOMY.items():
        for variant in variants:
            # Some variants use regex word boundaries (for short tokens like "C", "R")
            if variant.startswith("\\b"):
                pattern = variant
            else:
                # Escape special regex chars and add word boundaries
                escaped = re.escape(variant)
                pattern = rf"\b{escaped}\b"

            for match in re.finditer(pattern, text_lower):
                if canonical not in seen:
                    seen[canonical] = ExtractedSkill(
                        name=canonical,
                        variant=text[match.start():match.end()],
                        start=match.start(),
                        end=match.end(),
                    )
                break  # One match per variant is enough

    # Return sorted by position
    return sorted(seen.values(), key=lambda s: s.start)


def extract_skill_names(text: str) -> list[str]:
    """Convenience: extract just canonical skill names from text."""
    return [s.name for s in extract_skills(text)]
