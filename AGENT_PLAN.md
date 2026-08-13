# Agent Implementation Plan

## Mission

Implement the complete Signal-style messaging platform in this repository. Do not stop at scaffolding.

## Phase 1 — Analyze

Before modifying code:
- inspect repository
- inspect all existing frontend/backend files
- read project markdown files
- inspect supplied Signal screenshots
- identify existing reusable work
- identify gaps
- create a short implementation plan

Do not blindly overwrite existing work.

## Phase 2 — Database

Implement:
- SQLAlchemy models
- relationships
- constraints
- indexes
- Alembic configuration
- initial migration
- seed script

Then run the migration and seed against the configured database.

## Phase 3 — Backend

Implement:
- config
- database
- security/session handling
- auth
- users
- contacts
- conversations
- messages
- groups
- receipts
- WebSocket manager and handlers

Then test the APIs.

## Phase 4 — Frontend Foundation

Implement:
- Next.js App Router
- Tailwind
- global styling
- theme tokens
- layout
- reusable primitives
- API client
- auth state

## Phase 5 — Auth

Implement:
- login
- registration
- mocked OTP
- session persistence
- logout
- protected app routes

## Phase 6 — Main UI

Implement from the supplied screenshots:
- sidebar
- search
- conversation list
- selected state
- chat header
- messages
- composer
- empty states
- settings
- new message flow

## Phase 7 — Real Time

Connect WebSockets.

Verify:
- messages
- typing
- delivery
- read
- presence
- reconnect
- duplicate connection prevention

## Phase 8 — Groups

Implement:
- group creation
- member selection
- member list
- group messaging
- admin add/remove
- rename

## Phase 9 — Polish

Perform a screenshot-driven UI review.

Fix:
- proportions
- spacing
- typography
- colors
- borders
- alignment
- hover/focus states
- message bubbles
- sidebar
- composer
- responsive behavior

## Phase 10 — Verification

Run:
- backend tests
- frontend lint
- frontend type check
- frontend build
- migrations
- seed
- manual acceptance flow

Fix all obvious errors.

## Agent Behavior

At every phase:
1. inspect
2. make a plan
3. implement a focused change
4. run the relevant check
5. fix failures
6. summarize what changed
7. continue to the next phase

Do not wait for the user after every tiny step. Continue through the plan when the next action is unambiguous.

Do not make unrelated refactors.

## Final Completion

Only report completion when the repository is actually runnable and the required acceptance flow has been tested.
