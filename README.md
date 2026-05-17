# GigFlow – Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## Features

- **Authentication System**: Secure JWT-based auth with password hashing (bcrypt).
- **Leads Management**: Full CRUD operations for managing business leads.
- **Advanced Filtering**: Filter by status, source, and debounced search by name/email.
- **Backend Pagination**: Efficient data fetching with 10 records per page.
- **Role-Based Access Control (RBAC)**: 
  - **Admin**: Full access (CRUD + Export + Delete).
  - **Sales User**: Create and Update access.
- **CSV Export**: Export all leads data to CSV (Admin only).
- **Responsive UI**: Premium, modern design with TailwindCSS.
- **Dark Mode**: Support for light and dark themes.
- **Dockerized**: Ready for containerized deployment.

## Tech Stack

- **Frontend**: React.js, TypeScript, TailwindCSS, Axios, Lucide React, Framer Motion.
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, Zod.
- **Dev Tools**: Docker, concurrently, ts-node-dev.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (URL provided in assignment)
- Docker (optional)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd "GigFlow – Smart Leads Dashboard"
   ```

2. **Install Root Dependencies**:
   ```bash
   npm install
   ```

3. **Install Client Dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://gig:Nagoor@cluster0.px9ktef.mongodb.net/smart-leads?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_12345
   NODE_ENV=development
   ```

5. **Run the application**:
   ```bash
   npm run dev
   ```
   This will start both the backend (port 5000) and the frontend (port 3000) concurrently.

### Using Docker

1. **Build and run**:
   ```bash
   docker-compose up --build
   ```
   Access the frontend at `http://localhost:3000` and API at `http://localhost:5000`.

## API Documentation

### Auth
- `POST /api/auth/register`: Create new user
- `POST /api/auth/login`: Authenticate user

### Leads
- `GET /api/leads`: List leads (supports filters & pagination)
- `GET /api/leads/:id`: Get single lead
- `POST /api/leads`: Create lead
- `PUT /api/leads/:id`: Update lead
- `DELETE /api/leads/:id`: Delete lead (Admin only)
- `GET /api/leads/export`: Export all leads (Admin only)

## Project Structure

```
├── client/              # Frontend (React + TS)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth State
│   │   ├── hooks/       # Custom hooks (DarkMode, etc)
│   │   ├── pages/       # Dashboard, Login, Register
│   │   └── services/    # API calls
├── src/                 # Backend (Node + TS)
│   ├── controllers/     # Route logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & RBAC
│   └── index.ts         # Entry point
├── Dockerfile           # Backend Docker config
├── docker-compose.yml   # Multi-container config
└── package.json         # Scripts to run everything
```

## Submission Details

- **Candidate**: [Your Name]
- **Target Role**: Full Stack Intern
- **Project**: Smart Leads Dashboard
