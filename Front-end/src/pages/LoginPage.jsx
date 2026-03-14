import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/HomePage/Navbar";
import Footer from "../components/HomePage/Footer";
import Login from "../components/HomePage/Login";

function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already logged in, go to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Auto-open the login modal when this page mounts
  useEffect(() => {
    const modal = document.getElementById("my_modal_3");
    if (modal) {
      modal.showModal();
      // If modal is closed without login, navigate back
      const handleClose = () => {
        if (!isAuthenticated) navigate(-1);
      };
      modal.addEventListener("close", handleClose);
      return () => modal.removeEventListener("close", handleClose);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-900">
        <Login />
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
