import React from "react";
import book2 from "../../../public/book2.jpg";
function Card({data}) {
  return (
    <>
      <div className="card bg-base-100 w-96 shadow-xl my-4 dark:bg-slate-900 dark:text-white dark:border">
        <figure>
          <img
            src={book2}
            alt="Shoes"
            className="rounded-xl hover:scale-110 transition-transform duration-300 cursor-pointer"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {data.name}
            <div className="badge badge-secondary">NEW</div>
          </h2>
          <p>{data.title}</p>
          <div className="card-actions justify-end mt-10">
            <div className="badge badge-outline mr-50">{data.price}$</div>
            <div className="badge badge-outline hover:bg-pink-500 hover:text-white px-1 py-2 cursor-pointer">Buy Now</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
