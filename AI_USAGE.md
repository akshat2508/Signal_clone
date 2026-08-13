# AI Agent Development Rules

## Role

The coding agent acts as a senior full-stack engineer and UI/UX engineer.

The agent has filesystem and terminal access and is expected to actually modify the repository.

## Core Rule

Do not merely explain implementation. Inspect the repository, create/modify files, run commands, test changes, and leave the workspace in a runnable state.

## Before Coding

1. Inspect the existing repository.
2. Read:
   - `README.md`
   - `SCOPE.md`
   - `DECISIONS.md`
   - `UI_SPEC.md`
   - `DB_SCHEMA.md`
   - `API_CONTRACT.md`
   - `TEST_PLAN.md`
   - `AGENT_PLAN.md`
3. Inspect the attached Signal screenshots.
4. Inspect existing frontend/backend code before creating replacements.
5. Identify existing conventions and preserve useful work.

## Coding Rules

- Do not create giant files.
- Avoid unnecessary abstractions.
- Avoid duplicated business logic.
- Use typed interfaces.
- Keep frontend/backend contracts synchronized.
- Never hardcode secrets.
- Never hardcode production URLs.
- Use environment variables.
- Validate all API inputs.
- Enforce authorization on the server.
- Keep database logic out of route handlers where practical.
- Keep WebSocket management isolated.
- Prefer small reusable React components.
- Do not add dependencies unless they solve a real need.

## UI Rules

The supplied Signal Desktop screenshots are the visual source of truth.

Prioritize:
- proportions
- sidebar width
- spacing
- typography
- avatar sizes
- separators
- selected conversation state
- message bubbles
- composer
- headers
- hover/focus states
- empty states

Do not turn the app into a generic dashboard or generic chat template.

Avoid:
- excessive gradients
- glassmorphism
- unnecessary cards
- excessive animations
- fake functionality

## Implementation Discipline

Use:

```text
Analyze
  ↓
Plan
  ↓
Implement
  ↓
Run checks
  ↓
Fix failures
  ↓
Review
  ↓
Continue
```

Do not implement the entire application as one unverified operation.

## Required Verification

After meaningful changes:
- run backend tests
- run frontend lint
- run frontend type checking
- run frontend build
- verify migrations
- verify seed script
- inspect runtime errors
- verify WebSocket behavior

## No Fake Functionality

Required features must work:
- registration
- OTP verification
- login
- logout
- session persistence
- contacts
- direct conversations
- messages
- persistence
- WebSockets
- typing
- delivery/read states
- groups
- membership/admin controls
- search

Only optional features may say "Coming Soon".

## Security

This is not a real secure messenger.

Never claim Signal Protocol encryption exists.

Still implement:
- password hashing
- HTTP-only cookies
- CORS
- validation
- authorization
- SQLAlchemy parameterization
- environment variables
- safe error handling
- no committed credentials

## When Stuck

Inspect the code and error output first. Prefer the smallest correct fix. Do not rewrite unrelated modules.

## Final Response

When complete, summarize:
1. What was built
2. Architecture
3. Database schema
4. WebSocket architecture
5. Important files
6. Local commands
7. Environment variables
8. Seed credentials
9. Test results
10. Deployment
11. Known limitations
