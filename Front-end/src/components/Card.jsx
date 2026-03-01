import React from "react";
import book2 from "../../public/book2.jpg";
function Card({data}) {
  return (
    <>
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src={book2}
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {data.name}
            <div className="badge badge-secondary">NEW</div>
          </h2>
          <p>{data.description}</p>
          <div className="card-actions justify-end">
            <div className="badge badge-outline">{data.category}</div>
            <div className="badge badge-outline">{data.price}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
