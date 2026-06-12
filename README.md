# AI & Cybersecurity Learning Hub

A modern, enterprise-grade Learning Management System (LMS) for AI & Cybersecurity training videos. Designed with high-fidelity glassmorphism, responsive SaaS layouts, customized video player overlays, gamification systems, and role-based access control.

---

## 🚀 Quick Start Instructions

Both the frontend and backend dependencies have already been installed, the database client generated, and the SQLite database seeded with initial training courses and accounts.

### 1. Launch the Backend API Server
Navigate to the `backend/` directory in a new terminal terminal, configure `.env` (optional, default provided), and launch the server:
```bash
# Navigate to backend
cd backend

# Launch the Dev Server (Runs on port 5001)
npm run dev
```

### 2. Launch the Frontend Vite Client
Open a second terminal window, navigate to the `frontend/` directory, and start the development server:
```bash
# Navigate to frontend
cd frontend

# Launch the Vite Client (Runs on http://localhost:5173)
npm run dev
```

Open your browser to `http://localhost:5173` to explore the application!

---


## 🛠 Tech Stack Details

### Frontend
- **Framework**: React.js & Vite
- **Styling**: Tailwind CSS v4 & PostCSS
- **Animations**: Framer Motion
- **Charts**: Recharts (Weekly Activity AreaChart & Category PieChart)
- **Icons**: Lucide Icons
- **State Management**: Zustand
- **Media Player**: React Player

### Backend
- **Server**: Node.js & Express
- **Database**: SQLite (configured seamlessly via Prisma ORM)
- **Authentication**: Bcrypt & JWT (JSON Web Tokens)
- **ORM**: Prisma Client
- **API Port**: 5001

---

## 🎯 Gamification & Achievements Rules
1. **Passive XP**: Users receive `+5 XP` every 10 seconds of active video playback updates.
2. **Video Completion**: Completing 90% or more of any course awards `+100 XP`.
3. **Badge Milestones**:
   - `Beginner Learner`: Unlocked automatically on account registration.
   - `AI Explorer`: Awarded when completing an AI video course.
   - `Cybersecurity Analyst`: Awarded when completing a Cybersecurity video course.
   - `Completion Master`: Awarded when completing all video courses in the catalog.
4. **Streak Counter**: Logging in daily increments the user's streak. Inactivity for over 24 hours resets it back to 1.
