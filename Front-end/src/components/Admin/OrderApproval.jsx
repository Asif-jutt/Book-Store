import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token || null;
  } catch {
    return null;
  }
};

const OrderApproval = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [statusCounts, setStatusCounts] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [quickApproveId, setQuickApproveId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const fetchOrders = async (status = activeTab, page = 1) => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(
        `${API_URL}/api/orders/admin/by-approval?status=${status}&page=${page}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setOrders(response.data.data);
        setStatusCounts(response.data.statusCounts || {});
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab, 1);
  }, [activeTab]);

  const handleApprove = async (orderId) => {
    try {
      setActionLoading(true);
      const token = getToken();
      await axios.put(
        `${API_URL}/api/orders/admin/${orderId}/approve`,
        { adminNotes },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh orders
      fetchOrders();
      setSelectedOrder(null);
      setAdminNotes("");
    } catch (error) {
      console.error("Error approving order:", error);
      alert(error.response?.data?.message || "Failed to approve order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickApprove = async (orderId) => {
    try {
      setQuickApproveId(orderId);
      const token = getToken();
      await axios.put(
        `${API_URL}/api/orders/admin/${orderId}/approve`,
        { adminNotes: "Quick approved" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchOrders();
    } catch (error) {
      console.error("Error quick-approving order:", error);
      alert(error.response?.data?.message || "Failed to approve order");
    } finally {
      setQuickApproveId(null);
    }
  };

  const handleReject = async (orderId) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      setActionLoading(true);
      const token = getToken();
      await axios.put(
        `${API_URL}/api/orders/admin/${orderId}/reject`,
        { rejectionReason: rejectReason, adminNotes },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh orders
      fetchOrders();
      setSelectedOrder(null);
      setRejectReason("");
      setAdminNotes("");
    } catch (error) {
      console.error("Error rejecting order:", error);
      alert(error.response?.data?.message || "Failed to reject order");
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = [
    { id: "pending", label: "Pending", color: "badge-warning" },
    { id: "approved", label: "Approved", color: "badge-success" },
    { id: "rejected", label: "Rejected", color: "badge-error" },
    { id: "completed", label: "Completed", color: "badge-info" },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Approvals</h2>
        <button onClick={() => fetchOrders()} className="btn btn-ghost btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6 bg-base-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
          >
            {tab.label}
            <span className={`badge ${tab.color} ml-2`}>
              {statusCounts[tab.id] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg text-base-content/70">No {activeTab} orders</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Book</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover">
                  <td className="font-mono text-sm">{order.orderNumber}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded">
                          <img
                            src={order.book?.image || "/placeholder.png"}
                            alt={order.book?.title}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold truncate max-w-48">
                          {order.book?.title}
                        </div>
                        <div className="text-sm opacity-50">
                          {order.book?.author}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-medium">{order.user?.fullName}</div>
                    <div className="text-sm opacity-50">
                      {order.user?.email}
                    </div>
                  </td>
                  <td className="font-semibold">
                    {formatPrice(order.amount, order.currency)}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.paymentStatus === "paid"
                          ? "badge-success"
                          : order.paymentStatus === "pending"
                            ? "badge-warning"
                            : "badge-error"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="text-sm">{formatDate(order.createdAt)}</td>
                  <td>
                    {order.approvalStatus === "pending" ? (
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handleQuickApprove(order._id)}
                          disabled={quickApproveId === order._id}
                          className="btn btn-circle btn-sm btn-success"
                          title="Quick Approve"
                        >
                          {quickApproveId === order._id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            document
                              .getElementById("approve-modal")
                              .showModal();
                          }}
                          className="btn btn-success btn-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            document.getElementById("reject-modal").showModal();
                          }}
                          className="btn btn-error btn-sm"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          document.getElementById("details-modal").showModal();
                        }}
                        className="btn btn-ghost btn-sm"
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button
              className="join-item btn"
              disabled={pagination.currentPage <= 1}
              onClick={() => fetchOrders(activeTab, pagination.currentPage - 1)}
            >
              «
            </button>
            <button className="join-item btn">
              Page {pagination.currentPage} of {pagination.totalPages}
            </button>
            <button
              className="join-item btn"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => fetchOrders(activeTab, pagination.currentPage + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      <dialog id="approve-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Approve Order</h3>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="font-semibold">{selectedOrder.book?.title}</p>
                <p className="text-sm opacity-70">
                  Customer: {selectedOrder.user?.fullName} (
                  {selectedOrder.user?.email})
                </p>
                <p className="text-sm opacity-70">
                  Amount:{" "}
                  {formatPrice(selectedOrder.amount, selectedOrder.currency)}
                </p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Admin Notes (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Add any notes for this approval..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <div className="alert alert-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  Approving will grant the user access to read this book.
                </span>
              </div>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-2">Cancel</button>
            </form>
            <button
              onClick={() => handleApprove(selectedOrder?._id)}
              disabled={actionLoading}
              className="btn btn-success"
            >
              {actionLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Confirm Approval"
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Reject Modal */}
      <dialog id="reject-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Reject Order</h3>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="font-semibold">{selectedOrder.book?.title}</p>
                <p className="text-sm opacity-70">
                  Customer: {selectedOrder.user?.fullName} (
                  {selectedOrder.user?.email})
                </p>
                <p className="text-sm opacity-70">
                  Amount:{" "}
                  {formatPrice(selectedOrder.amount, selectedOrder.currency)}
                </p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Rejection Reason *</span>
                </label>
                <textarea
                  className="textarea textarea-bordered textarea-error"
                  placeholder="Provide a reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Admin Notes (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Internal notes..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <div className="alert alert-warning">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>The customer will be notified about this rejection.</span>
              </div>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-2">Cancel</button>
            </form>
            <button
              onClick={() => handleReject(selectedOrder?._id)}
              disabled={actionLoading || !rejectReason.trim()}
              className="btn btn-error"
            >
              {actionLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Confirm Rejection"
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Details Modal */}
      <dialog id="details-modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Order Details</h3>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm opacity-70">Order Number</label>
                  <p className="font-mono">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <label className="text-sm opacity-70">Status</label>
                  <p>
                    <span
                      className={`badge ${
                        selectedOrder.approvalStatus === "approved"
                          ? "badge-success"
                          : selectedOrder.approvalStatus === "rejected"
                            ? "badge-error"
                            : selectedOrder.approvalStatus === "completed"
                              ? "badge-info"
                              : "badge-warning"
                      }`}
                    >
                      {selectedOrder.approvalStatus}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm opacity-70">Book</label>
                  <p className="font-semibold">{selectedOrder.book?.title}</p>
                </div>
                <div>
                  <label className="text-sm opacity-70">Amount</label>
                  <p className="font-semibold">
                    {formatPrice(selectedOrder.amount, selectedOrder.currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm opacity-70">Customer</label>
                  <p>{selectedOrder.user?.fullName}</p>
                  <p className="text-sm opacity-70">
                    {selectedOrder.user?.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm opacity-70">Order Date</label>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                </div>
                {selectedOrder.approvedAt && (
                  <div>
                    <label className="text-sm opacity-70">
                      {selectedOrder.approvalStatus === "rejected"
                        ? "Rejected At"
                        : "Approved At"}
                    </label>
                    <p>{formatDate(selectedOrder.approvedAt)}</p>
                  </div>
                )}
                {selectedOrder.approvedBy && (
                  <div>
                    <label className="text-sm opacity-70">
                      {selectedOrder.approvalStatus === "rejected"
                        ? "Rejected By"
                        : "Approved By"}
                    </label>
                    <p>
                      {selectedOrder.approvedBy.fullName ||
                        selectedOrder.approvedBy.email}
                    </p>
                  </div>
                )}
              </div>

              {selectedOrder.rejectionReason && (
                <div className="bg-error/10 p-4 rounded-lg">
                  <label className="text-sm opacity-70">Rejection Reason</label>
                  <p className="text-error">{selectedOrder.rejectionReason}</p>
                </div>
              )}

              {selectedOrder.adminNotes && (
                <div className="bg-base-200 p-4 rounded-lg">
                  <label className="text-sm opacity-70">Admin Notes</label>
                  <p>{selectedOrder.adminNotes}</p>
                </div>
              )}
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default OrderApproval;
