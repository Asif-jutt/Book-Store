import React from "react";
import courseimage1 from "../../../public/courseimage1.jpg";

function CourseCard({course}) {
  return (
    <>
      <div>
        <div className="card bg-base-100 w-96 shadow-sm">
          <figure className="px-10 pt-10">
            <img
              src={courseimage1}
              alt={course.name}
              className="rounded-xl"
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">{course.name}</h2>
            <p>
              {course.title}
            </p>
            <div className="card-actions">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseCard;
