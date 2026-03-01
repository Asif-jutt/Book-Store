import React from "react";
import list from "../list.json";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactSlick from "react-slick";
const Slider = ReactSlick.default || ReactSlick;
import Card from "./Card";
function Freebook() {
  const filterdata = list.filter((data) => data.category === "free");
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="max-w-screen-2xl container md:px-18 px-4 mx-auto mt-12">
        <div>
          <h1 className="font-semibold px-2">Free Offered Courses</h1>
          <p className="px-2">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident
            sunt illo dignissimos suscipit, quae accusamus architecto obcaecati
            eaque quam nesciunt expedita, fugiat voluptatibus accusantium.
          </p>
        </div>
        <div className="mt-6">
          <Slider {...settings}>
            {filterdata.map((data) => (
              <Card data={data} key={data.id} />
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
}

export default Freebook;
