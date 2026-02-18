# Goal Life Planner

A full-stack personal finance and life goal tracker. Set financial, career, and personal goals, track your saved progress, and visualize how far you've come — all behind a secure, session-based auth system.

---

## Features

- **Three goal categories** — Financial, Career, Personal & Health
- **Full CRUD** — create, edit, update saved amount, and delete goals
- **Progress tracking** — per-goal and overall progress bars with category breakdowns
- **Secure auth** — register/login/logout with JWT stored in `httpOnly` cookies (no `localStorage`)
- **Protected routes** — unauthenticated users are redirected to the login page
- **Silent token refresh** — Axios interceptor transparently refreshes the access token on 401
- **Docker deployment** — one command brings up Postgres, Redis, FastAPI, React, and Nginx

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 3 |
| State | Zustand (auth), TanStack React Query v5 (server state) |
| HTTP | Axios with single-flight refresh interceptor |
| Routing | React Router v7 |
| Backend | FastAPI 0.115, Python 3.11 |
| ORM | SQLAlchemy 2.0 async + asyncpg |
| Auth | JWT (python-jose) · bcrypt · httpOnly cookies |
| Database | PostgreSQL 16 |
| Cache / Rate-limit | Redis 7 |
| Migrations | Alembic (async) |
| Reverse proxy | Nginx |
| Containers | Docker + Docker Compose |

---

## Project Structure

```
budget-goal-life-planner/
├── docker-compose.yml
├── .env                        # secrets — never commit this
├── .env.example
│
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf              # /api/* → backend, /* → frontend SPA
│
├── frontend/                   # React + TypeScript
│   ├── Dockerfile
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/           # Login, Register, authStore, api
│   │   │   ├── goals/          # GoalsPage, GoalCard, GoalModal, hooks
│   │   │   └── dashboard/      # DashboardPage, OverallProgressCard, StatsRow
│   │   ├── shared/components/  # ProtectedRoute, Layout, LoadingSpinner, Toast
│   │   ├── lib/                # axios instance, React Query client
│   │   └── types/index.ts      # shared TypeScript types
│   └── vite.config.ts          # dev proxy /api → localhost:8000
│
└── backend/                    # FastAPI
    ├── Dockerfile
    ├── requirements.txt
    ├── alembic/                # async migrations
    └── app/
        ├── api/                # auth.py, goals.py, router.py
        ├── models/             # User, Goal (SQLAlchemy)
        ├── schemas/            # Pydantic v2 request/response models
        ├── services/           # auth_service, goal_service
        ├── dependencies.py     # get_current_user, rate_limit_auth
        ├── config.py           # pydantic-settings from .env
        └── main.py             # FastAPI app, CORS, lifespan
```

---

## Getting Started

### Option A — Docker (recommended)

**Prerequisites:** Docker + Docker Compose

```bash
# 1. Clone
git clone https://github.com/your-username/budget-goal-life-planner.git
cd budget-goal-life-planner

# 2. Create the env file
cp .env.example .env
# Edit .env — set POSTGRES_PASSWORD and SECRET_KEY

# 3. Generate a strong SECRET_KEY
openssl rand -hex 32

# 4. Start everything
docker compose up --build

# App is now available at http://localhost
```

Docker Compose starts five services:

| Service | Role | Port |
|---|---|---|
| `postgres` | Database | internal only |
| `redis` | Token blacklist + rate limiting | internal only |
| `backend` | FastAPI API | internal only |
| `frontend` | React SPA (Nginx) | internal only |
| `nginx` | Reverse proxy | **80** |

---

### Option B — Local Development

**Prerequisites:** Node ≥ 20, Python 3.11, PostgreSQL 16, Redis 7

#### Backend

```bash
# Create a virtual environment
python -m venv .venv
source .venv/bin/activate

cd backend
pip install -r requirements.txt

# Set up environment variables (copy from root .env or create backend/.env)
# DATABASE_URL and REDIS_URL must point to your local services

# Run migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
# Dev server: http://localhost:5173
# API calls are proxied to http://localhost:8000 via Vite
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|---|---|---|
| `POSTGRES_USER` | Database user | `planner` |
| `POSTGRES_PASSWORD` | Database password | *(strong secret)* |
| `POSTGRES_DB` | Database name | `goalplanner` |
| `SECRET_KEY` | JWT signing key — **64 random chars** | `openssl rand -hex 32` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost,http://localhost:5173` |

> **Never commit `.env` to version control.** It is already listed in `.gitignore`.

---

## API Reference

Base URL: `/api/v1`
Interactive docs: `http://localhost:8000/api/docs` (local dev only)

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Create account + set auth cookies |
| `POST` | `/auth/login` | Login + set auth cookies |
| `POST` | `/auth/logout` | Blacklist token + clear cookies |
| `POST` | `/auth/refresh` | Issue new access token from refresh cookie |
| `GET` | `/auth/me` | Return current user |

### Goals

All goals endpoints require authentication (access token cookie).

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/goals/` | List goals (optional `?category=financial`) |
| `POST` | `/goals/` | Create a goal |
| `GET` | `/goals/{id}` | Get a single goal |
| `PATCH` | `/goals/{id}` | Update goal fields |
| `PATCH` | `/goals/{id}/saved` | Update saved amount only |
| `DELETE` | `/goals/{id}` | Delete a goal |
| `GET` | `/goals/summary` | Aggregated progress stats |

---

## Security Notes

- Access tokens live in `httpOnly` cookies (30 min TTL) — inaccessible to JavaScript
- Refresh tokens live in `httpOnly` cookies scoped to `/api/v1/auth/refresh` (7 day TTL)
- Logout blacklists the JTI in Redis so the token cannot be reused
- Rate limiting on auth endpoints: 10 requests per IP per minute (via Redis)
- CORS explicitly lists allowed origins — `["*"]` is never used with credentials
- Passwords hashed with bcrypt (cost factor 12)

---

## License

MIT
