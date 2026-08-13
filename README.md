# Secure Messaging Platform (Signal Clone)

A fully functional, real-time messaging application that replicates the core workflows, design, and user experience of the Signal app. This project was built as an SDE Fullstack Assignment.

## 🔗 Live Links
- **Frontend (Live)**: [https://signal-clone-ashen.vercel.app](https://signal-clone-ashen.vercel.app)
- **Backend API (Live)**: [https://signal-clone-93gb.onrender.com/api/health](https://signal-clone-93gb.onrender.com/api/health)

## 🚀 Features
- **Real-Time Messaging**: Built entirely on WebSockets for instant message delivery.
- **Typing Indicators**: Live visual feedback when the other user is typing.
- **Authentication**: Secure JWT-based authentication with encrypted passwords (bcrypt).
- **One-on-One & Group Chats**: Create direct messages or multi-user group conversations.
- **Contact Management**: Add contacts by User ID and assign custom nicknames.
- **Pixel-Perfect UI**: Replicates Signal's clean, privacy-focused desktop aesthetic (Light Mode).
- **Responsive Layout**: Works seamlessly across different screen sizes.

## 🛠️ Technology Stack
### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS & Lucide React Icons
- **State Management**: Zustand
- **Real-Time Communication**: Native WebSockets

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (via SQLAlchemy ORM)
- **Migrations**: Alembic
- **Real-Time Communication**: FastAPI WebSockets
- **Authentication**: Passlib & bcrypt

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/akshat2508/Signal_clone.git
cd Signal_clone
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

## 📝 Notes on Implementation
- **Security**: While the core user experience matches Signal, End-to-End (E2E) encryption protocols are currently mocked/simulated as per the assignment scope.
- **CORS & Cookies**: Cross-origin requests are fully supported with `SameSite=None` secure cookies to allow the Next.js Vercel frontend to seamlessly communicate with the Render backend.
