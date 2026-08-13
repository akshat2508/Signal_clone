# Test Plan

## Backend Automated Tests

Minimum coverage:
- registration
- OTP verification
- login
- authentication
- logout
- session persistence
- conversation creation
- direct conversation uniqueness
- message creation
- message persistence
- authorization
- group creation
- group membership
- group admin controls

## Frontend Checks

Run:
- lint
- TypeScript type checking
- production build

Test critical UI flows where practical:
- login
- registration/OTP
- conversation selection
- sending a message
- search
- new conversation
- group creation
- settings navigation

## WebSocket Manual Test

Open two authenticated sessions as different users.

1. User A opens conversation with User B.
2. User B opens same conversation.
3. A sends a message.
4. B receives it without refresh.
5. A sees sent state.
6. B receives delivered state.
7. B opens/reads message.
8. A sees read state.
9. B starts typing.
10. A sees typing indicator.
11. B stops typing.
12. Indicator disappears.
13. Drop/restart socket.
14. Verify automatic reconnect.
15. Confirm no duplicate messages/connections.

## Full Manual Acceptance Flow

1. Start backend.
2. Start frontend.
3. Run migrations.
4. Seed database.
5. Register a user.
6. Verify OTP.
7. Login.
8. Refresh and confirm session persistence.
9. Search for another user.
10. Add contact.
11. Create/open direct conversation.
12. Send message.
13. Open second browser/session as another user.
14. Verify real-time delivery.
15. Verify typing.
16. Verify delivery.
17. Verify read state.
18. Create a group.
19. Add members.
20. Send group messages.
21. Test group admin functionality.
22. Logout.
23. Login again.
24. Confirm conversations/messages remain.
25. Run frontend production build.
26. Run backend tests.
27. Fix all obvious errors.

## Quality Gates

Do not call the project complete if:
- TypeScript errors remain
- Python tests fail
- migrations fail
- seed script fails
- required buttons are fake
- protected APIs lack authorization
- WebSocket messages do not persist
- refresh loses authentication
- the UI looks like a generic dashboard instead of the supplied reference
