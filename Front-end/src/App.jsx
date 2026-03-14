import React from "react";
import Home from "./Home/Home.jsx";
import "./index.css";
import Course from "./Course/Course.jsx";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/HomePage/Signup.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import DashboardLayout from "./components/Dashboard/DashboardLayout.jsx";
import DashboardHome from "./components/Dashboard/DashboardHome.jsx";
import Profile from "./components/Dashboard/Profile.jsx";
import FileUpload from "./components/Dashboard/FileUpload.jsx";
import MyPurchases from "./components/Dashboard/MyPurchases.jsx";
import OrderHistory from "./components/Dashboard/OrderHistory.jsx";
import BookList from "./components/Book/BookList.jsx";
import BookDetail from "./components/Book/BookDetail.jsx";
import BookReader from "./components/Book/BookReader.jsx";
import SecurePDFViewer from "./components/SecurePDFViewer.jsx";
import PaymentSuccess from "./components/Payment/PaymentSuccess.jsx";
import PaymentCancel from "./components/Payment/PaymentCancel.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import BookForm from "./components/Admin/BookForm.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course" element={<Course />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* Book Routes */}
          <Route path="/books" element={<BookList />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route
            path="/book/:id/read"
            element={
              <ProtectedRoute>
                <BookReader />
              </ProtectedRoute>
            }
          />

          {/* Secure PDF Reader Route */}
          <Route
            path="/read/:bookId"
            element={
              <ProtectedRoute>
                <SecurePDFViewer />
              </ProtectedRoute>
            }
          />

          {/* Payment Routes */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="files" element={<FileUpload />} />
            <Route path="purchases" element={<MyPurchases />} />
            <Route path="orders" element={<OrderHistory />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books/new"
            element={
              <AdminRoute>
                <BookForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books/edit/:id"
            element={
              <AdminRoute>
                <BookForm />
              </AdminRoute>
            }
          />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
