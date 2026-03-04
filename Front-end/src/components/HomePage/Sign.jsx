import React from "react";
import { useForm } from "react-hook-form";

function Sign() {
  const { register, handleSubmit, watch, formState } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-base-200 dark:bg-slate-900">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl p-8 dark:bg-slate-900 dark:text-white dark:border">
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-sm opacity-70 mb-6">
          Join us and start your journey
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
              {...register("fullName", { required: true })}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
              {...register("email", { required: true })}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
              {...register("password", { required: true })}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
              {...register("confirmPassword", { required: true })}
            />
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              {...register("agreeTerms", { required: true })}
            />
            I agree to the{" "}
            <span className="link dark:text-sky-400 dark:hover:text-sky-300 ml-1">
              Terms & Conditions
            </span>
          </label>

          <button type="submit" className="btn btn-secondary w-full mt-4">
            Create Account
          </button>
        </form>

        <div className="divider">OR</div>

        <button className="btn btn-outline w-full">Continue with Google</button>

        <p className="text-center text-sm mt-4">
          Already have an account?
          <span
            onClick={() => document.getElementById("my_modal_3").showModal()}
            className="link dark:text-sky-400 ml-1 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Sign;
