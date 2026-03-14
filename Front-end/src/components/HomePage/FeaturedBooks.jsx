import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../../services/bookService";

function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        if (response.success) {
          // Get top rated paid and premium books
          const featured = response.data
            .filter((book) => book.category !== "free")
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 6);
          setBooks(featured);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Featured & Best Sellers
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Handpicked resources that our learners love. These top-rated books
            help you master new skills faster.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book, index) => (
            <Link
              key={book._id}
              to={`/book/${book._id}`}
              className={`group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-700 ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              {/* Featured Badge for first item */}
              {index === 0 && (
                <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-linear-to-r from-primary to-secondary text-white font-semibold rounded-full shadow-lg">
                  ⭐ Most Popular
                </div>
              )}

              {/* Thumbnail */}
              <div
                className={`relative overflow-hidden ${index === 0 ? "h-72 md:h-96" : "h-48"}`}
              >
                {book.thumbnail ? (
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary via-purple-500 to-secondary flex items-center justify-center">
                    <span className="text-6xl">📖</span>
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        book.category === "premium"
                          ? "bg-purple-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {book.category === "premium" ? "⭐ Premium" : "💰 Paid"}
                    </span>
                    {book.rating > 0 && (
                      <span className="flex items-center gap-1 text-yellow-400 text-sm">
                        ⭐ {book.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <h3
                    className={`font-bold text-white ${index === 0 ? "text-2xl md:text-3xl" : "text-lg"} line-clamp-2`}
                  >
                    {book.title}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">{book.author}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4">
                  {book.description ||
                    "Master this skill with our comprehensive guide."}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      ${book.price?.toFixed(2)}
                    </span>
                    {book.totalStudents > 0 && (
                      <p className="text-xs text-slate-500 mt-1">
                        👥 {book.totalStudents.toLocaleString()} learners
                      </p>
                    )}
                  </div>
                  <span className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
          >
            Explore All Books
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
      </div>
    </section>
  );
}

export default FeaturedBooks;
