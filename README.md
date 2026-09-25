# 🚀 CampusOS — The Futuristic Campus Operating System

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-8.0-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT_&_RBAC-FF6C37?style=flat&logo=json-web-tokens&logoColor=white)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**CampusOS** is a next-generation, high-performance web platform and campus operating system designed for modern universities and institutes. Featuring a sci-fi/cyberpunk aesthetic with glassmorphism, 3D WebGL particle cores, real-time timetable telemetry, role-based access control (RBAC), and persistent cloud storage via MongoDB Atlas.

---

## ⚡ Highlights & Key Features

- **🔐 Enterprise-Grade Authentication & RBAC**:
  - Secure JWT token handling with salted Bcrypt password hashing.
  - Multi-tiered role separation: **Student Identity** vs. **Admin Clearance**.
  - Auto-session recovery, token verification, and route protection.
  - Fast-path Demo Student & Demo Admin logins for instantaneous evaluations.
- **🎓 Academics & Real-Time Timetable**:
  - Dynamic schedule matrices filtered by day of the week.
  - Attendance check-in simulation with celebratory confetti feedback.
  - Syllabus tracking with visual progress indicators.
- **🔥 Hackathons & Squad Formation**:
  - Browse campus hackathons with prize pools, countdowns, and tech stack tags.
  - Built-in squad registration modal to form hackathon teams on the spot.
- **💼 Career Hub & Internships**:
  - Filter job and internship opportunities (Remote, Hybrid, Onsite).
  - One-click application modal with custom cover statements and instant receipt feedback.
- **🎉 Campus Events & Digital RSVP Passes**:
  - Interactive RSVP pass generator with scannable QR ticket display.
  - Filter by Tech Talk, Workshop, Symposium, and Cultural events.
- **🛡️ Clubs & Autonomous AI Labs**:
  - Discover student organizations, technical chapters, and research pods.
  - One-click join/leave toggling with real-time membership counts.
- **📢 Priority Announcements & Transmissions**:
  - Classified priority system (`urgent`, `high`, `normal`).
  - Broadcast transmissions created by administrators display instantly across student consoles.
- **📂 Study Vault & Research Papers**:
  - Curated past exams, lecture notes, lab manuals, and cheatsheets.
  - Live download tracking counters.
- **🛡️ Admin Command Center**:
  - System health metrics, cluster telemetry, and node status.
  - User management table with real-time promotion/demotion between Student and Admin roles.
  - Account suspension toggle and broadcast transmission dispatch.

---

## 🏗️ System Architecture

```
CampusOS/
├── client/                      # React 18 Frontend (Vite + Tailwind CSS + Lucide)
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/              # WebGL Canvas / Orbital 3D nodes
│   │   │   ├── common/          # Navbar, Sidebar, ProtectedRoute, GlassCard, Modal
│   │   │   └── dashboard/       # TimetableWidget, AttendanceRing, UrgentAnnouncements
│   │   ├── context/             # AuthContext (JWT/User state), NotificationContext
│   │   ├── pages/               # 12 Full-fledged pages (Landing, Login, Register, Admin, etc.)
│   │   └── services/            # Axios API client with automatic JWT bearer interceptor
│   ├── .env.example
│   └── vite.config.js           # Reverse proxy to backend on /api
│
├── server/                      # Node.js + Express Backend REST API
│   ├── src/
│   │   ├── config/              # MongoDB Atlas connection (Mongoose)
│   │   ├── controllers/         # Auth, Academics, Events, Hackathons, Internships, etc.
│   │   ├── middleware/          # JWT protect, adminOnly RBAC, error handlers
│   │   ├── models/              # Mongoose schemas (User, Course, Event, Hackathon, etc.)
│   │   ├── routes/              # Express API routers
│   │   ├── seeds/               # seedData.js rich initial dataset generator
│   │   └── server.js            # Express server bootstrap & health diagnostics
│   ├── .env.example             # Documented server environment variables
│   └── package.json
│
├── .gitignore                   # Strict security patterns ignoring .env credentials
├── .env.example                 # Root environment template
├── package.json                 # Unified monorepo run scripts
└── README.md
```

---

## 🔑 Demo Credentials

CampusOS comes pre-seeded with sample student and administrator accounts. You can also click **"Demo Student"** or **"Demo Admin"** directly on the Login page for one-click access:

| Role | Email | Password | Clearance Level |
| :--- | :--- | :--- | :--- |
| **Student** | `alex@campusos.edu` | `Student@123` | Level 1: Student Console |
| **Administrator** | `admin@campusos.edu` | `Admin@123` | Level 4: Full Admin Command Center |

*Or register a new account on `/register` using any email!*

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB Atlas** account (or local MongoDB instance)

---

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd CampusOS
```

---

### Step 2: Configure Environment Variables

1. Copy `.env.example` in `server/`:

```bash
cp server/.env.example server/.env
```

2. Edit `server/.env` with your MongoDB connection string and JWT secret:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusos?retryWrites=true&w=majority

# JWT Authentication Config
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# CORS Client Origin
CLIENT_URL=http://localhost:5173
```

> **Note:** MongoDB Atlas Network Access must permit your IP address (or `0.0.0.0/0` during development) in your Atlas Security Settings.

---

### Step 3: Install Dependencies

From the project root:

```bash
npm run install:all
```

Or install separately:

```bash
cd server && npm install
cd ../client && npm install
```

---

### Step 4: Seed the Database

Populate MongoDB Atlas with starter courses, events, hackathons, internships, clubs, and demo users:

```bash
# From root directory:
npm run seed

# Or from server directory:
cd server && npm run seed
```

---

### Step 5: Start the Development Servers

Open two terminal windows (or run in background):

#### Terminal 1 — Backend Server (Port 5000):
```bash
npm run server
```

#### Terminal 2 — Frontend Client (Port 5173):
```bash
npm run client
```

Now open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 📡 REST API Reference

| Method | Endpoint | Description | Clearance |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | System health check & DB status | Public |
| `POST` | `/api/auth/register` | Register new student or admin | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Authenticated |
| `PUT` | `/api/auth/profile` | Update user profile bio/avatar | Authenticated |
| `GET` | `/api/academics/courses` | List enrolled & available courses | Authenticated |
| `POST` | `/api/academics/attendance/checkin` | Check in to course session | Authenticated |
| `GET` | `/api/events` | List campus events with filters | Authenticated |
| `POST` | `/api/events/:id/rsvp` | RSVP to event and generate pass | Authenticated |
| `GET` | `/api/hackathons` | List hackathons | Authenticated |
| `POST` | `/api/hackathons/:id/team` | Register a squad for hackathon | Authenticated |
| `GET` | `/api/internships` | List internships & career postings | Authenticated |
| `POST` | `/api/internships/:id/apply` | Submit application | Authenticated |
| `GET` | `/api/clubs` | List student clubs | Authenticated |
| `POST` | `/api/clubs/:id/join` | Toggle club membership | Authenticated |
| `GET` | `/api/announcements` | List campus announcements | Authenticated |
| `POST` | `/api/announcements` | Dispatch high-priority announcement | Admin Only |
| `GET` | `/api/resources` | List study vault resources | Authenticated |
| `POST` | `/api/resources/:id/download` | Record resource download count | Authenticated |
| `GET` | `/api/admin/metrics` | Retrieve platform diagnostic metrics | Admin Only |
| `GET` | `/api/admin/users` | List registered campus users | Admin Only |
| `PUT` | `/api/admin/users/:id/role` | Promote/demote role or suspend user | Admin Only |

---

## 🛠️ Production Build

To build the client application for production:

```bash
npm run build
```

Compiled static assets will be output to `client/dist/`.

---

## 🔒 Security Best Practices

- All sensitive keys (`server/.env`, passwords, JWT secrets) are excluded by `.gitignore`.
- Password hashing uses standard multi-round Bcrypt salt.
- JWT tokens expire automatically (configurable via `JWT_EXPIRES_IN`).
- Server includes CORS validation, request sanitization, and centralized error handling middleware.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
