# Signal-Style Secure Messaging Platform

## Overview

A production-quality full-stack desktop-first messaging application inspired by the visual language and interaction patterns of Signal Desktop.

This is an independent implementation for an SDE Fullstack assignment. It must not copy Signal source code, proprietary assets, logos, or cryptographic protocol implementation.

## Goals

- Polished Signal-style desktop UX
- Real authentication and session persistence
- SQLite persistence
- REST API with FastAPI
- Real-time messaging through WebSockets
- Direct and group conversations
- Typing indicators
- Sent/delivered/read states
- Search, contacts, unread counts
- Professional architecture and documentation
- Runnable locally and deployable

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui where useful
- Lucide React
- React Hook Form
- Zod
- TanStack Query where useful

### Backend
- Python
- FastAPI
- SQLAlchemy 2.x
- Alembic
- Pydantic
- SQLite
- FastAPI WebSockets
- Secure HTTP-only cookie sessions

### Infrastructure
- Frontend: Vercel
- Backend: Render or Railway

## Repository

```text
shared-expenses/
├── backend/
├── frontend/
├── README.md
├── SCOPE.md
├── DECISIONS.md
├── AI_USAGE.md
├── UI_SPEC.md
├── DB_SCHEMA.md
├── API_CONTRACT.md
├── TEST_PLAN.md
└── AGENT_PLAN.md
```

## Local Development

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python scripts/seed.py
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

See `.env.example` files for required configuration.

## Important Assignment Assumptions

- OTP verification is intentionally mocked with `123456`.
- Encryption is simulated and is NOT Signal Protocol cryptography.
- Voice/video buttons are placeholders.
- Optional bonus features must never delay required functionality.

## Definition of Done

The complete manual flow in `TEST_PLAN.md` passes, migrations and seed data work, frontend build/type checks pass, backend tests pass, and the UI has been visually reviewed against the supplied Signal screenshots.
