import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiEye,
  HiEyeOff,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import toast from "react-hot-toast";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

function Sign() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // null | "checking" | "available" | "taken"
  const [emailProviders, setEmailProviders] = useState([]);
  const emailCheckTimeout = useRef(null);
  const { signup, googleLogin, facebookLogin, githubLogin, checkEmail } =
    useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError: setFormError,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const emailValue = watch("email");

  // ─── Handle GitHub callback code from URL ──────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (code && state === "github_signup") {
      window.history.replaceState({}, document.title, window.location.pathname);
      handleGitHubCallback(code);
    }
  }, []);

  // ─── Email existence check (debounced) ─────────────────────────
  useEffect(() => {
    if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current);

    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setEmailStatus(null);
      setEmailProviders([]);
      return;
    }

    setEmailStatus("checking");
    emailCheckTimeout.current = setTimeout(async () => {
      try {
        const result = await checkEmail(emailValue);
        if (result.exists) {
          setEmailStatus("taken");
          setEmailProviders(result.providers || []);
          setFormError("email", {
            type: "manual",
            message: result.message,
          });
        } else {
          setEmailStatus("available");
          setEmailProviders([]);
        }
      } catch {
        setEmailStatus(null);
      }
    }, 600);

    return () => clearTimeout(emailCheckTimeout.current);
  }, [emailValue]);

  // ─── Email/Password Signup ─────────────────────────────────────
  const onSubmit = async (data) => {
    if (emailStatus === "taken") {
      setError(
        "This email is already registered. Please log in or use a different email.",
      );
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await signup({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      const providers = err.response?.data?.existingProviders;
      if (providers?.length) {
        setError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Google OAuth ─────────────────────────────────────────────
  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setSocialLoading("google");
      setError("");
      try {
        await googleLogin(tokenResponse.access_token);
        toast.success("Welcome aboard!");
        navigate("/dashboard");
      } catch (err) {
        setError(err.response?.data?.message || "Google signup failed");
      } finally {
        setSocialLoading("");
      }
    },
    onError: () => setError("Google signup failed. Please try again."),
  });

  // ─── Facebook OAuth ───────────────────────────────────────────
  const handleFacebookSignup = () => {
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
          facebookLogin(response.authResponse.accessToken)
            .then(() => {
              toast.success("Welcome aboard!");
              navigate("/dashboard");
            })
            .catch((err) => {
              setError(err.response?.data?.message || "Facebook signup failed");
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
  const handleGitHubSignup = () => {
    if (!GITHUB_CLIENT_ID) {
      toast.error("GitHub login is not configured yet");
      return;
    }
    setSocialLoading("github");
    const redirectUri = `${window.location.origin}/signup`;
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=github_signup`;
    window.location.href = githubUrl;
  };

  const handleGitHubCallback = async (code) => {
    setSocialLoading("github");
    setError("");
    try {
      await githubLogin(code);
      toast.success("Welcome aboard!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "GitHub signup failed");
    } finally {
      setSocialLoading("");
    }
  };

  const isAnyLoading = isLoading || !!socialLoading;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 bg-linear-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700">
        {/* Header */}
        <div className="bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 px-8 pt-8 pb-6 text-white">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-sm opacity-90 mt-1">
            Join us and start your journey
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 px-8 py-6">
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

          {/* Social Signup Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleGoogleSignup()}
              disabled={isAnyLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-300 dark:hover:border-slate-500 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {socialLoading === "google" ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FcGoogle className="text-xl" />
              )}
              <span className="text-gray-700 dark:text-gray-200">
                Sign up with Google
              </span>
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleFacebookSignup}
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
                onClick={handleGitHubSignup}
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
              or sign up with email
            </span>
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent"></div>
          </div>

          {/* Email/Password Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full pl-11 rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
              </div>
              {errors.fullName && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            {/* Email with existence check */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input input-bordered w-full pl-11 pr-10 rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 transition-all ${
                    emailStatus === "taken"
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                      : emailStatus === "available"
                        ? "border-green-400 focus:border-green-500 focus:ring-green-500/20"
                        : "focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {/* Status indicator */}
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {emailStatus === "checking" && (
                    <span className="loading loading-spinner loading-xs text-gray-400"></span>
                  )}
                  {emailStatus === "available" && (
                    <HiCheckCircle className="text-lg text-green-500" />
                  )}
                  {emailStatus === "taken" && (
                    <HiXCircle className="text-lg text-red-500" />
                  )}
                </div>
              </div>
              {errors.email && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.email.message}
                </span>
              )}
              {emailStatus === "taken" && emailProviders.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <span>
                    Linked with: {emailProviders.join(", ")} —{" "}
                    <span
                      onClick={() =>
                        document.getElementById("my_modal_3").showModal()
                      }
                      className="font-semibold underline cursor-pointer"
                    >
                      Log in instead
                    </span>
                  </span>
                </div>
              )}
              {emailStatus === "available" && (
                <span className="text-green-500 text-xs mt-1 block">
                  Email is available
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-11 pr-11 rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
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

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                Confirm Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-11 pr-11 rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <HiEyeOff className="text-lg" />
                  ) : (
                    <HiEye className="text-lg" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isAnyLoading || emailStatus === "taken"}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-5 pb-2 text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => document.getElementById("my_modal_3").showModal()}
              className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sign;
