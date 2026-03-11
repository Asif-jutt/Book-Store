import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getBookContent, getBook } from "../../services/bookService";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";

function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: `/book/${id}/read` } });
      return;
    }
    fetchContent();
    loadProgress();
  }, [id, user]);

  const fetchContent = async () => {
    try {
      setLoading(true);

      // Get book details first
      const bookResponse = await getBook(id);
      if (!bookResponse.success) {
        throw new Error("Book not found");
      }

      if (!bookResponse.hasAccess) {
        navigate(`/book/${id}`, {
          state: { message: "Please purchase this book to read it" },
        });
        return;
      }

      setBook(bookResponse.data);

      // Fetch full content
      const contentResponse = await getBookContent(id);
      if (contentResponse.success) {
        setContent(contentResponse.data);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        navigate(`/book/${id}`, {
          state: { message: "Please purchase this book to read it" },
        });
        return;
      }
      setError(err.response?.data?.message || "Failed to load book content");
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = () => {
    const savedProgress = localStorage.getItem(`book-progress-${id}`);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress(parsed.completedChapters || {});
      setActiveChapter(parsed.lastChapter || 0);
    }
  };

  const saveProgress = (chapterIndex, completed = false) => {
    const newProgress = { ...progress };
    if (completed) {
      newProgress[chapterIndex] = true;
    }

    setProgress(newProgress);
    localStorage.setItem(
      `book-progress-${id}`,
      JSON.stringify({
        lastChapter: chapterIndex,
        completedChapters: newProgress,
        lastAccessed: new Date().toISOString(),
      }),
    );
  };

  const handleChapterChange = (index) => {
    setActiveChapter(index);
    saveProgress(index);
  };

  const markChapterComplete = () => {
    saveProgress(activeChapter, true);

    // Move to next chapter if available
    if (content?.chapters && activeChapter < content.chapters.length - 1) {
      handleChapterChange(activeChapter + 1);
    }
  };

  const getProgressPercentage = () => {
    if (!content?.chapters?.length) return 0;
    const completed = Object.keys(progress).filter((k) => progress[k]).length;
    return Math.round((completed / content.chapters.length) * 100);
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
          <div className="text-center">
            <div className="alert alert-error max-w-md mb-4">
              <span>{error}</span>
            </div>
            <Link to="/books" className="btn btn-primary">
              Browse Books
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentChapter = content?.chapters?.[activeChapter];

  return (
    <div className="dark:bg-slate-900 dark:text-white min-h-screen">
      <Navbar />

      <div className="flex min-h-screen pt-16">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-80" : "w-0"
          } bg-base-200 dark:bg-slate-800 transition-all duration-300 overflow-hidden fixed left-0 top-16 h-[calc(100vh-4rem)] z-40`}
        >
          <div className="p-4 w-80">
            {/* Book Info */}
            <div className="mb-4">
              <h2 className="text-xl font-bold truncate">{book?.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                by {book?.author}
              </p>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <progress
                className="progress progress-primary w-full"
                value={getProgressPercentage()}
                max="100"
              ></progress>
            </div>

            {/* Chapters List */}
            <div className="divider">Chapters</div>
            <ul className="menu menu-compact">
              {content?.chapters?.map((chapter, index) => (
                <li key={index}>
                  <button
                    className={`${
                      activeChapter === index ? "active" : ""
                    } flex items-center gap-2`}
                    onClick={() => handleChapterChange(index)}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        progress[index]
                          ? "bg-success text-white"
                          : "bg-base-300"
                      }`}
                    >
                      {progress[index] ? "✓" : index + 1}
                    </span>
                    <span className="flex-1 truncate">{chapter.title}</span>
                    {chapter.duration && (
                      <span className="text-xs text-gray-500">
                        {chapter.duration}m
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-80" : "ml-0"
          }`}
        >
          {/* Toggle Sidebar Button */}
          <button
            className="fixed left-0 top-1/2 z-50 btn btn-sm btn-primary rounded-l-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>

          {/* Content Area */}
          <div className="p-8 max-w-4xl mx-auto">
            {currentChapter ? (
              <>
                {/* Chapter Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Link to={`/book/${id}`} className="hover:underline">
                      {book?.title}
                    </Link>
                    <span>/</span>
                    <span>
                      Chapter {activeChapter + 1} of{" "}
                      {content?.chapters?.length || 0}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold">{currentChapter.title}</h1>
                  {currentChapter.duration && (
                    <p className="text-gray-600 mt-2">
                      ⏱️ Estimated reading time: {currentChapter.duration}{" "}
                      minutes
                    </p>
                  )}
                </div>

                {/* Chapter Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                  />
                </div>

                {/* Chapter Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t">
                  <button
                    className="btn btn-outline"
                    disabled={activeChapter === 0}
                    onClick={() => handleChapterChange(activeChapter - 1)}
                  >
                    ← Previous Chapter
                  </button>

                  {!progress[activeChapter] && (
                    <button
                      className="btn btn-success"
                      onClick={markChapterComplete}
                    >
                      ✓ Mark as Complete
                    </button>
                  )}

                  <button
                    className="btn btn-primary"
                    disabled={
                      activeChapter >= (content?.chapters?.length || 0) - 1
                    }
                    onClick={() => handleChapterChange(activeChapter + 1)}
                  >
                    Next Chapter →
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">
                  No Content Available
                </h2>
                <p className="text-gray-600 mb-4">
                  This book doesn't have any chapters yet.
                </p>
                <Link to={`/book/${id}`} className="btn btn-primary">
                  Back to Book
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default BookReader;
