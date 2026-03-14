import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI, fileAPI } from "../../services/api";
import { Link } from "react-router-dom";

function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ filesCount: 0 });
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filesRes = await fileAPI.getMyFiles();
        setStats({ filesCount: filesRes.data.count });
        setRecentFiles(filesRes.data.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, {user?.fullName}!</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 dark:bg-slate-800 shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  {user?.profilePicture ? (
                    <img
                      src={`http://localhost:5000${user.profilePicture}`}
                      alt="Profile"
                    />
                  ) : (
                    <div className="bg-secondary text-white flex items-center justify-center w-full h-full text-2xl font-bold">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h2 className="card-title">{user?.fullName}</h2>
                <p className="text-sm opacity-70">{user?.email}</p>
                <span className="badge badge-secondary mt-1">{user?.role}</span>
              </div>
            </div>
            <div className="card-actions justify-end mt-4">
              <Link to="/dashboard/profile" className="btn btn-sm btn-outline">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 dark:bg-slate-800 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              My Files
            </h2>
            <p className="text-4xl font-bold">{stats.filesCount}</p>
            <p className="text-sm opacity-70">Total uploaded files</p>
            <div className="card-actions justify-end mt-4">
              <Link to="/dashboard/files" className="btn btn-sm btn-outline">
                View All
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-secondary text-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="space-y-2 mt-2">
              <Link
                to="/dashboard/files"
                className="btn btn-outline btn-sm w-full border-white text-white hover:bg-white hover:text-secondary"
              >
                Upload New File
              </Link>
              <Link
                to="/dashboard/profile"
                className="btn btn-outline btn-sm w-full border-white text-white hover:bg-white hover:text-secondary"
              >
                Update Profile
              </Link>
              <Link
                to="/books"
                className="btn btn-outline btn-sm w-full border-white text-white hover:bg-white hover:text-secondary"
              >
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      </div>

      {user?.bio && (
        <div className="card bg-base-100 dark:bg-slate-800 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">About Me</h2>
            <p>{user.bio}</p>
          </div>
        </div>
      )}

      <div className="card bg-base-100 dark:bg-slate-800 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Files</h2>
          {recentFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFiles.map((file) => (
                    <tr key={file._id}>
                      <td>{file.originalName}</td>
                      <td>
                        <span className="badge badge-ghost">
                          {file.fileType}
                        </span>
                      </td>
                      <td>{(file.size / 1024).toFixed(2)} KB</td>
                      <td>{new Date(file.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 opacity-70">No files uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
