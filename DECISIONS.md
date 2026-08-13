# Architecture Decisions

## ADR-001: SQLite Database

**Decision:** Use SQLite.

**Reason:** The assignment specifically requires using SQLite as the database.

**Implication:** Alembic migrations must target SQLite.

## ADR-002: FastAPI Backend

**Decision:** FastAPI with SQLAlchemy 2.x, Pydantic, and Alembic.

**Reason:** Clear separation of API, service, persistence, and WebSocket layers with strong typing and easy local development.

## ADR-003: HTTP-Only Cookie Sessions

**Decision:** Use secure HTTP-only cookies rather than storing access tokens in localStorage.

**Reason:** Reduces exposure to client-side token theft and is appropriate for a browser-based application.

For local HTTP development, `Secure` may need to be disabled by configuration. In production it must be enabled.

## ADR-004: WebSockets for Real-Time State

**Decision:** FastAPI WebSockets provide real-time message, typing, presence, and receipt events.

**Reason:** WebSockets are a direct fit for a messaging application and are explicitly required.

## ADR-005: In-Memory WebSocket Presence

**Decision:** Keep connection/typing state in application memory for the assignment.

**Reason:** Redis is unnecessary for the MVP. The architecture should isolate this state so Redis can be introduced later.

## ADR-006: Simulated Encryption

**Decision:** Do not implement actual Signal Protocol cryptography.

**Reason:** This is a UI/full-stack assignment and explicitly permits mocked encryption.

README must state: encryption is simulated and does not implement Signal Protocol cryptography.

## ADR-007: Desktop-First UI

**Decision:** Optimize primarily for desktop/macOS dimensions and interactions.

**Reason:** The supplied Signal Desktop screenshots are the primary visual reference.

## ADR-008: Independent Implementation

**Decision:** Recreate visual hierarchy and interaction patterns independently.

Do not copy Signal source code, proprietary assets, logos, or private implementation details.

## ADR-009: Iterative Agent Workflow

**Decision:** Build in phases: analyze → database → backend → frontend foundation → auth → UI → real time → groups → polish → tests.

**Reason:** Prevents a giant unverified implementation and makes failures easier to isolate.

## ADR-010: Seeded Development Data

**Decision:** Seed at least five users, multiple direct conversations, groups, realistic messages, receipts, unread states, and presence.

**Reason:** The application should look populated immediately after setup and support meaningful manual testing.
