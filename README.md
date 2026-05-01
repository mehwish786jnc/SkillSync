# SkillSync

**AI-Powered Talent Matching & Hiring Platform**

SkillSync is a full-stack application that leverages AI to match candidates with job opportunities based on skill analysis, resume parsing, and semantic matching. It features real-time chat, a premium design system, and a complete CI/CD pipeline.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [AI Service](#ai-service)
- [Real-Time Chat](#real-time-chat)
- [Design System](#design-system)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [License](#license)

---

## Features

- **AI-Powered Matching** — TF-IDF + cosine similarity scoring between candidates and jobs (0–100 score)
- **Resume Parsing** — NLP-based skill extraction from resumes with 200+ skill taxonomy
- **Real-Time Chat** — WebSocket-powered messaging with typing indicators, presence tracking, and message history
- **Role-Based Access** — JWT authentication with `CANDIDATE` and `RECRUITER` roles
- **Application Pipeline** — Full hiring workflow: Applied → Reviewed → Shortlisted → Interview → Offered
- **Premium UI** — Framer Motion micro-interactions, page transitions, loading skeletons, and a reusable design system
- **Analytics Dashboard** — Interactive charts (Recharts) showing application trends, pipeline funnel, and weekly activity
- **Dockerized Deployment** — Single-command startup with Docker Compose
- **Jenkins CI/CD** — Automated build, test, dockerize, and deploy pipeline

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Nginx (Port 3000)                       │
│              Reverse Proxy + SPA + WebSocket Upgrade             │
└──────────┬──────────────────┬──────────────────┬────────────────┘
           │                  │                  │
     /api/*             /socket.io/*         /ai/*
           │                  │                  │
┌──────────▼──────────────────▼──┐    ┌──────────▼──────────────┐
│     Node.js Backend (4000)      │    │  Python AI Service (8000)│
│   Express + Prisma + Socket.io  │    │   FastAPI + scikit-learn  │
└──────────────┬──────────────────┘    └────────────────────────────┘
               │
    ┌──────────▼──────────┐
    │  PostgreSQL (5432)   │
    │    16-alpine         │
    └──────────────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI library |
| TypeScript 5 | Type safety |
| Vite 5 | Build tooling |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations & micro-interactions |
| React Router 6 | Client-side routing |
| TanStack Query | Server state management |
| Recharts | Data visualization |
| Lucide React | Icon system |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js 20 | Runtime |
| Express 4 | HTTP framework |
| TypeScript 5 | Type safety |
| Prisma 7 | ORM & migrations |
| PostgreSQL 16 | Database |
| Socket.io 4 | WebSocket real-time communication |
| JWT + bcrypt | Authentication |
| Zod | Input validation |
| Winston | Structured logging |
| Helmet + CORS | Security |

### AI Service
| Technology | Purpose |
|-----------|---------|
| Python 3.11 | Runtime |
| FastAPI | High-performance API |
| scikit-learn | TF-IDF & cosine similarity |
| Pydantic 2 | Data validation |
| uvicorn | ASGI server |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| Docker + Compose | Containerization |
| Nginx | Reverse proxy & static serving |
| Jenkins | CI/CD pipeline |
| Kubernetes | Production deployment target |

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **Python** 3.11+
- **Docker** & **Docker Compose** v2+
- **PostgreSQL** 16+ (if running without Docker)

### Run with Docker (Recommended)

```bash
cd infra
docker compose up --build
```

All services start automatically:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React SPA served via Nginx |
| Backend API | http://localhost:4000 | Express REST API |
| AI Service | http://localhost:8000 | FastAPI NLP service |
| PostgreSQL | localhost:5432 | Database (user: `skillsync`, password: `skillsync_dev`) |

### Run Individually (Development)

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**AI Service:**
```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## Project Structure

```
SkillSync/
├── frontend/                    # React + TypeScript SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Design system (Button, Card, Modal, Badge, etc.)
│   │   │   └── layout/        # AppLayout, Sidebar, Navbar, MobileNav
│   │   ├── pages/             # Route pages (Landing, Dashboard, Jobs, Chat, Profile)
│   │   ├── services/          # API client (Axios)
│   │   ├── context/           # Theme context
│   │   ├── App.tsx            # Route definitions
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Design tokens & Tailwind config
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Prisma client, logger, environment
│   │   ├── controllers/       # Auth, User, Job, Application, Match, Chat
│   │   ├── middleware/        # JWT auth, role-based authorization, error handler
│   │   ├── routes/            # Express route definitions
│   │   ├── socket/            # Socket.io real-time chat
│   │   ├── utils/             # Matching algorithm
│   │   ├── validators/        # Zod schemas
│   │   └── server.ts          # App entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database models
│   │   └── prisma.config.ts   # Prisma v7 configuration
│   ├── package.json
│   └── tsconfig.json
│
├── ai-service/                 # Python FastAPI service
│   ├── app/
│   │   ├── nlp/               # Skill extraction (200+ taxonomy) & TF-IDF matcher
│   │   ├── routes/            # /health, /skills, /resume endpoints
│   │   ├── config.py          # Environment configuration
│   │   └── main.py            # FastAPI app
│   ├── requirements.txt
│   └── pyproject.toml
│
├── infra/                      # Infrastructure
│   ├── docker-compose.yml      # Full-stack orchestration
│   └── docker/
│       ├── backend.Dockerfile
│       ├── frontend.Dockerfile
│       ├── ai-service.Dockerfile
│       └── nginx.conf          # Reverse proxy configuration
│
├── Jenkinsfile                 # CI/CD pipeline
└── README.md
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/profile` | Get own profile | Yes |
| PUT | `/api/users/profile` | Update profile & skills | Yes |

### Jobs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/jobs` | List all published jobs | Yes |
| POST | `/api/jobs` | Create a job (Recruiter) | Recruiter |
| GET | `/api/jobs/:id` | Get job details | Yes |
| PUT | `/api/jobs/:id` | Update a job | Recruiter |
| DELETE | `/api/jobs/:id` | Delete a job | Recruiter |

### Applications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/applications` | Apply to a job | Candidate |
| GET | `/api/applications` | List own applications | Yes |
| PATCH | `/api/applications/:id/status` | Update status | Recruiter |

### Matching

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/matching/jobs` | Get matched jobs with scores | Candidate |
| GET | `/api/matching/candidates/:jobId` | Get matched candidates | Recruiter |

### Chat

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/chat/rooms` | List chat rooms | Yes |
| POST | `/api/chat/rooms` | Create/get a chat room | Yes |
| GET | `/api/chat/rooms/:id/messages` | Get message history (paginated) | Yes |

### AI Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/skills/extract` | Extract skills from text |
| POST | `/api/resume/parse` | Parse resume text |
| POST | `/api/resume/match` | Match candidate to a job |
| POST | `/api/resume/match-batch` | Match candidate to multiple jobs |

---

## Database Schema

```
┌──────────────┐       ┌──────────────┐       ┌──────────────────┐
│    Users     │       │     Jobs     │       │  Applications    │
├──────────────┤       ├──────────────┤       ├──────────────────┤
│ id (uuid)    │──┐    │ id (uuid)    │──┐    │ id (uuid)        │
│ email        │  │    │ title        │  │    │ status (enum)    │
│ password     │  │    │ company      │  │    │ coverNote        │
│ name         │  │    │ location     │  └────│ jobId            │
│ role (enum)  │  │    │ description  │       │ candidateId      │──┐
│ skills[]     │  │    │ type         │       └──────────────────┘  │
│ avatar       │  │    │ salary       │                             │
│ bio          │  │    │ skills[]     │       ┌──────────────────┐  │
└──────────────┘  │    │ status (enum)│       │   ChatRoom       │  │
                  │    │ recruiterId  │──┐    ├──────────────────┤  │
                  │    └──────────────┘  │    │ id (uuid)        │  │
                  │                      │    │ members[]        │  │
                  └──────────────────────┘    │ messages[]       │  │
                                              └──────────────────┘  │
                                                                    │
                  ┌─────────────────────────────────────────────────┘
                  │
            ┌─────▼──────────┐       ┌──────────────────┐
            │ ChatRoomMember │       │    Message        │
            ├────────────────┤       ├──────────────────┤
            │ roomId         │       │ id (uuid)        │
            │ userId         │       │ content          │
            └────────────────┘       │ roomId           │
                                     │ senderId         │
                                     └──────────────────┘
```

**Enums:**
- `Role`: `CANDIDATE` | `RECRUITER`
- `JobStatus`: `DRAFT` | `PUBLISHED` | `CLOSED`
- `ApplicationStatus`: `PENDING` | `REVIEWED` | `SHORTLISTED` | `INTERVIEW` | `OFFERED` | `REJECTED` | `WITHDRAWN`

---

## AI Service

### Skill Extraction

The NLP module maintains a taxonomy of 200+ skills with canonical names and variant aliases. It uses regex-based matching with word boundaries for accurate extraction from free-form text.

```python
# Example
POST /api/skills/extract
{ "text": "5 years of experience with React, TypeScript, and Node.js" }

# Response
{ "skills": ["React", "TypeScript", "Node.js"] }
```

### Job Matching Algorithm

The matching engine uses a weighted blend:

| Component | Weight | Method |
|-----------|--------|--------|
| Semantic Similarity | 45% | TF-IDF vectorization + cosine similarity |
| Skill Overlap | 55% | Jaccard-like coefficient of extracted skills |

Scores range from 0–100, with detailed breakdowns per factor.

---

## Real-Time Chat

Powered by Socket.io with JWT authentication on the WebSocket handshake.

**Events:**

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_room` | Client → Server | Join a chat room |
| `send_message` | Client → Server | Send a message |
| `new_message` | Server → Client | Receive a message |
| `typing` | Client → Server | Typing indicator |
| `user_typing` | Server → Client | Broadcast typing |
| `user_online` | Server → Client | Presence notification |

---

## Design System

The frontend uses a token-based design system for consistency:

### Typography Scale

| Token | Size | Use Case |
|-------|------|----------|
| `display` | 56px | Hero headlines |
| `h1` | 36px | Page titles |
| `h2` | 30px | Section headers |
| `h3` | 24px | Card titles |
| `h4` | 20px | Subsections |
| `body-lg` | 18px | Lead paragraphs |
| `body` | 16px | Default text |
| `body-sm` | 14px | Secondary text |
| `caption` | 12px | Labels, timestamps |
| `overline` | 11px | Badges, tags |

### Color Palette

- **Primary** (Indigo): 50–900 shades for brand elements
- **Surface** (Zinc): 50–950 for backgrounds, text, borders
- **Semantic**: Success (green), Warning (amber), Error (red), Info (blue)

### Components

| Component | Variants |
|-----------|----------|
| `Button` | `primary`, `secondary`, `ghost`, `danger`, `success`, `outline` × sizes `xs`/`sm`/`md`/`lg` |
| `Card` | `default`, `elevated`, `outlined`, `ghost`, `gradient` × padding `none`/`sm`/`md`/`lg` |
| `Badge` | `default`, `primary`, `success`, `warning`, `error`, `info`, `outline` |
| `Modal` | Spring-animated with blur backdrop, size `sm`/`md`/`lg`/`xl` |
| `Typography` | All scale tokens as a composable React component |
| `Skeleton` | Shimmer-animated loading placeholders (Card, Row, Chart, Page) |

---

## CI/CD Pipeline

The `Jenkinsfile` defines a 4-stage pipeline:

```
Build (parallel) → Test (parallel) → Dockerize → Deploy
```

| Stage | Actions |
|-------|---------|
| **Build** | TypeScript compilation (backend + frontend), Python syntax check |
| **Test** | Jest (backend), Vitest (frontend), pytest (AI), ESLint |
| **Dockerize** | Build & push images to container registry |
| **Deploy** | Rolling update to Kubernetes via `kubectl` (main/staging branches only) |

---

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | JWT signing secret | — |
| `CORS_ORIGIN` | Allowed origin | `http://localhost:3000` |
| `AI_SERVICE_URL` | AI service base URL | `http://localhost:8000` |

### AI Service

| Variable | Description | Default |
|----------|-------------|---------|
| `HOST` | Bind address | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `DEBUG` | Enable debug mode | `false` |

### Frontend (Build-time)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4000` |

---

## Development

### Code Quality

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint

# AI Service
cd ai-service && ruff check .
```

### Testing

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# AI Service
cd ai-service && pytest
```

### Database Migrations

```bash
cd backend
npx prisma migrate dev --name <migration_name>   # Create migration
npx prisma migrate deploy                         # Apply migrations
npx prisma studio                                 # Visual DB browser
```

---

## License

This is a personal project. All rights reserved.
