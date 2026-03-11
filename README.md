# Bookstore - Full Stack MERN Application

A complete production-level bookstore web application built with React.js, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Signup, Login with JWT tokens
- **Password Security**: bcrypt password hashing
- **User Dashboard**: Profile management, file uploads
- **File Upload**: Profile pictures and document uploads using Multer
- **Protected Routes**: JWT-based route protection
- **RESTful APIs**: Complete CRUD operations
- **Modern UI**: Tailwind CSS + DaisyUI

---

## Project Structure

```
Bookstore/
├── Backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Login/Signup logic
│   │   ├── userController.js  # Profile management
│   │   ├── fileController.js  # File upload handling
│   │   └── bookController.js  # Book CRUD operations
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── upload.js          # Multer configuration
│   │   └── error.js           # Error handling
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── File.js            # File schema
│   │   └── Book.js            # Book schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── userRoutes.js      # User endpoints
│   │   ├── fileRoutes.js      # File endpoints
│   │   └── bookRoutes.js      # Book endpoints
│   ├── utils/
│   │   └── generateToken.js   # JWT token generator
│   ├── uploads/               # Uploaded files storage
│   ├── .env                   # Environment variables
│   ├── index.js               # Server entry point
│   └── package.json
│
└── Front-end/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard/
    │   │   │   ├── DashboardLayout.jsx
    │   │   │   ├── DashboardNavbar.jsx
    │   │   │   ├── DashboardHome.jsx
    │   │   │   ├── Profile.jsx
    │   │   │   └── FileUpload.jsx
    │   │   ├── HomePage/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Login.jsx
    │   │   │   ├── Sign.jsx
    │   │   │   └── ...
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state management
    │   ├── services/
    │   │   └── api.js             # Axios API client
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Clone and Navigate

```bash
cd c:\Users\asifh\Documents\MERN_STACK\Bookstore
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Start MongoDB (if local)
# Make sure MongoDB is running on mongodb://localhost:27017

# Start the server
npm run dev
```

The backend server will run on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd Front-end

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## Environment Variables

Create a `.env` file in the Backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
```

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| POST   | `/api/auth/signup` | Register new user            |
| POST   | `/api/auth/login`  | Login user                   |
| GET    | `/api/auth/me`     | Get current user (protected) |

### User

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | `/api/user/profile`         | Get user profile       |
| PUT    | `/api/user/profile`         | Update profile         |
| PUT    | `/api/user/password`        | Change password        |
| POST   | `/api/user/profile-picture` | Upload profile picture |
| DELETE | `/api/user/account`         | Delete account         |

### Files

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| POST   | `/api/files/upload` | Upload file       |
| GET    | `/api/files`        | Get user's files  |
| GET    | `/api/files/:id`    | Get specific file |
| DELETE | `/api/files/:id`    | Delete file       |

### Books

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/books`     | Get all books       |
| GET    | `/api/books/:id` | Get single book     |
| POST   | `/api/books`     | Create book (admin) |
| PUT    | `/api/books/:id` | Update book (admin) |
| DELETE | `/api/books/:id` | Delete book (admin) |

---

## How Everything Works

### 1. Frontend (React)

The frontend uses React with modern hooks for state management:

- **AuthContext**: Manages user authentication state globally
- **ProtectedRoute**: Wraps routes that require authentication
- **API Service**: Axios instance with interceptors for JWT handling

**Flow:**

1. User visits the site → sees Home page
2. Clicks Login → Modal opens
3. Enters credentials → API call to backend
4. On success → Token stored in localStorage, redirected to Dashboard
5. Protected routes check AuthContext for authentication

### 2. Backend (Node.js + Express)

The backend follows MVC pattern:

- **Models**: Define data structure (MongoDB schemas)
- **Controllers**: Business logic for each feature
- **Routes**: Map URLs to controllers
- **Middleware**: Authentication, file upload, error handling

### 3. Authentication (JWT)

**Signup Flow:**

1. User submits signup form
2. Backend validates data
3. Password hashed with bcrypt (10 rounds)
4. User saved to MongoDB
5. JWT token generated and sent to frontend

**Login Flow:**

1. User submits email/password
2. Backend finds user by email
3. Password compared with bcrypt
4. If match → JWT token generated and sent

**Protected Route Flow:**

1. Frontend sends request with `Authorization: Bearer <token>`
2. Backend middleware extracts and verifies token
3. If valid → Request proceeds
4. If invalid → 401 Unauthorized

### 4. JWT (JSON Web Token)

JWT contains:

- **Header**: Algorithm and token type
- **Payload**: User ID and expiration
- **Signature**: Ensures token integrity

```javascript
// Token generation
jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Token verification in middleware
jwt.verify(token, process.env.JWT_SECRET);
```

### 5. File Upload (Multer)

**How it works:**

1. Frontend sends file as `multipart/form-data`
2. Multer middleware intercepts the request
3. File saved to `uploads/` folder
4. File info saved to database
5. File path returned to frontend

**Configuration:**

- Max file size: 5MB
- Allowed types: JPEG, PNG, GIF, PDF, DOC, DOCX

### 6. React ↔ Backend Connection

Frontend uses Axios to communicate with backend:

```javascript
// Request interceptor adds JWT token
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});
```

**Response flow:**

1. React component calls API function
2. Axios sends HTTP request to backend
3. Backend processes and returns JSON response
4. React updates state with response data
5. UI re-renders with new data

---

## Quick Start Commands

```bash
# Terminal 1 - Backend
cd Backend
npm install
npm run dev

# Terminal 2 - Frontend
cd Front-end
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Technologies Used

**Frontend:**

- React 19
- React Router DOM
- React Hook Form
- Tailwind CSS
- DaisyUI
- Axios

**Backend:**

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Multer
- CORS

---

## Testing the Application

1. **Signup**: Go to `/signup` and create an account
2. **Login**: Click Login button and enter credentials
3. **Dashboard**: After login, you'll be redirected to dashboard
4. **Profile**: Edit your profile information
5. **Files**: Upload and manage your files
6. **Logout**: Click user avatar → Logout

---

## Security Features

- Password hashing with bcrypt
- JWT token expiration
- Protected API routes
- File type validation
- File size limits
- CORS enabled
- Input validation
