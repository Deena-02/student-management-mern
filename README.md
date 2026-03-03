# MERN Student Management System

A dynamic, full-stack Student Management System built using the MERN stack (MongoDB, Express, React, Node.js). 
This project features a secure backend API, an aesthetically pleasing glassmorphism-based UI, complete CRUD capabilities for managing student records, and toggleable dark/light themes.

## Live Demo
* **Frontend (Vercel)**: [https://student-management-mern-eight.vercel.app](https://student-management-mern-eight.vercel.app/)
* **Backend (Render)**: [https://student-management-mern-fz83.onrender.com](https://student-management-mern-fz83.onrender.com)
* *(Note: The backend may take 30-60 seconds to wake up from inactivity on Render's free tier.)*

## Features
- **Admin Authentication**: Secure JWT-based admin login to protect routes.
- **RESTful API**: Complete CRUD (Create, Read, Update, Delete) backend endpoints for Student profiles.
- **Dynamic UI**: Beautiful, fully custom Vanilla CSS featuring glassmorphism design.
- **Dark Mode**: Seamless toggle between Light and Dark aesthetic themes using CSS Variables.
- **Form Validations**: Standard validation checks across all student inputs.
- **CI/CD**: Configured with GitHub Actions for automated build and verification.

## Technology Stack
- **Frontend**: React 19, Vite, React Router, Axios, API integration, CSS Variables.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB & Mongoose.
- **Security**: JWT (JSON Web Tokens), bcryptjs.

## Getting Started Locally

### Prerequisites
- Node.js (v18+ recommended)
- A local MongoDB instance OR a MongoDB Atlas connection string.

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Seed the admin and start the backend:
```bash
node seed.js
npm run dev
```
*Default admin credentials will be: Username `admin` | Password: `admin123`*

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

## Deployment
This application is configured for production deployments:
- Contains `start` scripts and custom env variables for **Render** (Node.js API).
- Leverages Vite's dynamic `import.meta.env` for environment-agnostic deployment on **Vercel**.
