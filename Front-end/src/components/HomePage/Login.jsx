import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import toast from "react-hot-toast";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleLogin, facebookLogin, githubLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ─── Handle GitHub callback code from URL ──────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (code && state === "github_login") {
      window.history.replaceState({}, document.title, window.location.pathname);
      handleGitHubCallback(code);
    }
  }, []);

  // ─── Email/Password Login ─────────────────────────────────────
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      await login(data);
      document.getElementById("my_modal_3")?.close();
      toast.success("Welcome back!");
      navigate(redirectTo);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      const providers = err.response?.data?.existingProviders;
      if (providers?.length) {
        setError(`${msg}`);
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Google OAuth ─────────────────────────────────────────────
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setSocialLoading("google");
      setError("");
      try {
        await googleLogin(tokenResponse.access_token);
        document.getElementById("my_modal_3")?.close();
        toast.success("Welcome back!");
        navigate(redirectTo);
      } catch (err) {
        setError(err.response?.data?.message || "Google login failed");
      } finally {
        setSocialLoading("");
      }
    },
    onError: () => setError("Google login failed. Please try again."),
  });

  // ─── Facebook OAuth ───────────────────────────────────────────
  const handleFacebookLogin = () => {
    if (!FACEBOOK_APP_ID) {
      toast.error("Facebook login is not configured yet");
      return;
    }
    setSocialLoading("facebook");
    setError("");

    if (!window.FB) {
      toast.error("Facebook SDK not loaded. Please refresh and try again.");
      setSocialLoading("");
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const { accessToken } = response.authResponse;
          facebookLogin(accessToken)
            .then(() => {
              document.getElementById("my_modal_3")?.close();
              toast.success("Welcome back!");
              navigate(redirectTo);
            })
            .catch((err) => {
              setError(err.response?.data?.message || "Facebook login failed");
            })
            .finally(() => setSocialLoading(""));
        } else {
          setError("Facebook login was cancelled");
          setSocialLoading("");
        }
      },
      { scope: "email,public_profile" },
    );
  };

  // ─── GitHub OAuth (redirect flow) ─────────────────────────────
  const handleGitHubLogin = () => {
    if (!GITHUB_CLIENT_ID) {
      toast.error("GitHub login is not configured yet");
      return;
    }
    setSocialLoading("github");
    const redirectUri = `${window.location.origin}${window.location.pathname}`;
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=github_login`;
    window.location.href = githubUrl;
  };

  const handleGitHubCallback = async (code) => {
    setSocialLoading("github");
    setError("");
    try {
      await githubLogin(code);
      document.getElementById("my_modal_3")?.close();
      toast.success("Welcome back!");
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || "GitHub login failed");
    } finally {
      setSocialLoading("");
    }
  };

  const isAnyLoading = isLoading || !!socialLoading;

  return (
    <div>
      <dialog id="my_modal_3" className="modal backdrop-blur-sm">
        <div className="modal-box w-110 max-w-[95vw] p-0 overflow-hidden rounded-2xl dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-2xl">
          {/* Header */}
          <div className="bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 px-8 pt-8 pb-6 text-white relative">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-white hover:bg-white/20 border-none">
                ✕
              </button>
            </form>
            <h3 className="text-2xl font-bold">Welcome Back</h3>
            <p className="text-sm opacity-90 mt-1">
              Sign in to continue your journey
            </p>
          </div>

          <div className="px-8 py-6">
            {/* Error display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={isAnyLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-300 dark:hover:border-slate-500 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {socialLoading === "google" ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <FcGoogle className="text-xl" />
                )}
                <span className="text-gray-700 dark:text-gray-200">
                  Continue with Google
                </span>
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={isAnyLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {socialLoading === "facebook" ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <FaFacebook className="text-lg text-blue-600" />
                  )}
                  <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                    Facebook
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleGitHubLogin}
                  disabled={isAnyLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {socialLoading === "github" ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <FaGithub className="text-lg text-gray-800 dark:text-white" />
                  )}
                  <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                    GitHub
                  </span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent"></div>
              <span className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                or sign in with email
              </span>
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent"></div>
            </div>

            {/* Email/Password Form */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full pl-11 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-11 pr-11 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <HiEyeOff className="text-lg" />
                    ) : (
                      <HiEye className="text-lg" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isAnyLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-5 pb-2 text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
