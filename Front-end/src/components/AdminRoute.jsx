import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-900">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-900">
        <div className="card bg-base-100 shadow-xl max-w-md mx-4">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="card-title justify-center">Login Required</h2>
            <p className="text-gray-600">
              Please login to access the admin panel.
            </p>
            <div className="card-actions justify-center mt-4 gap-2">
              <Link
                to="/login"
                state={{ from: location }}
                className="btn btn-primary"
              >
                Login
              </Link>
              <Link to="/" className="btn btn-outline">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-900">
        <div className="card bg-base-100 shadow-xl max-w-md mx-4">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="card-title justify-center text-error">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You don't have permission to access the admin panel.
            </p>
            <div className="card-actions justify-center mt-4 gap-2">
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
              <Link to="/" className="btn btn-outline">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
