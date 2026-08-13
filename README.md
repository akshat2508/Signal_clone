<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Signal-Logo.svg/1200px-Signal-Logo.svg.png" alt="Signal Logo" width="100"/>
  <h1>Signal Clone (SDE Fullstack Assignment)</h1>
  <p>A fully functional, privacy-focused real-time messaging application replicating the core workflows, design, and user experience of the original Signal desktop app.</p>

  <a href="https://signal-clone-ashen.vercel.app"><strong>View Live Demo »</strong></a>
</div>

<br />

## 🚀 Live Links & Demos
- **Frontend Application**: [https://signal-clone-ashen.vercel.app](https://signal-clone-ashen.vercel.app)
- **Backend API Base**: [https://signal-clone-93gb.onrender.com/api/health](https://signal-clone-93gb.onrender.com/api/health)

> **Note on Testing**: To test the real-time functionality (like instant messaging and typing indicators), open the frontend application in two separate browser windows (or one normal and one incognito) and log in with two different accounts. 

---

## 🎨 Features
- **Real-Time WebSockets**: Instant message delivery with zero polling. 
- **Live Typing Indicators**: Visual typing bubbles (the classic 3-dot animation) that appear instantly when the other user is typing.
- **Direct & Group Messaging**: Create 1-on-1 conversations or multi-user group chats.
- **Contact Management**: Securely search for users and add them as contacts.
- **JWT Authentication**: Encrypted `bcrypt` password hashing and `HttpOnly` secure cookies.
- **Pixel-Perfect UI**: Replicates Signal's clean, minimalist light-mode aesthetic using Tailwind CSS.

---

## 🏗️ Architecture Overview

The application is built on a modern, decoupled architecture featuring a Next.js frontend and a FastAPI backend communicating over REST and WebSockets.

1. **Frontend (`/frontend`)**: Built with React (Next.js App Router). It uses **Zustand** for global state management and **Tailwind CSS** for styling. Standard REST APIs are used for data fetching, while a persistent **WebSocket** connection handles real-time bidirectional events (new messages, typing indicators).
2. **Backend (`/backend`)**: Powered by **FastAPI**, chosen for its native async support which is crucial for handling thousands of concurrent WebSocket connections efficiently.
3. **Database**: **PostgreSQL** relational database managed via **SQLAlchemy** ORM, with schema migrations handled by **Alembic**.

---

## 🗄️ Database Schema

The database is highly normalized to support complex messaging features securely.

| Table | Description |
|---|---|
| **`users`** | Core user data (username, display name, password hash, avatar url). |
| **`sessions`** | Secure session management (token, expires_at) for HTTP-only cookies. |
| **`contacts`** | Many-to-many relationship mapping users to their saved contacts. |
| **`conversations`** | Represents chat rooms. Can be `DIRECT` (1-on-1) or `GROUP`. |
| **`conversation_members`**| Maps users to conversations. Tracks join/leave dates and read receipts. |
| **`messages`** | Individual messages containing body, timestamps, and sender mapping. |
| **`message_receipts`** | Tracks delivery and read status (SENT, DELIVERED, READ) per message. |

---

## 🔌 API Overview

The backend exposes a secure REST API and a single, highly efficient WebSocket endpoint.

### REST Endpoints
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate and receive a secure HTTP-Only session cookie.
- `GET /api/auth/me` - Validate session and retrieve the current user's profile.
- `POST /api/auth/logout` - Invalidate the current session.
- `GET /api/users/search` - Search the global directory to find users to chat with.
- `GET /api/contacts` - Fetch the authenticated user's contact list.
- `POST /api/conversations/direct` - Initialize or retrieve a direct 1-on-1 conversation.
- `POST /api/conversations/group` - Create a multi-member group conversation.
- `GET /api/conversations/{id}/messages` - Fetch historical messages for a specific chat.

### WebSocket Endpoint
- `WS /ws/conversations` - Single bidirectional stream handling `NEW_MESSAGE`, `TYPING_STARTED`, and `TYPING_STOPPED` events globally.

---

## 💻 Local Development Setup

To run this project locally, you will need Node.js (v18+) and Python (v3.10+).

### 1. Clone the repository
```bash
git clone https://github.com/akshat2508/Signal_clone.git
cd Signal_clone
```

### 2. Backend Setup
The backend uses SQLite by default for local development, so you don't need to install PostgreSQL locally!

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations to create the SQLite tables
alembic upgrade head

# Start the FastAPI server
uvicorn app.main:app --reload
```
*The backend will now be running on `http://localhost:8000`*

### 3. Frontend Setup
Open a new terminal tab and navigate back to the project root.

```bash
cd frontend
npm install

# Start the Next.js development server
npm run dev
```
*The frontend will now be running on `http://localhost:3000`*

---

> **Built for the Scaler SDE Fullstack Assignment.** Encrypted End-to-End (E2E) protocols have been bypassed to prioritize core user experience, UI replication, and standard WebSocket relay implementations as per the assignment constraints.
