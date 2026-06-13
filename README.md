# Government of Rajasthan - AI & Cybersecurity Learning Hub

A modern, enterprise-grade Learning Management System (LMS) designed for government officers and learners training in Artificial Intelligence and Cybersecurity defense. The platform is styled with a premium Rajasthan Government theme (Navy, Gold, and high-contrast styling) and features a unified learner-centric dashboard, an interactive course player workspace, and a compliance certification center.

---

## 🚀 Key Features

### 🔐 1. Clerk Authentication Integration
- Secure, passwordless user registration and sign-in managed natively by Clerk.
- Automated local user database profile synchronization on startup.
- Role-based route guards:
  - `ProtectedRoute`: Restricts learner pages (Dashboard, Library, Certificates, Profile) to authenticated users.
  - `AdminRoute`: Secures management actions (Video uploads, category creation) for authorized instructors only.
  - Account actions (password changes, profile details) managed securely by Clerk portals.

### 🎓 2. Modern "My Learning" Console
- Personal welcome greeting (`Welcome back, Name!`).
- **Continue Learning**: Displays course tracks in progress with visual completion progress bars.
- **Recommended for You**: Recommends catalog courses that the learner hasn't started yet.
- **New Additions Feed**: A real-time log of the latest video/course uploads.

### 🎥 3. Course Player Workspace
- Integrated video player with support for major streaming URLs and MP4 formats.
- **Course Curriculum Checklist**: Tracks module completion status dynamically:
  - Play symbol (▶) for the active lesson.
  - Green checkmark (✓) for completed modules.
  - Empty checkbox (□) for not-started modules.
- Dynamic course completion progress bar.
- Tabbed interface for study efficiency:
  - **AI Summary**: Automated lesson summaries and checkpoints.
  - **My Notes**: Workspace text area for personal notes (auto-saved to local storage).
  - **Checkpoints**: Custom video timestamps logged directly to the DB to resume watching.
  - **Discussion Log**: Course-wide Q&A inquiries for student-instructor discussions.

### 📜 4. Compliance Credentials Center
- Tracks completion stats per category (e.g. all modules in the AI Specialist Track or the Security Analyst Track).
- Generate and view formal, print-ready Rajasthan Government completion certificates.
- Directly prints high-resolution credentials using the web browser print layouts.

### 🛠 5. Admin Panel & Dev Fallbacks
- Secure dashboard for instructors to curate courses, monitor platform stats, and manage media.
- Cloudinary integration for secure video and thumbnail uploads.
- **Development Fallback**: Returns a mock video payload if Cloudinary credentials are not configured in `.env`, facilitating offline testing.

---

## 🛠 Tech Stack Details

### Frontend
- **Framework**: React.js & Vite
- **Styling & Theme**: Tailwind CSS & Vanilla CSS HSL tokens (Rajasthan Navy & Gold)
- **Authentication**: `@clerk/clerk-react`
- **State Management**: Zustand
- **Media Player**: React Player
- **Icons**: Lucide Icons
- **HTTP Client**: Axios

### Backend
- **Framework**: Node.js & Express
- **Database**: PostgreSQL (Neon database in production, schema configured via Prisma ORM)
- **Authentication Middleware**: `@clerk/express` & Clerk Client SDK
- **Media Upload**: Cloudinary SDK & Multer (Buffer Upload Stream)
- **ORM**: Prisma Client

---

## 💻 Local Setup & Development

### 1. Environment Configuration

Create a `.env` file in the `frontend` folder:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5001/api
```

Create a `.env` file in the `backend` folder:
```env
PORT=5001
JWT_SECRET=super_secret_key_lms_hub
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL="postgresql://[user]:[password]@[host]/[dbname]?sslmode=require"
ADMIN_EMAILS="your_email@gmail.com"

# Cloudinary keys (Optional, development mock upload will activate if missing)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Start servers

Launch the backend API:
```bash
cd backend
npm run dev
```

Launch the frontend client:
```bash
cd frontend
npm run dev
```

---

## 📦 Production Deployment

For complete details on deployment configuration and linking environments:
* **See the Deployment Guide**: [deployment_guide.md](file:///C:/Users/omsin/.gemini/antigravity-ide/brain/eabb5870-0c49-4641-be6c-a103ff5a2b33/deployment_guide.md)
