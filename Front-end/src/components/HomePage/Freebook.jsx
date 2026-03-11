import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactSlick from "react-slick";
import { getBooks } from "../../services/bookService";

const Slider = ReactSlick.default || ReactSlick;

function Freebook() {
  const [freeBooks, setFreeBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreeBooks = async () => {
      try {
        const response = await getBooks();
        if (response.success) {
          const free = response.data.filter((book) => book.category === "free");
          setFreeBooks(free);
        }
      } catch (error) {
        console.error("Error fetching free books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFreeBooks();
  }, []);

  const settings = {
    dots: true,
    infinite: freeBooks.length > 3,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </section>
    );
  }

  if (freeBooks.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium rounded-full">
                🆓 Free Access
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Start Learning for Free
            </h2>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Explore our collection of free resources. Perfect for beginners or
              anyone looking to expand their skills without any commitment.
            </p>
          </div>
          <Link
            to="/books?filter=free"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30"
          >
            View All Free Books
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Books Slider */}
        <div className="free-books-slider">
          <Slider {...settings}>
            {freeBooks.map((book) => (
              <div key={book._id} className="px-3">
                <Link
                  to={`/book/${book._id}`}
                  className="block bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-200 dark:border-slate-700"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <span className="text-5xl">📖</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      FREE
                    </div>
                    {book.rating > 0 && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs font-semibold rounded-full flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        {book.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1 group-hover:text-green-500 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      by {book.author}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-2">
                      {book.description ||
                        "Start learning with this free resource today!"}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        {book.level && (
                          <span className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                            {book.level}
                          </span>
                        )}
                        {book.totalChapters > 0 && (
                          <span className="text-xs text-slate-400">
                            {book.totalChapters} chapters
                          </span>
                        )}
                      </div>
                      <span className="text-green-500 font-semibold text-sm group-hover:underline">
                        Start Free →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Custom slider styles */}
      <style jsx global>{`
        .free-books-slider .slick-dots li button:before {
          color: #10b981;
        }
        .free-books-slider .slick-dots li.slick-active button:before {
          color: #10b981;
        }
        .free-books-slider .slick-prev,
        .free-books-slider .slick-next {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          z-index: 10;
        }
        .free-books-slider .slick-prev:hover,
        .free-books-slider .slick-next:hover {
          background: #10b981;
        }
        .free-books-slider .slick-prev:before,
        .free-books-slider .slick-next:before {
          color: #10b981;
        }
        .free-books-slider .slick-prev:hover:before,
        .free-books-slider .slick-next:hover:before {
          color: white;
        }
        .dark .free-books-slider .slick-prev,
        .dark .free-books-slider .slick-next {
          background: #1e293b;
        }
      `}</style>
    </section>
  );
}

export default Freebook;
