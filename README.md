# TaskFlow AI — Next-Gen Full-Stack Productivity Platform & 3D Experience

TaskFlow AI is a modern, gamified MERN-stack productivity platform featuring an interactive **Three.js 3D Productivity Core**, AI-powered task breakdowns, customizable subtasks and recurring schedules, real-time analytics, Pomodoro focus timer, mini-games arcade, and an idempotent gamification reward system.

---

## 🌟 Key Features

### 1. 🌐 Interactive 3D Experience (Three.js)
- **Interactive Productivity Orb:** Orbiting torus rings, rotating node cubes, ambient particle clouds, and dynamic mouse parallax.
- **Performance Optimized:** Lazy-loaded with React `Suspense`, capped device pixel ratio (`<= 1.5`), and automated WebGL resource disposal on component unmount.
- **Accessible Fallbacks:** Graceful 2D/CSS 3D glowing orb fallback for low-power devices, systems without WebGL support, and users with `prefers-reduced-motion` enabled.
- **Zero DOM Interference:** Real headlines, metrics, and CTAs remain semantic, screen-reader friendly HTML.

### 2. ⚡ Full Task Lifecycle & Workflows
- **Subtasks & Checklists:** Add, toggle, and delete individual subtask steps directly on task cards.
- **Recurrence Engine:** Automatic rescheduling for Daily, Weekly, and Monthly tasks upon completion with subtask resets.
- **Productivity Templates:** Built-in templates for Study Sessions, Feature Sprints, Daily Wellness, and Budget Audits.
- **Notes & Character Limits:** Expandable notes section for rich links and acceptance criteria.
- **Filtering & Search:** Real-time text search, priority filtering, category filtering, and sorting (Latest, Oldest, Priority, Due Date).
- **Archive & Restore:** Full archive lifecycle with instant restoration.

### 3. ✨ AI Task Assistant
- **Task Breakdown:** Analyzes task title and description to produce actionable 3-4 step subtasks, priority suggestions, and productivity tips.
- **Dual-Engine Architecture:** Server-side Google Gemini integration with a zero-dependency intelligent heuristic fallback engine ensuring 100% reliability and privacy even without external API keys.
- **Daily Planning Draft:** Prioritizes pending tasks into Top Priorities, Secondary Tasks, and Quick Wins.

### 4. 🎮 Gamification & Rewards
- **Idempotent XP & Levels:** Earn +10 XP for task completion, +5 XP bonus for High priority, and +5 XP for full subtask completion.
- **Streak Tracker:** UTC-based consecutive day streak calculation preventing duplicate streak increments on the same day.
- **Achievements & Badges:** Unlocks badges (*Novice Achiever*, *Momentum Builder*, *Flow Master*, *Level Up*, *Century Club*) persisted directly to MongoDB.

### 5. 🕹️ Mini-Games Arcade
- **Memory Match:** Dynamic card flipping with move counters and time tracking.
- **2048:** Full tile sliding physics with keyboard arrows and mobile touch gestures.
- **Tic-Tac-Toe:** Two-player and smart AI computer mode with winning combo highlights.
- **Reaction Challenge:** Precision millisecond reaction timer with false-start detection.

### 6. ⏱️ Focus Room & Pomodoro
- Configurable **Focus (25m)**, **Short Break (5m)**, and **Long Break (15m)** intervals.
- Integrated Web Audio API chime notifications with user toggles.
- Session counter and active task selector.

### 7. 📊 Truthful Analytics & Insights
- Accurate database-backed statistics (Active, Completed, Overdue, Completion Rate %).
- Priority distribution and Category breakdown meters.
- Calibrated empty states for newly registered accounts.

### 8. 📅 Interactive Calendar View
- Month calendar grid mapped to real task due dates with priority-coded chips and task detail modals.

---

## 🛠️ Architecture

```
Taskflow-AI/
├── client/                     # React 19 Frontend (Vite 8 + Tailwind CSS v4)
│   ├── src/
│   │   ├── components/
│   │   │   ├── three/          # Three.js 3D Hero Scene & CSS Fallback
│   │   │   ├── games/          # Mini-games (2048, Memory Match, TicTacToe, Reaction)
│   │   │   ├── layout/         # Navbar, Sidebar, Footer, MainLayout
│   │   │   └── ui/             # Hero, Features, Landing components
│   │   ├── pages/              # Dashboard, Calendar, FocusRoom, Games, Insights, Profile, Settings
│   │   └── services/           # Axios instance with auth interceptor
├── server/                     # Express 5 Backend (Node.js + MongoDB Atlas)
│   ├── config/                 # MongoDB database connection
│   ├── controllers/            # Task, Auth, and AI controllers
│   ├── middleware/             # JWT authentication protection
│   ├── models/                 # Mongoose schemas (User, Task)
│   ├── routes/                 # Express API routes
│   └── test/                   # End-to-end verification test suite
└── src/                        # Standalone AI Studio prototype (isolated)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (MongoDB Atlas or local MongoDB)

### 1. Backend Setup
```bash
cd server
npm install
```
Configure your environment variables in `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Optional:
GEMINI_API_KEY=your_gemini_api_key
```
Start the backend server:
```bash
npm run dev
# Or: node server.js
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Visit `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing & Verification

Run the full end-to-end verification suite:
```bash
node server/test/e2e_checkpoint_suite.js
```
The test suite validates:
- User registration & duplicate email rejection
- JWT authentication & password hashing
- Protected route security
- Productivity template retrieval
- Task creation with subtasks, notes, and recurrence
- Ownership isolation (User B blocked from User A data)
- Subtask lifecycle (add, toggle, delete)
- Archive & restore lifecycle
- AI task breakdown and daily planning
- Idempotent XP granting (prevents double XP cheating)
- Recurring task automatic spawning
- User profile & achievement persistence in MongoDB

---

## 🔒 Security & Best Practices
- **No Secret Logging:** Credentials, tokens, and database passwords are never logged in console outputs or committed to git.
- **Strict Whitelisting:** Body parameters in task updates are sanitized against an allowed fields list.
- **Isolated Workspaces:** Dependencies between `client` and `server` are completely decoupled.
