import React from "react";
import CourseCard from "./CourseCard";
import paidcourse from "../../paidcourse.json";
function Content() {
  return (
    <>
      <div className="max-w-screen-2xl container md:px-18 px-4 mx-auto min-h-screen">
        <div>
          <h1 className="text-3xl font-bold text-center py-12 ">
            We're delighted to have you{" "}
            <span className="text-pink-500">here!</span>
          </h1>
          <p>
            We offer high-quality courses designed to help you learn in-demand
            skills and advance your career. Our courses are created by
            experienced instructors and focus on practical knowledge with
            real-world examples. Whether you want to start from basics or
            upgrade your existing skills, our courses provide flexible learning,
            clear guidance, and valuable content to help you achieve your goals.
          </p>
          <div className="flex justify-center items-center h-30 ">
            <a href="/">
              <button className="btn btn-active btn-secondary rounded-lg hover:bg-amber-900 hover:text-white">back</button>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-12">
            {paidcourse.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Content;
