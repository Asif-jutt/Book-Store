# BOOKSTORE APPLICATION - COMPLETE SYSTEM DOCUMENTATION

## Project Overview

This is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) bookstore web application with user authentication, dashboard, and file upload capabilities.

---

## SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│                     http://localhost:5173                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests (Axios)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React.js)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Components: Navbar, Login, Signup, Dashboard, Profile    │   │
│  │ Context: AuthContext (user state management)             │   │
│  │ Services: api.js (Axios HTTP client)                     │   │
│  │ Routes: Protected routes with JWT verification           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API Calls
                              │ Authorization: Bearer <JWT Token>
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│                     http://localhost:5000                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Middleware: CORS, JSON Parser, Auth, Error Handler       │   │
│  │ Routes: /api/auth, /api/user, /api/files, /api/books     │   │
│  │ Controllers: Business logic for each feature             │   │
│  │ Models: User, File, Book (Mongoose schemas)              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                            │
│                mongodb://localhost:27017/bookstore               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Collections: users, files, books                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## FOLDER STRUCTURE

### Backend Structure

```
Backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # Signup, Login, GetMe logic
│   ├── userController.js     # Profile CRUD operations
│   ├── fileController.js     # File upload/delete logic
│   └── bookController.js     # Book CRUD operations
├── middleware/
│   ├── auth.js               # JWT token verification
│   ├── upload.js             # Multer file upload config
│   └── error.js              # Global error handler
├── models/
│   ├── User.js               # User schema with password hashing
│   ├── File.js               # File metadata schema
│   └── Book.js               # Book schema
├── routes/
│   ├── authRoutes.js         # POST /signup, /login, GET /me
│   ├── userRoutes.js         # Profile and password routes
│   ├── fileRoutes.js         # File upload/download routes
│   └── bookRoutes.js         # Book CRUD routes
├── uploads/                  # Uploaded files storage
├── utils/
│   └── generateToken.js      # JWT token generation
├── .env                      # Environment variables
├── index.js                  # Server entry point
└── package.json              # Dependencies
```

### Frontend Structure

```
Front-end/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── DashboardLayout.jsx    # Dashboard wrapper
│   │   │   ├── DashboardNavbar.jsx    # Dashboard navigation
│   │   │   ├── DashboardHome.jsx      # Dashboard main page
│   │   │   ├── Profile.jsx            # Edit profile page
│   │   │   └── FileUpload.jsx         # File management page
│   │   ├── HomePage/
│   │   │   ├── Navbar.jsx             # Main navigation
│   │   │   ├── Login.jsx              # Login modal
│   │   │   ├── Sign.jsx               # Signup form
│   │   │   ├── Banner.jsx             # Hero section
│   │   │   └── Footer.jsx             # Footer
│   │   └── ProtectedRoute.jsx         # Route guard
│   ├── context/
│   │   └── AuthContext.jsx            # Global auth state
│   ├── services/
│   │   └── api.js                     # Axios API client
│   ├── App.jsx                        # Main routing
│   └── main.jsx                       # Entry point
└── package.json                       # Dependencies
```

---

## DATABASE SCHEMAS

### User Schema

```javascript
{
  fullName: String (required, max 50 chars),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, hashed),
  profilePicture: String (file path),
  bio: String (max 200 chars),
  role: String (enum: "user", "admin"),
  createdAt: Date,
  updatedAt: Date
}
```

### File Schema

```javascript
{
  user: ObjectId (reference to User),
  filename: String (generated name),
  originalName: String (uploaded name),
  mimetype: String (file type),
  size: Number (bytes),
  path: String (storage path),
  fileType: String (enum: "profile", "document", "other"),
  createdAt: Date
}
```

### Book Schema

```javascript
{
  title: String (required),
  author: String (required),
  description: String (required),
  price: Number (required, min 0),
  category: String (enum: "free", "paid", "premium"),
  image: String (book cover path),
  createdBy: ObjectId (reference to User),
  createdAt: Date
}
```

---

## API ENDPOINTS

### Authentication APIs

| Method | Endpoint         | Description             | Auth Required |
| ------ | ---------------- | ----------------------- | ------------- |
| POST   | /api/auth/signup | Create new user account | No            |
| POST   | /api/auth/login  | Login and get JWT token | No            |
| GET    | /api/auth/me     | Get current user info   | Yes           |

### User APIs

| Method | Endpoint                  | Description          | Auth Required |
| ------ | ------------------------- | -------------------- | ------------- |
| GET    | /api/user/profile         | Get user profile     | Yes           |
| PUT    | /api/user/profile         | Update name and bio  | Yes           |
| PUT    | /api/user/password        | Change password      | Yes           |
| POST   | /api/user/profile-picture | Upload profile image | Yes           |
| DELETE | /api/user/account         | Delete user account  | Yes           |

### File APIs

| Method | Endpoint          | Description      | Auth Required |
| ------ | ----------------- | ---------------- | ------------- |
| POST   | /api/files/upload | Upload a file    | Yes           |
| GET    | /api/files        | Get user's files | Yes           |
| GET    | /api/files/:id    | Get single file  | Yes           |
| DELETE | /api/files/:id    | Delete a file    | Yes           |

### Book APIs

| Method | Endpoint       | Description     | Auth Required |
| ------ | -------------- | --------------- | ------------- |
| GET    | /api/books     | Get all books   | No            |
| GET    | /api/books/:id | Get single book | No            |
| POST   | /api/books     | Create book     | Yes (Admin)   |
| PUT    | /api/books/:id | Update book     | Yes (Admin)   |
| DELETE | /api/books/:id | Delete book     | Yes (Admin)   |

---

## AUTHENTICATION FLOW

### Signup Process

```
1. User fills signup form (fullName, email, password)
2. Frontend sends POST /api/auth/signup
3. Backend checks if email exists
4. Password hashed with bcrypt (10 salt rounds)
5. User saved to MongoDB
6. JWT token generated (expires in 7 days)
7. Token + user data sent to frontend
8. Frontend stores in localStorage
9. User redirected to Dashboard
```

### Login Process

```
1. User enters email and password
2. Frontend sends POST /api/auth/login
3. Backend finds user by email
4. Password compared using bcrypt
5. If match: JWT token generated
6. Token + user data sent to frontend
7. Frontend stores in localStorage
8. User redirected to Dashboard
```

### Protected Route Access

```
1. User tries to access /dashboard
2. ProtectedRoute component checks AuthContext
3. If no user: Redirect to home page
4. If user exists: Allow access
5. API calls include: Authorization: Bearer <token>
6. Backend middleware verifies token
7. If valid: Request proceeds
8. If invalid: 401 Unauthorized
```

---

## JWT TOKEN STRUCTURE

### Token Generation

```javascript
jwt.sign(
  { id: user._id }, // Payload
  process.env.JWT_SECRET, // Secret key
  { expiresIn: "7d" }, // Expiration
);
```

### Token Contents

```
Header: { alg: "HS256", typ: "JWT" }
Payload: { id: "user_mongo_id", iat: timestamp, exp: timestamp }
Signature: HMACSHA256(header + payload, secret)
```

### Token Verification

```javascript
// In auth middleware
const token = req.headers.authorization.split(" ")[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id);
```

---

## FILE UPLOAD SYSTEM

### Multer Configuration

```javascript
{
  storage: diskStorage({
    destination: 'uploads/',
    filename: 'fieldname-timestamp-random.extension'
  }),
  limits: { fileSize: 5MB },
  fileFilter: [jpeg, jpg, png, gif, pdf, doc, docx]
}
```

### Upload Flow

```
1. User selects file (drag-drop or browse)
2. React creates FormData object
3. Axios sends POST with multipart/form-data
4. Multer middleware saves file to uploads/
5. File metadata saved to MongoDB
6. File path returned to frontend
7. Frontend updates UI with new file
```

---

## FRONTEND STATE MANAGEMENT

### AuthContext Provider

```javascript
// Provides to entire app:
{
  user: { _id, fullName, email, profilePicture, token },
  loading: boolean,
  isAuthenticated: boolean,
  login: function,
  signup: function,
  logout: function,
  updateUser: function
}
```

### API Service (Axios)

```javascript
// Interceptors:
1. Request: Adds Authorization header with token
2. Response: Handles 401 errors (auto logout)

// API modules:
- authAPI: signup, login, getMe
- userAPI: getProfile, updateProfile, uploadProfilePicture
- fileAPI: upload, getMyFiles, deleteFile
- bookAPI: getBooks, createBook, updateBook, deleteBook
```

---

## SECURITY FEATURES

| Feature          | Implementation                 |
| ---------------- | ------------------------------ |
| Password Hashing | bcrypt with 10 salt rounds     |
| Token Encryption | HMAC SHA256 signature          |
| Token Expiration | 7 days automatic expiry        |
| Protected Routes | JWT middleware verification    |
| File Validation  | Type and size restrictions     |
| Input Validation | Mongoose schema validators     |
| CORS             | Configured for frontend origin |
| Error Handling   | Global error middleware        |

---

## RUNNING THE APPLICATION

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd Backend
npm install
# Start MongoDB first
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd Front-end
npm install
npm run dev
# App runs on http://localhost:5173
```

### Environment Variables (Backend/.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

---

## USER INTERFACE PAGES

| Page      | URL                | Description                             |
| --------- | ------------------ | --------------------------------------- |
| Home      | /                  | Landing page with navbar, banner, books |
| Course    | /course            | Course listing page                     |
| Signup    | /signup            | New user registration                   |
| Dashboard | /dashboard         | User welcome and stats                  |
| Profile   | /dashboard/profile | Edit profile and password               |
| Files     | /dashboard/files   | Upload and manage files                 |

---

## TECHNOLOGIES USED

### Frontend

- React 19 - UI library
- React Router DOM - Client-side routing
- React Hook Form - Form handling
- Axios - HTTP client
- Tailwind CSS - Styling
- DaisyUI - UI components
- Vite - Build tool

### Backend

- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - NoSQL database
- Mongoose - ODM for MongoDB
- JWT - Authentication tokens
- bcryptjs - Password hashing
- Multer - File uploads
- CORS - Cross-origin requests
- dotenv - Environment variables

---

## TROUBLESHOOTING

| Issue                    | Solution                               |
| ------------------------ | -------------------------------------- |
| Port 5000 in use         | Kill process: `taskkill /PID <pid> /F` |
| Module not found         | Run `npm install` in that folder       |
| MongoDB connection error | Ensure MongoDB is running              |
| CORS error               | Check backend CORS configuration       |
| Token expired            | Login again to get new token           |
| File upload fails        | Check file size (max 5MB) and type     |

---

## CONCLUSION

This Bookstore application demonstrates a complete full-stack development workflow:

1. **Frontend**: Modern React with hooks, context API, and protected routing
2. **Backend**: RESTful API with Express.js, proper MVC architecture
3. **Database**: MongoDB with Mongoose schemas and relationships
4. **Security**: JWT authentication, password hashing, input validation
5. **File Handling**: Multer for uploads with type/size restrictions

The application follows industry best practices with clean folder structure, separation of concerns, and proper error handling throughout.

---

## PURCHASE SYSTEM

### Overview

The bookstore includes a complete e-commerce purchase system with:

- Book/course pricing (free, paid, premium categories)
- Stripe payment integration
- Purchase history tracking
- Content access protection
- Admin management panel

### Purchase Schema

```javascript
{
  user: ObjectId (reference to User),
  book: ObjectId (reference to Book),
  price: Number,
  currency: String (default: "usd"),
  paymentStatus: String (enum: "pending", "completed", "failed", "refunded"),
  paymentMethod: String (enum: "stripe", "paypal", "free"),
  transactionId: String,
  stripeSessionId: String,
  stripePaymentIntentId: String,
  purchaseDate: Date,
  accessGrantedAt: Date
}
```

### Updated Book Schema

```javascript
{
  title: String (required),
  author: String (required),
  description: String,
  price: Number (default: 0),
  category: String (enum: "free", "paid", "premium"),
  thumbnail: String,
  content: String (protected content),
  chapters: [{
    title: String,
    content: String,
    duration: String,
    videoUrl: String,
    order: Number
  }],
  totalDuration: String,
  totalChapters: Number,
  level: String (enum: "beginner", "intermediate", "advanced"),
  language: String,
  tags: [String],
  rating: Number,
  totalRatings: Number,
  totalStudents: Number,
  isPublished: Boolean,
  createdBy: ObjectId (reference to User)
}
```

### Payment APIs

| Method | Endpoint                       | Description               | Auth Required |
| ------ | ------------------------------ | ------------------------- | ------------- |
| POST   | /api/payment/create-session    | Create Stripe checkout    | Yes           |
| GET    | /api/payment/verify/:sessionId | Verify payment completion | Yes           |
| GET    | /api/payment/history           | Get payment history       | Yes           |
| POST   | /api/payment/webhook           | Stripe webhook endpoint   | No (Stripe)   |

### Purchase APIs

| Method | Endpoint                     | Description              | Auth Required |
| ------ | ---------------------------- | ------------------------ | ------------- |
| POST   | /api/purchases/enroll        | Enroll in free book      | Yes           |
| GET    | /api/purchases/my-purchases  | Get user's purchases     | Yes           |
| GET    | /api/purchases/check/:bookId | Check purchase status    | Yes           |
| GET    | /api/purchases/admin/all     | Admin: Get all purchases | Yes (Admin)   |
| GET    | /api/purchases/:id           | Get purchase details     | Yes           |

### Book APIs (Updated)

| Method | Endpoint               | Description           | Auth Required |
| ------ | ---------------------- | --------------------- | ------------- |
| GET    | /api/books             | Get published books   | No            |
| GET    | /api/books/search      | Search books          | No            |
| GET    | /api/books/:id         | Get book (basic info) | No            |
| GET    | /api/books/:id/content | Get book chapters     | Yes (Owner)   |
| GET    | /api/books/admin/all   | Admin: Get all books  | Yes (Admin)   |
| POST   | /api/books             | Create book           | Yes (Admin)   |
| PUT    | /api/books/:id         | Update book           | Yes (Admin)   |
| DELETE | /api/books/:id         | Delete book           | Yes (Admin)   |

### Stripe Integration

#### Configuration (.env)

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=http://localhost:5173
```

#### Checkout Flow

```
1. User clicks "Buy Now" on book page
2. Frontend calls POST /api/payment/create-session with bookId
3. Backend creates Stripe Checkout Session with:
   - Line items (book title, price)
   - Success URL with session_id
   - Cancel URL with book_id
4. User redirected to Stripe checkout page
5. After payment, user redirected to success page
6. Frontend calls GET /api/payment/verify/:sessionId
7. Backend verifies payment and creates Purchase record
8. User granted access to book content
```

#### Webhook Events

```
- checkout.session.completed: Payment successful
- payment_intent.failed: Payment failed
```

### Access Control

#### Course Access Middleware

```javascript
// checkCourseAccess - Blocks access if not purchased
// optionalCourseAccess - Adds purchase status without blocking
```

#### Content Protection

- Book chapters/content hidden for non-purchasers
- API endpoints protected with purchase verification
- Frontend shows buy button or content based on ownership

### Frontend Components

#### New Components

| Component      | Path                                    | Description             |
| -------------- | --------------------------------------- | ----------------------- |
| BookList       | /books                                  | Browse all books        |
| BookDetail     | /book/:id                               | Book page with chapters |
| PaymentSuccess | /payment/success                        | Payment completion page |
| PaymentCancel  | /payment/cancel                         | Payment cancelled page  |
| MyPurchases    | /dashboard/purchases                    | User's purchased books  |
| AdminDashboard | /admin                                  | Admin management panel  |
| BookForm       | /admin/books/new, /admin/books/edit/:id | Add/edit books          |

#### Service Files

| File               | Description                        |
| ------------------ | ---------------------------------- |
| purchaseService.js | API calls for purchases & payments |
| bookService.js     | API calls for book operations      |

### Admin Features

- Dashboard with stats (total books, purchases, revenue)
- Book management (create, edit, delete)
- Purchase tracking and history
- Publish/unpublish books
- Chapter management

### Purchase Flow Diagrams

#### Free Book Enrollment

```
User → Click "Enroll Free" → POST /purchases/enroll
→ Create Purchase (paymentMethod: "free", status: "completed")
→ Update book totalStudents → Grant Access → Show Content
```

#### Paid Book Purchase

```
User → Click "Buy Now" → POST /payment/create-session
→ Create Stripe Session → Redirect to Stripe
→ User pays → Stripe webhook → Create Purchase
→ Verify session → Grant Access → Show Content
```

### Testing Stripe Locally

1. Install Stripe CLI
2. Forward webhooks: `stripe listen --forward-to localhost:5000/api/payment/webhook`
3. Use test card: 4242 4242 4242 4242
4. Check webhook events in terminal

---

## UPDATED FOLDER STRUCTURE

### Backend Structure (Updated)

```
Backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── fileController.js
│   ├── bookController.js      # Updated with access control
│   ├── paymentController.js   # NEW: Stripe integration
│   └── purchaseController.js  # NEW: Purchase management
├── middleware/
│   ├── auth.js
│   ├── upload.js
│   ├── error.js
│   └── courseAccess.js        # NEW: Access protection
├── models/
│   ├── User.js
│   ├── File.js
│   ├── Book.js                # Updated with chapters
│   └── Purchase.js            # NEW: Purchase records
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── fileRoutes.js
│   ├── bookRoutes.js          # Updated with content route
│   ├── paymentRoutes.js       # NEW: Payment endpoints
│   └── purchaseRoutes.js      # NEW: Purchase endpoints
├── uploads/
├── utils/
│   └── generateToken.js
├── .env
├── index.js                   # Updated with new routes
└── package.json               # Added stripe dependency
```

### Frontend Structure (Updated)

```
Front-end/
├── src/
│   ├── components/
│   │   ├── Admin/             # NEW
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── BookForm.jsx
│   │   ├── Book/              # NEW
│   │   │   ├── BookList.jsx
│   │   │   └── BookDetail.jsx
│   │   ├── Dashboard/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── DashboardNavbar.jsx # Updated with new links
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── MyPurchases.jsx     # NEW
│   │   ├── Payment/           # NEW
│   │   │   ├── PaymentSuccess.jsx
│   │   │   └── PaymentCancel.jsx
│   │   ├── HomePage/
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── bookService.js     # NEW
│   │   └── purchaseService.js # NEW
│   ├── App.jsx                # Updated with new routes
│   └── main.jsx
└── package.json
```

---

## UPDATED UI PAGES

| Page            | URL                   | Description                      |
| --------------- | --------------------- | -------------------------------- |
| Home            | /                     | Landing page                     |
| Course          | /course               | Course listing                   |
| Signup          | /signup               | User registration                |
| Login           | /login                | User login                       |
| Books           | /books                | Browse all books                 |
| Book Detail     | /book/:id             | Single book with purchase option |
| Payment Success | /payment/success      | After successful payment         |
| Payment Cancel  | /payment/cancel       | After cancelled payment          |
| Dashboard       | /dashboard            | User home                        |
| Profile         | /dashboard/profile    | Edit profile                     |
| Files           | /dashboard/files      | Manage files                     |
| My Purchases    | /dashboard/purchases  | Purchased books                  |
| Admin Dashboard | /admin                | Admin overview & management      |
| Add Book        | /admin/books/new      | Create new book                  |
| Edit Book       | /admin/books/edit/:id | Edit existing book               |
