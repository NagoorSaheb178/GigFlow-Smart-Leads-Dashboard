# 🚀 GigFlow – Smart Leads Dashboard

A state-of-the-art, high-performance **MERN Lead Management & CRM Dashboard** engineered with React, Express, MongoDB, Node.js, and strictly typed **TypeScript**.

The workspace is organized into a highly optimized, industry-standard **Monorepo layout**, routing all production assets statically through a single Express port and natively integrating with **Vercel Serverless Functions**.

---

## ✨ Features

### 👤 User Management & Role-Based Access Control (RBAC)
- **Role Isolation**: 
  - **`Admin`**: Full CRUD operations + Bulk CSV Export + Member directory ledger control.
  - **`Sales User`**: Dedicated leads pipeline (Create & Update status), blocked from administrative user panels.
- **Multi-Tenant Scoping**: Dynamic database query scoping isolates lead statistics per sales account. Fresh sign-ups start with clean, zeroed analytics cards!

### 📊 Real-Time Dynamic Analytics
- **Live KPIs**: Conversion Rate calculation, growth trajectory markers, and attribution channel ratios are calculated in real-time straight from MongoDB.
- **Visual Charts**: Rich interactive graphs mapping growth timelines and channel allocations.

### 💼 Leads Management
- **Full CRUD Flow**: Seamless lead registration, status switching, and detailing panels.
- **Advanced Filtering**: Live, client-side dynamic search and status/source filters.
- **Administrative Utilities**: Instant bulk-export capabilities straight to CSV.

### 🎨 Premium UI/UX Design
- **Harmonious Dark Theme**: Sleek dark mode styling featuring visual micro-animations and cohesive structural layouts.
- **Mobile Responsive**: Dynamically adapting structural grids, allowing sales tracking on any size viewport.

---

## 🛠️ Project Structure (Clean Monorepo)

```
GigFlow - Smart Leads Dashboard/
├── client/                 <-- [FRONTEND] Pure React, TS, TailwindCSS, & Recharts
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 <-- [BACKEND] Pure Express & MongoDB
│   ├── src/
│   │   ├── controllers/    # API query scoping & business logic
│   │   ├── middleware/     # JWT Auth verification & RBAC gates
│   │   ├── models/         # Mongoose validation schemas
│   │   └── routes/         # Router declarations
│   └── tsconfig.json
├── api/                    <-- [VERCEL] Production gateway serverless entry point
├── package.json            <-- [ROOT ORCHESTRATOR] Coordinates both workspaces
└── vercel.json             <-- [VERCEL GATEWAY] Zero-config serverless mapping
```

---

## 🚀 Quick Setup & Installation

### 1. Install Dependencies (One Command)
You no longer need to navigate folders manually to install packages. Run this single command in the project root:
```bash
npm run install:all
```
This automatically installs all package dependencies for the root orchestrator, the backend server, and the frontend client simultaneously.

### 2. Configure Environment Variables
Create a `.env` file in the **project root** directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_cryptographically_secure_256bit_hex_token
NODE_ENV=development
```

### 3. Run Locally in Development
To boot both the Express backend server and the React dev environment concurrently, run:
```bash
npm run dev
```
* React Frontend will run on: `http://localhost:3000`
* Express Backend API will run on: `http://localhost:5000`

---

## ☁️ Single-Port Production Deployment (Vercel)

This monorepo is fully configured for **Vercel's Modern Zero-Config Pipeline**.

1. When deployed, Vercel triggers `npm run build` at the root, which compiles the backend server into `server/dist/` and compiles the React application into `client/build/`.
2. The `api/index.js` gateway mounts the compiled Express serverless function natively.
3. The `vercel.json` router serves the React application statically from `/` and maps all `/api/*` endpoints to the serverless function.

---

## 🔌 API Reference Endpoints

### 🔑 Authentication (`/api/auth`)
* `POST /api/auth/register` - Create a new administrator or sales account.
* `POST /api/auth/login` - Authenticate credentials and receive a secure JWT token.

### 📁 Leads Tracking (`/api/leads`)
* `GET /api/leads` - Fetch leads list (supports active filters, search, and pagination).
* `GET /api/leads/:id` - Fetch comprehensive single lead record details.
* `POST /api/leads` - Register a new lead.
* `PUT /api/leads/:id` - Update existing lead parameters/statuses.
* `DELETE /api/leads/:id` - Remove lead record (restricted to **Admins**).
* `GET /api/leads/export` - Export lead ledger data directly to a CSV document (restricted to **Admins**).

### 👥 Personnel Management (`/api/admin`)
* `GET /api/admin/users` - Fetch full user directory (restricted to **Admins**).
* `POST /api/admin/users` - Register a new onboarded employee (restricted to **Admins**).
* `DELETE /api/admin/users/:id` - Revoke employee account access (restricted to **Admins**).
