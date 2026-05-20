# TaskFlow: Team Task Manager

A production-ready full-stack SaaS-style team task manager built with React, Vite, Tailwind CSS, Framer Motion, GSAP, Node.js, Express, MongoDB, Mongoose, JWT auth, Socket.io, React Hook Form, Zod, Zustand, Recharts, and Lucide icons.

## Demo Accounts

After seeding:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@taskflow.app` | `Password123!` |
| Member | `maya@taskflow.app` | `Password123!` |
| Member | `noah@taskflow.app` | `Password123!` |
| Member | `iris@taskflow.app` | `Password123!` |

## Project Structure

```txt
team-task-manager/
  backend/    Express, MongoDB, JWT, Socket.io, seed data
  frontend/   React, Vite, Tailwind, Framer Motion, GSAP
  docs/       API docs and Postman collection
```

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Configure environment:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start MongoDB locally or set `MONGO_URI` to Atlas/Railway Mongo.

4. Seed demo data:

```bash
npm run seed
```

Create or promote an admin without wiping data:

```bash
npm run admin:create --prefix backend -- admin@taskflow.app Password123! "Workspace Admin"
```

5. Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend health: `http://localhost:5050/health`

## Features

- JWT authentication with persistent login and bcrypt password hashing
- Admin/member role-based access control
- Project CRUD, team members, priority, descriptions, due dates, activity
- Task CRUD, assignment, comments, file attachment endpoint, overdue highlighting
- Drag-and-drop Kanban with optimistic updates
- Dashboard analytics with Recharts
- Realtime notifications and task broadcasts with Socket.io
- Search/filter-ready APIs with pagination
- Premium dark UI with glass cards, GSAP background motion, Framer page transitions, responsive layout
- React Hook Form + Zod validation
- Zustand state management
- Railway-ready start command and environment setup

## Railway Deployment

Create a Railway project and add a MongoDB service or external MongoDB URI.

Required backend variables:

```env
NODE_ENV=production
PORT=5050
MONGO_URI=your_mongo_connection_string
JWT_SECRET=long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain
```

Frontend variables:

```env
VITE_API_URL=https://your-api-domain/api
VITE_SOCKET_URL=https://your-api-domain
```

For a single Railway backend service, deploy from the repository root. The included `railway.json` starts `backend`. Deploy the frontend separately to Railway static hosting, Vercel, or Netlify with:

```bash
npm run build --prefix frontend
```

## API Testing

Import [TaskFlow.postman_collection.json](/Users/harsha/Documents/Work%20Flow/team-task-manager/docs/TaskFlow.postman_collection.json) into Postman. Set:

- `baseUrl`: `http://localhost:5050/api`
- `token`: JWT returned from login

API documentation is in [API.md](/Users/harsha/Documents/Work%20Flow/team-task-manager/docs/API.md).
