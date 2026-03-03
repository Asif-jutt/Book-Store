import React from "react";
import courseimage1 from "../../../public/courseimage1.jpg";

function CourseCard({course}) {
  return (
    <>
      <div className="bg-base-100 shadow-stone-400 ">
        <div className="container card bg-base-100 w-96 shadow-sm ">
          <figure className="px-10 pt-10">
            <img
              src={courseimage1}
              alt={course.name}
              className="rounded-xl hover:scale-110 transition-transform duration-300 cursor-pointer"
            />
          </figure>
          <div className="card-body items-center text-center dark:bg-slate-900 dark:text-white dark:border">
            <h2 className="card-title">{course.name}</h2>
            <p>
              {course.title}
            </p>
            <div className="card-actions mt-5">
            <div className="badge badge-outline mr-23">{course.price}$</div>
              <button className="btn btn-primary badge badge-outline hover:bg-pink-500 hover:text-white px-1 py-2 cursor-pointer">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseCard;
