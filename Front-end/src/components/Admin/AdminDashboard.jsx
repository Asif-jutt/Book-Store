import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAdminBooks, deleteBook } from "../../services/bookService";
import { getAllPurchases } from "../../services/purchaseService";
import { getAllOrders, getOrderStats } from "../../services/orderService";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../../services/userService";
import AdminNavbar from "./AdminNavbar";

const TAB_ROUTE_MAP = {
  "/admin": "overview",
  "/admin/analytics": "overview",
  "/admin/books": "books",
  "/admin/orders": "orders",
  "/admin/users": "users",
};

const TAB_PATH_MAP = {
  overview: "/admin",
  books: "/admin/books",
  orders: "/admin/orders",
  users: "/admin/users",
};

function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = TAB_ROUTE_MAP[location.pathname] || "overview";

  const [books, setBooks] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Sync tab with URL pathname
  useEffect(() => {
    const tabFromUrl = TAB_ROUTE_MAP[location.pathname] || "overview";
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
      setSearchTerm("");
    }
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchTerm("");
    const path = TAB_PATH_MAP[tabId] || "/admin";
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  };

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([
        getAdminBooks(),
        getAllPurchases(),
        getAllOrders(),
        getAllUsers(),
        getOrderStats(),
      ]);

      const [booksRes, purchasesRes, ordersRes, usersRes, orderStatsRes] =
        results;

      if (booksRes.status === "fulfilled" && booksRes.value.success) {
        setBooks(booksRes.value.data || []);
      }
      if (purchasesRes.status === "fulfilled" && purchasesRes.value.success) {
        setPurchases(purchasesRes.value.data || []);
        setStats(purchasesRes.value.stats);
      }
      if (ordersRes.status === "fulfilled" && ordersRes.value.success) {
        setOrders(ordersRes.value.data || []);
      }
      if (usersRes.status === "fulfilled" && usersRes.value.success) {
        setUsers(usersRes.value.data || []);
      }
      if (orderStatsRes.status === "fulfilled" && orderStatsRes.value.success) {
        setOrderStats(orderStatsRes.value.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`,
      )
    )
      return;

    try {
      await deleteBook(bookId);
      setBooks(books.filter((book) => book._id !== bookId));
      showNotification(`"${bookTitle}" has been deleted successfully.`);
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to delete book",
        "error",
      );
    }
  };

  const handleUpdateUserRole = async (userId, userName, newRole) => {
    if (!window.confirm(`Change ${userName}'s role to ${newRole}?`)) return;

    try {
      await updateUserRole(userId, newRole);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user,
        ),
      );
      showNotification(`${userName}'s role updated to ${newRole}`);
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to update user role",
        "error",
      );
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Delete user "${userName}"? This will remove all their data. This action cannot be undone.`,
      )
    )
      return;

    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
      showNotification(`User "${userName}" has been deleted.`);
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to delete user",
        "error",
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Filter function for search
  const filterItems = (items, term) => {
    if (!term) return items;
    return items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(term.toLowerCase()),
    );
  };

  // Stats calculations
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const freeBooks = books.filter((b) => b.category === "free").length;
  const paidBooks = books.filter((b) => b.category === "paid").length;
  const premiumBooks = books.filter((b) => b.category === "premium").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        <AdminNavbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNavbar />

      {/* Notification Toast - Nielsen #1: Visibility of system status */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div
            className={`alert ${notification.type === "error" ? "alert-error" : "alert-success"} shadow-lg`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="btn btn-ghost btn-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back! Here's what's happening with your bookstore.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="btn btn-outline btn-sm gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
            <Link
              to="/admin/books/new"
              className="btn btn-primary btn-sm gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Book
            </Link>
          </div>
        </div>

        {/* Error Alert - Nielsen #9: Help users recognize, diagnose, and recover from errors */}
        {error && (
          <div className="alert alert-error mb-8 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-bold">Error loading data</h3>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={fetchData} className="btn btn-sm">
              Try Again
            </button>
          </div>
        )}

        {/* Stats Cards - Nielsen #8: Aesthetic and minimalist design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Books */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Books
                </p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                  {books.length}
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  <span className="text-green-500">{freeBooks} free</span> •
                  <span className="text-blue-500"> {paidBooks} paid</span> •
                  <span className="text-purple-500">
                    {" "}
                    {premiumBooks} premium
                  </span>
                </p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Revenue
                </p>
                <h3 className="text-3xl font-bold text-green-600 mt-1">
                  {formatCurrency(totalRevenue)}
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  From {orders.filter((o) => o.paymentStatus === "paid").length}{" "}
                  paid orders
                </p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Users
                </p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                  {users.length}
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  {users.filter((u) => u.role === "admin").length} admins •{" "}
                  {users.filter((u) => u.role === "user").length} users
                </p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Orders
                </p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                  {orders.length}
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  {purchases.filter((p) => p.paymentMethod === "free").length}{" "}
                  free enrollments
                </p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Nielsen #4: Consistency and standards */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex overflow-x-auto">
              {[
                { id: "overview", label: "Overview", icon: "📊" },
                {
                  id: "books",
                  label: "Books",
                  count: books.length,
                  icon: "📚",
                },
                {
                  id: "orders",
                  label: "Orders",
                  count: orders.length,
                  icon: "🛒",
                },
                {
                  id: "users",
                  label: "Users",
                  count: users.length,
                  icon: "👥",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Search Bar - Nielsen #7: Flexibility and efficiency of use */}
            {activeTab !== "overview" && activeTab !== "approvals" && (
              <div className="mb-6">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full pl-10 bg-slate-50 dark:bg-slate-700"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Books */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-white">
                      Recent Books
                    </h3>
                    <button
                      onClick={() => handleTabChange("books")}
                      className="text-sm text-primary hover:underline"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {books.slice(0, 5).map((book) => (
                      <div
                        key={book._id}
                        className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg"
                      >
                        <img
                          src={
                            book.thumbnail ||
                            "https://via.placeholder.com/60x80?text=Book"
                          }
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-800 dark:text-white truncate">
                            {book.title}
                          </h4>
                          <p className="text-sm text-slate-500 truncate">
                            {book.author}
                          </p>
                        </div>
                        <span
                          className={`badge badge-sm ${
                            book.category === "free"
                              ? "badge-success"
                              : book.category === "premium"
                                ? "badge-secondary"
                                : "badge-primary"
                          }`}
                        >
                          {book.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-white">
                      Recent Orders
                    </h3>
                    <button
                      onClick={() => handleTabChange("orders")}
                      className="text-sm text-primary hover:underline"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              order.paymentStatus === "paid"
                                ? "bg-green-100 text-green-600"
                                : order.paymentStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-red-100 text-red-600"
                            }`}
                          >
                            {order.paymentStatus === "paid"
                              ? "✓"
                              : order.paymentStatus === "pending"
                                ? "⏳"
                                : "✕"}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-white">
                              {order.customerName || "Guest"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {order.amount === 0
                              ? "Free"
                              : formatCurrency(order.amount)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {order.book?.title?.substring(0, 20)}...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 lg:col-span-2">
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-4">
                    Book Categories Distribution
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <p className="text-3xl font-bold text-green-600">
                        {freeBooks}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        Free Books
                      </p>
                      <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(freeBooks / books.length) * 100 || 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <p className="text-3xl font-bold text-blue-600">
                        {paidBooks}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Paid Books
                      </p>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(paidBooks / books.length) * 100 || 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <p className="text-3xl font-bold text-purple-600">
                        {premiumBooks}
                      </p>
                      <p className="text-sm text-purple-700 dark:text-purple-400">
                        Premium Books
                      </p>
                      <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${(premiumBooks / books.length) * 100 || 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Books Tab */}
            {activeTab === "books" && (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="rounded-l-lg">Book</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Students</th>
                      <th>Status</th>
                      <th className="rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems(books, searchTerm).map((book) => (
                      <tr
                        key={book._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                book.thumbnail ||
                                "https://via.placeholder.com/50x70?text=Book"
                              }
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{book.title}</p>
                              <p className="text-xs text-slate-500">
                                {book.totalChapters || 0} chapters
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-slate-600 dark:text-slate-400">
                          {book.author}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              book.category === "free"
                                ? "badge-success"
                                : book.category === "premium"
                                  ? "badge-secondary"
                                  : "badge-primary"
                            }`}
                          >
                            {book.category}
                          </span>
                        </td>
                        <td className="font-medium">
                          {book.category === "free" ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            formatCurrency(book.price)
                          )}
                        </td>
                        <td>{book.totalStudents || 0}</td>
                        <td>
                          <span
                            className={`badge badge-sm ${book.isPublished ? "badge-success" : "badge-warning"}`}
                          >
                            {book.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Link
                              to={`/admin/books/edit/${book._id}`}
                              className="btn btn-ghost btn-xs"
                              title="Edit book"
                            >
                              ✏️
                            </Link>
                            <Link
                              to={`/book/${book._id}`}
                              className="btn btn-ghost btn-xs"
                              title="View book"
                              target="_blank"
                            >
                              👁️
                            </Link>
                            <button
                              onClick={() =>
                                handleDeleteBook(book._id, book.title)
                              }
                              className="btn btn-ghost btn-xs text-error"
                              title="Delete book"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filterItems(books, searchTerm).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-500">
                      No books found matching "{searchTerm}"
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="btn btn-link btn-sm"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="rounded-l-lg">Order</th>
                      <th>Customer</th>
                      <th>Book</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th className="rounded-r-lg">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems(orders, searchTerm).map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="font-mono text-sm">
                          {order.orderNumber || order._id.slice(-8)}
                        </td>
                        <td>
                          <div>
                            <p className="font-medium">
                              {order.customerName || "Guest"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {order.customerEmail}
                            </p>
                          </div>
                        </td>
                        <td>{order.book?.title || "N/A"}</td>
                        <td className="font-medium">
                          {order.amount === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            formatCurrency(order.amount)
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              order.paymentStatus === "paid"
                                ? "badge-success"
                                : order.paymentStatus === "pending"
                                  ? "badge-warning"
                                  : "badge-error"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="text-slate-500">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filterItems(orders, searchTerm).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-500">
                      No orders found matching "{searchTerm}"
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="btn btn-link btn-sm"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="rounded-l-lg">User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Purchases</th>
                      <th>Joined</th>
                      <th className="rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems(users, searchTerm).map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                              {user.fullName?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="font-medium">{user.fullName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-slate-500">{user.email}</td>
                        <td>
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleUpdateUserRole(
                                user._id,
                                user.fullName,
                                e.target.value,
                              )
                            }
                            className={`select select-bordered select-xs ${
                              user.role === "admin" ? "text-purple-600" : ""
                            }`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>{user.purchaseCount || 0}</td>
                        <td className="text-slate-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              handleDeleteUser(user._id, user.fullName)
                            }
                            className="btn btn-ghost btn-xs text-error"
                            title="Delete user"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filterItems(users, searchTerm).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-500">
                      No users found matching "{searchTerm}"
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="btn btn-link btn-sm"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel - Nielsen #7: Flexibility and efficiency of use */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/books/new"
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-2xl">📚</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Add Book
              </span>
            </Link>
            <button
              onClick={() => handleTabChange("users")}
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-2xl">👤</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Manage Users
              </span>
            </button>
            <button
              onClick={() => handleTabChange("orders")}
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-2xl">📦</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                View Orders
              </span>
            </button>
            <button
              onClick={() => handleTabChange("books")}
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                All Books
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
