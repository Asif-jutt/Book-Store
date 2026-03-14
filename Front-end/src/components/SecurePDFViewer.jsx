import React, { useState, useEffect, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker (react-pdf v10+ uses pdfjs-dist v5+ with .mjs)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const SecurePDFViewer = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [accessToken, setAccessToken] = useState(null);
  const [bookTitle, setBookTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Disable right-click
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      // Disable Ctrl+S, Ctrl+P, Ctrl+Shift+S
      if (
        (e.ctrlKey &&
          (e.key === "s" || e.key === "p" || e.key === "S" || e.key === "P")) ||
        (e.ctrlKey && e.shiftKey && e.key === "S")
      ) {
        e.preventDefault();
        return false;
      }
      // Disable F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
    };

    // Disable selection
    const handleSelectStart = (e) => {
      if (containerRef.current?.contains(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    // Disable copy
    const handleCopy = (e) => {
      if (containerRef.current?.contains(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  // Get access token and PDF URL
  useEffect(() => {
    const getAccess = async () => {
      try {
        setLoading(true);
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = storedUser?.token;

        if (!token) {
          navigate("/login", { state: { from: `/read/${bookId}` } });
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/secure-pdf/access/${bookId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.success) {
          setAccessToken(response.data.accessToken);
          setBookTitle(response.data.bookTitle);
          setPdfUrl(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/secure-pdf/stream/${response.data.accessToken}`,
          );
        }
      } catch (err) {
        console.error("Access error:", err);
        if (err.response?.status === 403) {
          setError(
            "You do not have access to this book. Please purchase it first.",
          );
        } else if (err.response?.status === 404) {
          setError("PDF not available for this book.");
        } else {
          setError("Failed to load book. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      getAccess();
    }
  }, [bookId, navigate]);

  // Invalidate token on unmount
  useEffect(() => {
    return () => {
      if (accessToken) {
        axios
          .delete(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/secure-pdf/invalidate/${accessToken}`,
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user"))?.token}`,
              },
            },
          )
          .catch(() => {});
      }
    };
  }, [accessToken]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const handlePageInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= numPages) {
      setPageNumber(value);
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyNav = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goToPreviousPage();
      } else if (
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === " "
      ) {
        goToNextPage();
      } else if (e.key === "Home") {
        setPageNumber(1);
      } else if (e.key === "End") {
        setPageNumber(numPages);
      } else if (e.key === "+" || e.key === "=") {
        zoomIn();
      } else if (e.key === "-") {
        zoomOut();
      } else if (e.key === "0") {
        resetZoom();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyNav);
    return () => window.removeEventListener("keydown", handleKeyNav);
  }, [numPages, toggleFullscreen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-300">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline btn-primary"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate(`/book/${bookId}`)}
              className="btn btn-primary"
            >
              View Book Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gray-900 flex flex-col select-none"
      style={{ userSelect: "none" }}
    >
      {/* Header Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm text-gray-300 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-white truncate max-w-xs">
            {bookTitle}
          </h1>
        </div>

        {/* Center: Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className="btn btn-ghost btn-sm text-gray-300 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2 text-gray-300">
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageNumber}
              onChange={handlePageInputChange}
              className="input input-bordered input-sm w-16 bg-gray-700 text-center text-white"
            />
            <span>/ {numPages || "?"}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="btn btn-ghost btn-sm text-gray-300 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Right: Zoom & Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="btn btn-ghost btn-sm text-gray-300 disabled:opacity-50"
            title="Zoom Out (-)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            onClick={resetZoom}
            className="btn btn-ghost btn-sm text-gray-300 min-w-16"
            title="Reset Zoom (0)"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            onClick={zoomIn}
            disabled={scale >= 3}
            className="btn btn-ghost btn-sm text-gray-300 disabled:opacity-50"
            title="Zoom In (+)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="divider divider-horizontal mx-1 h-6"></div>

          <button
            onClick={toggleFullscreen}
            className="btn btn-ghost btn-sm text-gray-300"
            title="Fullscreen (F)"
          >
            {isFullscreen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 4a1 1 0 00-2 0v3a1 1 0 001 1h3a1 1 0 100-2H5V4zm10 0a1 1 0 112 0v2h-2a1 1 0 100 2h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm-10 9a1 1 0 10-2 0v3a1 1 0 001 1h3a1 1 0 100-2H5v-2zm10 4a1 1 0 01-1-1v-2a1 1 0 112 0v2h2a1 1 0 110 2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 00-1 1v3a1 1 0 002 0V6h2a1 1 0 100-2H4a1 1 0 00-1 1zm11-1a1 1 0 100 2h2v2a1 1 0 102 0V5a1 1 0 00-1-1h-3zM4 14a1 1 0 01-1-1v-3a1 1 0 10-2 0v3a1 1 0 001 1h3a1 1 0 100-2H4zm13-1a1 1 0 102 0v3a1 1 0 01-1 1h-3a1 1 0 100-2h2v-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div
        className="flex-1 overflow-auto flex justify-center py-8 bg-gray-800"
        style={{
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          userSelect: "none",
        }}
      >
        {pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center p-20">
                <div className="loading loading-spinner loading-lg text-primary"></div>
              </div>
            }
            error={
              <div className="text-center p-20">
                <p className="text-red-400">Failed to load PDF</p>
              </div>
            }
            className="shadow-2xl"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="bg-white rounded-sm"
            />
          </Document>
        ) : (
          <div className="text-gray-400">No PDF available</div>
        )}
      </div>

      {/* Footer info */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-center text-xs text-gray-500">
        This content is protected. Downloading, copying, or sharing is
        prohibited.
      </div>
    </div>
  );
};

export default SecurePDFViewer;
