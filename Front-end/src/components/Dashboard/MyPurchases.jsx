import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserPurchases } from "../../services/purchaseService";

function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await getUserPurchases();
      if (response.success) {
        setPurchases(response.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Purchases</h1>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
          <p className="text-gray-600 mb-4">
            Start your learning journey by exploring our book collection.
          </p>
          <Link to="/books" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <div key={purchase._id} className="card bg-base-100 shadow-xl">
              {purchase.book?.thumbnail && (
                <figure>
                  <img
                    src={purchase.book.thumbnail}
                    alt={purchase.book.title}
                    className="h-48 w-full object-cover"
                  />
                </figure>
              )}
              <div className="card-body">
                <h2 className="card-title">
                  {purchase.book?.title || "Book Unavailable"}
                </h2>
                <p className="text-sm text-gray-600">
                  by {purchase.book?.author || "Unknown"}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={`badge ${
                      purchase.book?.category === "free"
                        ? "badge-success"
                        : purchase.book?.category === "premium"
                          ? "badge-secondary"
                          : "badge-primary"
                    }`}
                  >
                    {purchase.book?.category || "N/A"}
                  </span>
                  <span className="badge badge-outline">
                    {purchase.paymentMethod === "free"
                      ? "Free"
                      : `$${purchase.price}`}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Purchased on {formatDate(purchase.purchaseDate)}
                </p>

                <div className="card-actions justify-end mt-4">
                  {purchase.book?._id && (
                    <Link
                      to={`/book/${purchase.book._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Continue Learning
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPurchases;
