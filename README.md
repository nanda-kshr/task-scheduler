# GhostTask AI — Smart Reschedule & Productivity Board

GhostTask is an enterprise-grade, AI-driven productivity dashboard that helps users manage tasks, track Pomodoro focus sessions, and leverage dynamic machine scheduling suggestions to align daily targets without fatigue.

## 🚀 Key Features
- **Smart Rescheduling Engine**: Local heuristic model scanning overloaded windows to suggest shift windows.
- **Active Pomodoro Focus Mode**: Real timer increments directly linked to database collections.
- **Interactive Calendar**: Custom date mapping highlighting active tasks.
- **Aggregated Analytics & Timeline**: Real-time computation of Habit scores (72%) and Mon-Sun completion.
- **Secure Mongoose Layer**: Full repository-service decoupling with Zod request filtering and IP rate-limiting.

---

## 🛠️ Tech Stack
- **Core**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS 4, Custom HSL animations
- **Database**: MongoDB & Mongoose
- **Testing**: Vitest Node Environment
- **Containerization**: Multi-stage Docker, Compose environment
- **CI/CD**: GitHub Actions

---

## 🏃 Getting Started

### 1. Requirements
Ensure you have `Node.js 20+` and `MongoDB` running.

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Seeding (Populates Mockup Data)
To pre-populate MongoDB with the mockup data (Tasks, AI suggestions, Activities, Focus Timer metrics):
```bash
npm run seed
```
To wipe all collections:
```bash
npm run reset-db
```

### 4. Running Local Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the reactive dashboard!

---

## 🧪 Testing Suite
Execute the Vitest suite testing validations, custom exceptions, and rate limiters:
```bash
npm run test
```

---

## 🐳 Docker Deployment
Spins up both the production standalone app and a Mongo instance:
```bash
docker-compose up --build
```
The app runs at [http://localhost:3000](http://localhost:3000).
# task-scheduler
