import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/HomePage/Navbar";
import Footer from "../components/HomePage/Footer";

function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900">
        <div className="text-center max-w-lg">
          <div className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4">
            404
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/"
              className="btn bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 text-white border-none hover:opacity-90"
            >
              Go Home
            </Link>
            <Link
              to="/books"
              className="btn btn-outline dark:border-slate-600 dark:text-slate-300"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;
