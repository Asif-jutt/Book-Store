import React from "react";
import { useForm } from "react-hook-form";

function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  const onSubmit = (data) => console.log(data);
  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-96">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="text-2xl font-semibold text-center mb-6">Login</h3>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                {...register("email", { required: true })}
              />
              {errors.email && <span className="text-red-500">Email is required</span>}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                {...register("password", { required: true })}
              />
                {errors.password && <span className="text-red-500">Password is required</span>}
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-sm" />
                Remember me
              </label>
              <a className="link link-primary">Forgot password?</a>
            </div>

            <button className="btn btn-secondary ml-3 mt-6">Login</button>
          </form>

          <p className="text-center text-sm mt-4">
            Don’t have an account?
            <a href="/signup">
              <span className="link link-primary ml-1">Sign up</span>
            </a>
          </p>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
