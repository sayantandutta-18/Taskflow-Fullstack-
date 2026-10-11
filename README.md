# 🚀 TaskFlow AI — Next-Gen Productivity Platform

### ✨ Plan Smarter. Focus Deeper. Achieve More.

**TaskFlow AI** is a modern full-stack productivity and task management platform designed to help users organize tasks, manage priorities, track progress, and improve productivity through an intuitive interface.

🌐 **Live Demo:** [Open TaskFlow AI](https://taskflow-fullstack-lac-iota.vercel.app/)

⚙️ **Backend API:** [View Backend](https://taskflow-fullstack-2.onrender.com)

💻 **GitHub Repository:** [TaskFlow Fullstack](https://github.com/sayantandutta-18/Taskflow-Fullstack-)

---

## 🌟 Project Overview

TaskFlow AI brings task management and productivity tools together in one place. Built with modern web technologies, it combines a responsive React frontend with a Node.js and Express backend, supported by MongoDB for data storage.

The project focuses on a smooth user experience, secure authentication, organized task workflows, and a foundation for AI-powered productivity features.

## ✨ Key Features

### 📋 Smart Task Management
- Create, view, update, and delete tasks.
- Organize tasks by priority and category.
- Search and sort tasks for easier navigation.
- Track task status and due dates.
- Archive tasks to keep the active workspace organized.

### 🔐 Authentication & Security
- User registration and login.
- JWT-based authentication.
- Protected API requests.
- Password hashing with bcryptjs.
- Environment-based configuration for sensitive credentials.

### 📊 Productivity Tracking
- Monitor task status and completion.
- Organize work according to priority.
- Keep tasks structured in a centralized dashboard.

### 🎨 Modern User Interface
- React-powered component architecture.
- Responsive interface for different screen sizes.
- Lucide React icons.
- Tailwind CSS styling.
- Three.js support for interactive 3D experiences.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ React | Frontend UI |
| ⚡ Vite | Development server and production build |
| 🎨 Tailwind CSS | Styling and responsive layouts |
| 🌌 Three.js | 3D graphics |
| 🟢 Node.js | Backend runtime |
| 🚀 Express.js | REST API |
| 🍃 MongoDB | Database |
| 🦫 Mongoose | MongoDB object modeling |
| 🔑 JWT | Authentication |
| 🔒 bcryptjs | Password hashing |
| 📡 Axios | Frontend API requests |
| 🎯 Lucide React | Icons |

## 🏗️ Project Architecture

```text
TaskFlow-Fullstack/
│
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── services/        # API configuration
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Node.js backend
│   ├── server.js
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Authentication middleware
│   ├── .env                 # Local environment variables
│   └── package.json
│
└── README.md
```

*Note: The structure above is a representative overview. Adjust individual folders to match the actual repository.*

## 🌐 Live Deployment

| Component | Platform | Link |
|---|---|---|
| Frontend | Vercel | [Launch Application ↗](https://taskflow-fullstack-lac-iota.vercel.app/) |
| Backend | Render | [Open Backend ↗](https://taskflow-fullstack-2.onrender.com) |
| Source Code | GitHub | [View Repository ↗](https://github.com/sayantandutta-18/Taskflow-Fullstack-) |

The frontend communicates with the deployed backend through an API base URL configured using environment variables.

## ⚙️ Run Locally

### 1. Prerequisites

Install the following before getting started:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- A MongoDB database, such as MongoDB Atlas

### 2. Clone the Repository

```bash
git clone https://github.com/sayantandutta-18/Taskflow-Fullstack-.git
cd Taskflow-Fullstack-
```

### 3. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
```

Add any additional environment variables required by your implementation.

Start the backend:

```bash
npm start
```

### 4. Configure the Frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the client directory:

```env
VITE_API_URL=https://taskflow-fullstack-2.onrender.com
```

For local backend development, use your local API URL instead.

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## 🔒 Security Best Practices

- Never commit `.env` files or API secrets to GitHub.
- Use strong, unique JWT secrets.
- Keep database credentials private.
- Validate and authorize requests on the backend.
- Restrict CORS to trusted frontend origins in production.
- Never expose private API keys through frontend environment variables.

**Important:** Variables prefixed with `VITE_` are exposed to client-side code. Never store private secrets in them.

## 🚀 Deployment

### Frontend — Vercel

1. Import the GitHub repository into Vercel.
2. Set the Root Directory to `client`.
3. Select **Vite** as the framework preset.
4. Set the Build Command to `npm run build`.
5. Set the Output Directory to `dist`.
6. Add `VITE_API_URL` with the deployed Render backend URL.
7. Deploy and test the application.

### Backend — Render

1. Create a new Web Service connected to the repository.
2. Set the Root Directory to `backend`.
3. Set the Build Command to `npm install`.
4. Set the Start Command to `npm start`.
5. Configure `MONGO_URI` and `JWT_SECRET` in Environment Variables.
6. Deploy and check the service logs.

*These settings match the package scripts shared for the backend and client. Adjust the directory names if your deployed project uses a different structure.*

## 🧪 Testing Checklist

Before considering the deployment complete, verify:

- [ ] Frontend loads without errors.
- [ ] User registration and login work.
- [ ] Protected routes require authentication.
- [ ] Tasks can be created, updated, and deleted.
- [ ] Task filters, priorities, and search work.
- [ ] Data persists correctly in MongoDB.
- [ ] Frontend API requests reach the Render backend.
- [ ] CORS and production environment variables are configured correctly.
- [ ] The application works on desktop and mobile.

## 🔮 Future Improvements

Potential enhancements for future versions include:

- 🤖 AI-powered task breakdown and planning.
- 📅 Calendar-based task scheduling.
- ⏱️ Pomodoro focus sessions.
- 🏆 XP, achievements, and productivity streaks.
- 📈 Advanced analytics and productivity reports.
- 🎮 Productivity mini-games.
- 🌌 Enhanced interactive 3D experiences.

*These are roadmap ideas unless already implemented in the current codebase.*

## 👨‍💻 Developer

**Sayantan Dutta**

🎓 B.Tech CSE (AI & ML) Student

- 💻 [GitHub](https://github.com/sayantandutta-18)
- 🌐 [Live Project](https://taskflow-fullstack-lac-iota.vercel.app/)

---

### ⭐ Support the Project

If you find TaskFlow AI useful, consider giving the repository a ⭐ on GitHub.

**Built with ❤️, code, and a passion for productivity.**

