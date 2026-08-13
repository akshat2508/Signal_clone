# Project Scope

## Product

Build a functional Signal-style secure messaging platform for an SDE Fullstack assignment.

## P0 — Required

### Authentication
- Register with username/phone, display name, password, optional avatar
- Mock OTP verification using `123456`
- Login with username/password
- Secure HTTP-only session cookie
- `GET /api/auth/me`
- Logout and session invalidation
- Session survives browser refresh

### Users and Contacts
- User listing
- User search
- Add contact
- Remove contact
- Contact nickname support

### Conversations
- Direct conversations
- Group conversations
- Conversation list sorted by latest activity
- Unread counts
- Conversation detail
- Membership authorization

### Messaging
- Text messages
- Persistence in SQLite
- Pagination/infinite scroll
- Optimistic sending where appropriate
- Sending/sent/delivered/read states
- Timestamps
- Incoming/outgoing styling
- Date and unread dividers
- Reply reference field may exist even if reply UI is deferred

### Real Time
- WebSocket connections
- Message broadcast
- Delivery/read events
- Typing started/stopped
- Online/offline presence
- Group membership/conversation update events
- Automatic reconnect with exponential backoff
- No duplicate socket connections

### Groups
- Create group
- Select members
- Group name
- Member list
- Admin/member roles
- Add/remove members
- Rename group
- Group messages

### UI
- Signal Desktop-inspired layout
- Sidebar
- Profile area
- Search
- New message
- Conversation list
- Chat header
- Message history
- Composer
- Empty/loading/error states
- Settings
- Responsive behavior

## P1 — Polish

- Skeleton loading
- Toasts
- Confirmation dialogs
- Hover/focus/disabled states
- Keyboard navigation
- Subtle transitions
- Dark mode
- Better mobile behavior
- Keyboard shortcuts

## P2 — Bonus

Only after P0 is stable:

1. Message reactions
2. Reply-to messages
3. Attachments
4. Disappearing messages
5. Dark mode
6. Keyboard shortcuts
7. Enhanced mobile layout

## Explicit Non-Goals

Do not spend assignment time on:
- Real Signal Protocol cryptography
- Real phone/SMS delivery
- Real voice calls
- Real video calls
- Complex media processing
- Production-scale distributed infrastructure
- Unnecessary microservices
