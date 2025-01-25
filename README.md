# PTO Manager

A simple PTO (Paid Time Off) management app built with React (frontend) and Koa (backend).  

## Features

- **JWT Authentication** (user logs in to obtain a token)
- **PTO Balance View** (see max, used, remaining PTO hours)
- **PTO Requests** (submit new requests, view existing requests)
- **Database** (SQLite with a few seed users/requests)

## Development Setup

1. **Clone the repository** and install dependencies for both `frontend` and `backend` folders:

   ```bash
   cd pto-dashboard
   # Install dependencies for frontend:
   cd frontend
   npm install
   # then for backend:
   cd ../backend
   npm install
   ```

## Local Development

### Environment Setup
1. Set backend environment variable and start server:
```bash
JWT_SECRET_KEY=super_secret_key npm run dev
```
Server runs on port 4000 by default.

2. Start frontend development server:
```bash
cd frontend
npm run dev
```
Frontend runs on port 8080.

### Testing
- Visit http://localhost:8080
- Login with sample credentials:
  - Email: `john@example.com`
  - Password: `password`

## Production
- Build frontend: `npm run build`
- Deploy backend with secure `JWT_SECRET_KEY` and `VITE_API_BASE_URL` which contains the backend's URL
- SQLite database auto-seeds with example data on first run