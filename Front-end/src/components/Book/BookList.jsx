import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getBooks } from "../../services/bookService";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";

/**
 * Professional BookList Component
 * Applies Nielsen's 10 Usability Heuristics
 */
function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get search query from URL if present
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    fetchBooks();
  }, [searchParams]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getBooks();
      if (response.success) {
        setBooks(response.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  // Sort books
  const sortBooks = (booksToSort) => {
    switch (sortBy) {
      case "newest":
        return [...booksToSort].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      case "popular":
        return [...booksToSort].sort(
          (a, b) => (b.totalStudents || 0) - (a.totalStudents || 0),
        );
      case "rating":
        return [...booksToSort].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0),
        );
      case "price-low":
        return [...booksToSort].sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return [...booksToSort].sort((a, b) => (b.price || 0) - (a.price || 0));
      case "title":
        return [...booksToSort].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return booksToSort;
    }
  };

  const filteredBooks = sortBooks(
    books.filter((book) => {
      const matchesFilter = filter === "all" || book.category === filter;
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      return matchesFilter && matchesSearch;
    }),
  );

  // Stats for quick overview
  const stats = {
    total: books.length,
    free: books.filter((b) => b.category === "free").length,
    paid: books.filter((b) => b.category === "paid").length,
    premium: books.filter((b) => b.category === "premium").length,
  };

  if (loading) {
    return (
      <div className="dark:bg-slate-900 dark:text-white min-h-screen">
        <Navbar />
        <main
          id="main-content"
          className="min-h-screen flex flex-col items-center justify-center"
        >
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Loading amazing books...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="dark:bg-slate-900 dark:text-white min-h-screen">
      <Navbar />
      <main
        id="main-content"
        className="min-h-screen bg-slate-50 dark:bg-slate-900"
      >
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-secondary/10 dark:from-primary/5 dark:via-purple-500/5 dark:to-secondary/5 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Explore Our Library
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Discover {stats.total} books across programming, design, and
                technology. Start learning today!
              </p>

              {/* Search Bar - Prominent placement (Nielsen #6) */}
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search by title, author, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 text-lg bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-0 focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all"
                  aria-label="Search books"
                />
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters and Sort Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 justify-between items-center bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                {
                  key: "all",
                  label: "All Books",
                  count: stats.total,
                  color: "bg-slate-600",
                },
                {
                  key: "free",
                  label: "Free",
                  count: stats.free,
                  color: "bg-green-500",
                },
                {
                  key: "paid",
                  label: "Paid",
                  count: stats.paid,
                  color: "bg-blue-500",
                },
                {
                  key: "premium",
                  label: "Premium",
                  count: stats.premium,
                  color: "bg-purple-500",
                },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === cat.key
                      ? `${cat.color} text-white shadow-md`
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                  aria-pressed={filter === cat.key}
                >
                  {cat.label}
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      filter === cat.key
                        ? "bg-white/20"
                        : "bg-slate-200 dark:bg-slate-600"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-bordered select-sm bg-slate-100 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-primary"
                aria-label="Sort books"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Results Info - Nielsen #1: System status */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-white">
                {filteredBooks.length}
              </span>
              {filteredBooks.length === 1 ? " book" : " books"}
              {searchQuery && (
                <span>
                  {" "}
                  for "<span className="text-primary">{searchQuery}</span>"
                </span>
              )}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {error && (
            <div className="alert alert-error mb-8 rounded-xl shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-bold">Error loading books</h3>
                <p className="text-sm">{error}</p>
              </div>
              <button onClick={fetchBooks} className="btn btn-sm">
                Try Again
              </button>
            </div>
          )}

          {/* Book Grid */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
                No books found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : "Check back later for new content!"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="btn btn-primary"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <Link
                  key={book._id}
                  to={`/book/${book._id}`}
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-primary/30"
                >
                  {/* Book Thumbnail */}
                  <div className="relative overflow-hidden">
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-52 bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center">
                        <span className="text-6xl text-white/80">📖</span>
                      </div>
                    )}

                    {/* Category Badge - Overlaid */}
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                        book.category === "free"
                          ? "bg-green-500 text-white"
                          : book.category === "premium"
                            ? "bg-purple-500 text-white"
                            : "bg-blue-500 text-white"
                      }`}
                    >
                      {book.category === "free"
                        ? "🆓 Free"
                        : book.category === "premium"
                          ? "⭐ Premium"
                          : "💰 Paid"}
                    </span>

                    {/* Rating Badge */}
                    {book.rating > 0 && (
                      <span className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full shadow-lg flex items-center gap-1">
                        ⭐ {book.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Book Details */}
                  <div className="p-5">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {book.title}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      by {book.author}
                    </p>

                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                      {book.description ||
                        "Explore this amazing resource and enhance your skills."}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {book.level && (
                        <span className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                          {book.level}
                        </span>
                      )}
                      {book.tags?.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div>
                        <span className="font-bold text-xl">
                          {book.category === "free" ? (
                            <span className="text-green-500">Free</span>
                          ) : (
                            <span className="text-slate-800 dark:text-white">
                              ${book.price?.toFixed(2) || "0.00"}
                            </span>
                          )}
                        </span>
                        {book.totalStudents > 0 && (
                          <p className="text-xs text-slate-400">
                            👥 {book.totalStudents.toLocaleString()} enrolled
                          </p>
                        )}
                      </div>
                      <span className="px-4 py-2 bg-primary/10 text-primary font-medium text-sm rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                        View Book
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BookList;
