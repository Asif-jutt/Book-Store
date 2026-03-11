# 🚀 Quick Start Guide

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

## 1. Backend Setup

```bash
cd Backend

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# - Set MONGODB_URI
# - Set JWT_SECRET (change for production!)
# - Set STRIPE_SECRET_KEY (get from Stripe Dashboard)

# Install dependencies
npm install

# Seed admin user (optional)
node seedAdmin.js

# Start server
npm run dev
```

## 2. Frontend Setup

```bash
cd Front-end

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# - Set VITE_STRIPE_PUBLISHABLE_KEY

# Install dependencies
npm install

# Start development server
npm run dev
```

## 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Login**: admin@bookstore.com / Admin@123

## 4. Stripe Setup (For Payments)

1. Create account at https://stripe.com
2. Get API keys from Dashboard → Developers → API keys
3. Add to `.env`:
   - Backend: `STRIPE_SECRET_KEY=sk_test_...`
   - Frontend: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
4. For webhooks (production), set up webhook endpoint in Stripe Dashboard

## 5. MongoDB Setup

**Local:**

- Install MongoDB Community Server
- Start MongoDB service
- Default URI: `mongodb://localhost:27017/bookstore`

**MongoDB Atlas:**

1. Create free cluster at https://mongodb.com/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

---

## Project URLs After Setup

| Service     | URL                             | Description                           |
| ----------- | ------------------------------- | ------------------------------------- |
| Home        | http://localhost:5173           | Main landing page                     |
| Books       | http://localhost:5173/books     | Browse all books                      |
| Dashboard   | http://localhost:5173/dashboard | User dashboard (requires login)       |
| Admin Panel | http://localhost:5173/admin     | Admin dashboard (requires admin role) |
| API         | http://localhost:5000           | Backend API root                      |

## Default Admin Credentials

- Email: `admin@bookstore.com`
- Password: `Admin@123`

> Run `node seedAdmin.js` in Backend folder to create admin user.
