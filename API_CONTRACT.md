# API Contract

Base path:

```text
/api
```

All protected endpoints require an authenticated session.

## Auth

### POST `/api/auth/register`

Create a pending user/registration flow.

### POST `/api/auth/verify`

Verify mocked OTP.

Default development OTP:

```text
123456
```

### POST `/api/auth/login`

Authenticate username/password and establish HTTP-only session.

### POST `/api/auth/logout`

Invalidate current session.

### GET `/api/auth/me`

Return current authenticated user.

## Users

### GET `/api/users`

List users as permitted by the product.

### GET `/api/users/search?q=...`

Search users by username/display name/phone as appropriate.

## Contacts

### GET `/api/contacts`

Return current user's contacts.

### POST `/api/contacts`

Add a contact.

### DELETE `/api/contacts/{id}`

Remove a contact.

## Conversations

### GET `/api/conversations`

Return conversations for current user, sorted by latest activity.

Include enough information for the sidebar:
- id
- type
- display name
- avatar
- latest message preview
- latest timestamp
- unread count
- online/last-seen information where applicable

### POST `/api/conversations/direct`

Create or return the unique direct conversation between two users.

### POST `/api/conversations/group`

Create a group with name and initial members.

### GET `/api/conversations/{id}`

Return conversation details after membership authorization.

### PATCH `/api/conversations/{id}`

Update allowed conversation metadata, especially group name.

### GET `/api/conversations/{id}/messages`

Paginated message history.

Recommended parameters:
- `limit`
- `before`
- `after`

### POST `/api/conversations/{id}/messages`

Create and persist a message.

### POST `/api/conversations/{id}/read`

Update read state.

## Group Membership

### POST `/api/conversations/{id}/members`

Add a member. Only authorized group admins.

### DELETE `/api/conversations/{id}/members/{user_id}`

Remove a member. Only authorized group admins.

## Authorization

A user must not:
- read conversations they do not belong to
- send to conversations they do not belong to
- modify groups they do not administer
- manipulate another user's receipts
- access another user's private session

Return consistent HTTP errors:
- 400 invalid request
- 401 unauthenticated
- 403 forbidden
- 404 not found
- 409 conflict
- 422 validation failure
- 500 unexpected server failure

## WebSocket

Endpoint:

```text
/ws/conversations/{conversation_id}
```

Authenticate the connection using the current secure session.

Events:

```text
MESSAGE_SENT
MESSAGE_CREATED
MESSAGE_DELIVERED
MESSAGE_READ
TYPING_STARTED
TYPING_STOPPED
USER_ONLINE
USER_OFFLINE
GROUP_MEMBER_ADDED
GROUP_MEMBER_REMOVED
CONVERSATION_UPDATED
```

Example message event:

```json
{
  "type": "MESSAGE_CREATED",
  "conversation_id": "uuid",
  "message": {
    "id": "uuid",
    "sender_id": "uuid",
    "body": "Hello",
    "message_type": "TEXT",
    "created_at": "2026-01-01T12:00:00Z"
  }
}
```

Keep event payloads typed and versionable.

## Contract Rule

If backend response shapes change, update corresponding frontend TypeScript types in the same change.
