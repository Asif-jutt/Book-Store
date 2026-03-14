import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const sidebarLinks = [
    {
      category: "Main",
      items: [
        { path: "/admin", label: "Dashboard", icon: "📊", exact: true },
        { path: "/admin/analytics", label: "Analytics", icon: "📈" },
      ],
    },
    {
      category: "Content",
      items: [
        { path: "/admin/books", label: "All Books", icon: "📚" },
        { path: "/admin/books/new", label: "Add Book", icon: "➕" },
        { path: "/admin/categories", label: "Categories", icon: "🏷️" },
      ],
    },
    {
      category: "Sales",
      items: [
        { path: "/admin/orders", label: "Orders", icon: "🛒" },
        { path: "/admin/purchases", label: "Purchases", icon: "💳" },
        { path: "/admin/revenue", label: "Revenue", icon: "💰" },
      ],
    },
    {
      category: "Users",
      items: [
        { path: "/admin/users", label: "All Users", icon: "👥" },
        { path: "/admin/admins", label: "Admins", icon: "🔑" },
      ],
    },
    {
      category: "Settings",
      items: [
        { path: "/admin/settings", label: "Settings", icon: "⚙️" },
        { path: "/admin/logs", label: "Activity Logs", icon: "📋" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNavbar />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-white dark:bg-slate-800 min-h-[calc(100vh-4rem)] shadow-lg transition-all duration-300 hidden lg:block`}
        >
          <div className="p-4">
            {/* Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Navigation Links */}
            <nav className="space-y-6">
              {sidebarLinks.map((group) => (
                <div key={group.category}>
                  {sidebarOpen && (
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                      {group.category}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            item.exact
                              ? location.pathname === item.path
                                ? "bg-primary text-white shadow-md"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                              : isActive(item.path)
                                ? "bg-primary text-white shadow-md"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                          title={!sidebarOpen ? item.label : undefined}
                        >
                          <span className="text-lg">{item.icon}</span>
                          {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          {sidebarOpen && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="bg-linear-to-r from-primary to-secondary rounded-lg p-4 text-white">
                <h4 className="font-semibold text-sm mb-1">Need Help?</h4>
                <p className="text-xs text-white/80 mb-3">
                  Check our documentation
                </p>
                <Link
                  to="/admin/help"
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors inline-block"
                >
                  View Docs
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="text-sm text-slate-500 dark:text-slate-400">
              <ol className="flex items-center gap-2">
                <li>
                  <Link
                    to="/admin"
                    className="hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                </li>
                {location.pathname !== "/admin" && (
                  <>
                    <li>/</li>
                    <li className="text-slate-700 dark:text-slate-200 capitalize">
                      {location.pathname.split("/").pop().replace(/-/g, " ")}
                    </li>
                  </>
                )}
              </ol>
            </nav>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
