import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function DashboardNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 dark:bg-slate-800 shadow-lg px-4 md:px-8">
      <div className="flex-1">
        <Link to="/" className="font-bold text-xl">
          Book Store
        </Link>
      </div>
      <div className="flex-none gap-4">
        <Link to="/books" className="btn btn-ghost btn-sm">
          Browse Books
        </Link>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {user?.profilePicture ? (
                <img
                  src={`http://localhost:5000${user.profilePicture}`}
                  alt="Profile"
                />
              ) : (
                <div className="bg-secondary text-white flex items-center justify-center w-full h-full text-lg font-bold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 dark:bg-slate-700 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li className="menu-title px-4 py-2">
              <span className="font-semibold">{user?.fullName}</span>
              <span className="text-xs opacity-70">{user?.email}</span>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/dashboard/purchases">My Purchases</Link>
            </li>
            <li>
              <Link to="/dashboard/orders">Order History</Link>
            </li>
            <li>
              <Link to="/dashboard/profile">Edit Profile</Link>
            </li>
            <li>
              <Link to="/dashboard/files">My Files</Link>
            </li>
            {user?.role === "admin" && (
              <li>
                <Link to="/admin" className="text-primary font-semibold">
                  Admin Panel
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="text-error">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardNavbar;
