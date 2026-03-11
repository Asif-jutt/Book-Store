import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../services/orderService";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (filter !== "all") params.status = filter;

      const response = await getMyOrders(params);
      if (response.success) {
        setOrders(response.data || []);
        setTotalSpent(response.totalSpent || 0);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      paid: "badge-success",
      pending: "badge-warning",
      failed: "badge-error",
      refunded: "badge-info",
    };
    return statusClasses[status] || "badge-ghost";
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Total spent:{" "}
            <span className="font-semibold text-success">
              ${totalSpent.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${filter === "all" ? "tab-active" : ""}`}
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
          >
            All
          </button>
          <button
            className={`tab ${filter === "paid" ? "tab-active" : ""}`}
            onClick={() => {
              setFilter("paid");
              setCurrentPage(1);
            }}
          >
            Completed
          </button>
          <button
            className={`tab ${filter === "pending" ? "tab-active" : ""}`}
            onClick={() => {
              setFilter("pending");
              setCurrentPage(1);
            }}
          >
            Pending
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-gray-600 mb-4">
            {filter !== "all"
              ? "No orders match your filter criteria."
              : "You haven't made any purchases yet."}
          </p>
          <Link to="/books" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="table bg-base-100 shadow-xl rounded-xl">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Book</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover">
                    <td>
                      <span className="font-mono text-sm">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        {order.book?.image ? (
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img
                                src={order.book.image}
                                alt={order.book.title}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content mask mask-squircle w-12 h-12">
                              <span>📚</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="font-bold line-clamp-1">
                            {order.book?.title ||
                              order.metadata?.bookTitle ||
                              "N/A"}
                          </div>
                          <div className="text-sm opacity-50">
                            {order.book?.author || order.metadata?.bookAuthor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {order.paymentMethod === "free" ? (
                        <span className="text-success font-semibold">Free</span>
                      ) : (
                        <span className="font-semibold">
                          ${order.amount?.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${getStatusBadge(order.paymentStatus)}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className="capitalize">{order.paymentMethod}</span>
                    </td>
                    <td>
                      <span className="text-sm">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td>
                      {order.book?._id && order.paymentStatus === "paid" && (
                        <Link
                          to={`/book/${order.book._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Book
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join">
                <button
                  className="join-item btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  «
                </button>
                <button className="join-item btn">
                  Page {currentPage} of {pagination.totalPages}
                </button>
                <button
                  className="join-item btn"
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OrderHistory;
