import React from "react";
import bannerimage from "../../../public/book1-removebg-preview.png";
function Banner() {
  return (
    <>
      <div className="max-w-screen-2xl container md:px-18 px-4 mx-auto flex flex-col mt-12 md:flex-row">
        <div className="space-y-12 md:order-1 order-2 mt-12">
          <div className="w-full md:w-1/2 space-y-12">
            <h1 className="text-3xl font-bold">
              Hello, wellcome here to learn something{" "}
              <span className="text-pink-500">new everydays!!!</span>
            </h1>
          </div>
          <div className="text-xl">
            A book store is a place where stories, knowledge, and imagination
            come together. It offers a wide collection of books ranging from
            fiction and non-fiction to academic and self-development genres.
          </div>
          <div>
            <label className="input input-bordered md:w-140 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4  opacity-70 dark:bg-slate-900 dark:text-white"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                placeholder="Email"
                className="grow bg-transparent
             border border-slate-300 dark:border-slate-700
             text-black dark:text-white
             dark:bg-slate-900
             focus:outline-none focus:ring-0
             focus:border-slate-500
             dark:focus:border-white"
              />{" "}
            </label>
            <button className="btn btn-secondary mt-6">Secondary</button>
          </div>
        </div>
        <div className="w-full md-w-1/2 order-1 md:order-2 dark:bg-slate-900 dark:text-white">
          <img src={bannerimage} alt="banner image" />
        </div>
      </div>
    </>
  );
}

export default Banner;
