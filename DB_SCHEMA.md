# Database Schema

## Database

SQLite.

Connection:

```env
DATABASE_URL=
```

Use UUID primary keys, UTC timestamps, foreign keys, unique constraints, and indexes.

## users

- id UUID PK
- username UNIQUE NOT NULL
- phone_number NULLABLE UNIQUE
- display_name NOT NULL
- avatar_url NULLABLE
- password_hash NOT NULL
- is_online NOT NULL DEFAULT false
- last_seen_at NULLABLE
- created_at
- updated_at

## sessions

- id UUID PK
- user_id FK users.id
- token/session identifier
- expires_at
- created_at

Index user_id and token/session lookup as appropriate.

## contacts

- id UUID PK
- owner_user_id FK users.id
- contact_user_id FK users.id
- nickname NULLABLE
- created_at

Unique:
`owner_user_id + contact_user_id`

## conversations

- id UUID PK
- type: DIRECT | GROUP
- name NULLABLE
- avatar_url NULLABLE
- created_by NULLABLE FK users.id
- created_at
- updated_at

Direct conversations must be unique per unordered pair of users. Implement this safely at the application/database layer.

## conversation_members

- id UUID PK
- conversation_id FK conversations.id
- user_id FK users.id
- role: ADMIN | MEMBER
- joined_at
- left_at NULLABLE
- last_read_message_id NULLABLE FK messages.id

Unique:
`conversation_id + user_id`

## messages

- id UUID PK
- conversation_id FK conversations.id
- sender_id FK users.id
- body
- message_type: TEXT | IMAGE | FILE | SYSTEM
- reply_to_message_id NULLABLE FK messages.id
- created_at
- updated_at
- deleted_at NULLABLE

MVP requires TEXT.

## message_receipts

- id UUID PK
- message_id FK messages.id
- user_id FK users.id
- status: SENT | DELIVERED | READ
- created_at
- updated_at

Unique:
`message_id + user_id`

## typing_indicators

Do not persist unless necessary. Keep active typing state in the WebSocket manager for the MVP.

## attachments

Optional:
- id
- message_id
- file_name
- file_url
- mime_type
- file_size
- created_at

Only implement after P0 works.

## Required Indexes

At minimum:
- users(username)
- users(phone_number)
- conversations(updated_at)
- messages(conversation_id, created_at)
- conversation_members(conversation_id, user_id)
- message_receipts(message_id, user_id)
- contacts(owner_user_id, contact_user_id)

## Seed Data

At least:
- Alice Johnson
- Bob Smith
- Charlie Brown
- David Miller
- Emma Wilson

Create:
- several direct conversations
- at least one group
- realistic messages
- unread/read/delivered examples
- varied timestamps
- online/offline states

The UI should look populated immediately after seeding.

## Migration Requirements

Use:

```bash
alembic upgrade head
```

Do not use `Base.metadata.create_all()` as the production schema-management mechanism.
