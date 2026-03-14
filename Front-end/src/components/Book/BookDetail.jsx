import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getBook, getBookContent } from "../../services/bookService";
import {
  createCheckoutSession,
  enrollFreeBook,
  checkPurchaseStatus,
} from "../../services/purchaseService";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await getBook(id);

      if (response.success) {
        setBook(response.data);
        setHasAccess(response.hasAccess || false);
        setOrderStatus(response.orderStatus || null);

        // If user has access, fetch full content
        if (response.hasAccess) {
          const contentResponse = await getBookContent(id);
          if (contentResponse.success) {
            setContent(contentResponse.data);
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/book/${id}` } });
      return;
    }

    try {
      setPurchasing(true);

      if (book.category === "free") {
        // Enroll in free book
        const response = await enrollFreeBook(id);
        if (response.success) {
          setHasAccess(true);
          // Fetch full content
          const contentResponse = await getBookContent(id);
          if (contentResponse.success) {
            setContent(contentResponse.data);
          }
        }
      } else {
        // Create Stripe checkout session
        const response = await createCheckoutSession(id);
        if (response.success && response.url) {
          window.location.href = response.url;
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process purchase");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="dark:bg-slate-900 dark:text-white min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark:bg-slate-900 dark:text-white min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="alert alert-error max-w-md">
            <span>{error}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="dark:bg-slate-900 dark:text-white min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Book not found</h2>
            <button
              onClick={() => navigate("/books")}
              className="btn btn-primary mt-4"
            >
              Browse Books
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dark:bg-slate-900 dark:text-white min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-base-200 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          {/* Book Header */}
          <div className="card lg:card-side bg-base-100 shadow-xl mb-8">
            {book.thumbnail && (
              <figure className="lg:w-1/3">
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              </figure>
            )}
            <div className="card-body lg:w-2/3">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`badge ${
                    book.category === "free"
                      ? "badge-success"
                      : book.category === "premium"
                        ? "badge-secondary"
                        : "badge-primary"
                  }`}
                >
                  {book.category}
                </span>
                {book.level && (
                  <span className="badge badge-outline">{book.level}</span>
                )}
                {book.language && (
                  <span className="badge badge-ghost">{book.language}</span>
                )}
              </div>

              <h1 className="card-title text-3xl">{book.title}</h1>
              <p className="text-gray-600">by {book.author}</p>

              <p className="py-4">{book.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {book.totalChapters && (
                  <span>📚 {book.totalChapters} chapters</span>
                )}
                {book.totalDuration && <span>⏱ {book.totalDuration}</span>}
                {book.totalStudents > 0 && (
                  <span>👥 {book.totalStudents} students</span>
                )}
                {book.rating && (
                  <span>
                    ⭐ {book.rating.toFixed(1)} ({book.totalRatings} reviews)
                  </span>
                )}
              </div>

              {book.tags && book.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {book.tags.map((tag, index) => (
                    <span key={index} className="badge badge-outline badge-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="card-actions justify-between items-center mt-6">
                <div className="text-2xl font-bold">
                  {book.category === "free" ? (
                    <span className="text-success">Free</span>
                  ) : (
                    <span>${book.price?.toFixed(2) || "0.00"}</span>
                  )}
                </div>

                {hasAccess ? (
                  <div className="flex items-center gap-3">
                    <span className="badge badge-success badge-lg gap-2">
                      ✓ You have access
                    </span>
                    {book.pdfFile && (
                      <button
                        onClick={() => navigate(`/read/${id}`)}
                        className="btn btn-primary"
                      >
                        📖 Read Book
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="btn btn-primary"
                  >
                    {purchasing ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : book.category === "free" ? (
                      "Enroll for Free"
                    ) : (
                      "Buy Now"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Book Content */}
          {hasAccess && content?.chapters && content.chapters.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Chapter List */}
              <div className="lg:w-1/3">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">Chapters</h2>
                    <ul className="menu">
                      {content.chapters.map((chapter, index) => (
                        <li key={index}>
                          <button
                            onClick={() => setActiveChapter(index)}
                            className={activeChapter === index ? "active" : ""}
                          >
                            <span className="badge badge-sm">{index + 1}</span>
                            <span>{chapter.title}</span>
                            {chapter.duration && (
                              <span className="text-xs text-gray-500">
                                {chapter.duration}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Chapter Content */}
              <div className="lg:w-2/3">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">
                      {content.chapters[activeChapter]?.title}
                    </h2>
                    <div className="prose max-w-none">
                      {content.chapters[activeChapter]?.content || (
                        <p className="text-gray-500">
                          No content available for this chapter.
                        </p>
                      )}
                    </div>

                    {content.chapters[activeChapter]?.videoUrl && (
                      <div className="mt-4">
                        <video
                          controls
                          className="w-full rounded-lg"
                          src={content.chapters[activeChapter].videoUrl}
                        />
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() =>
                          setActiveChapter(Math.max(0, activeChapter - 1))
                        }
                        disabled={activeChapter === 0}
                        className="btn btn-outline"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() =>
                          setActiveChapter(
                            Math.min(
                              content.chapters.length - 1,
                              activeChapter + 1,
                            ),
                          )
                        }
                        disabled={activeChapter === content.chapters.length - 1}
                        className="btn btn-primary"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : !hasAccess ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <h2 className="card-title justify-center">Course Content</h2>
                <p className="text-gray-600">
                  Purchase this{" "}
                  {book.category === "free" ? "free course" : "course"} to
                  access all chapters and materials.
                </p>
                <div className="card-actions justify-center mt-4">
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="btn btn-primary"
                  >
                    {purchasing ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : book.category === "free" ? (
                      "Enroll Now"
                    ) : (
                      `Buy for $${book.price?.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card bg-base-100 dark:bg-slate-800 shadow-xl">
              <div className="card-body text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  No chapters available yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookDetail;
