import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyPayment } from "../../services/purchaseService";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState(null);
  const [purchaseData, setPurchaseData] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("error");
      setError("Invalid session. Please contact support.");
      return;
    }

    const verifySession = async () => {
      try {
        const response = await verifyPayment(sessionId);
        if (response.success) {
          setStatus("success");
          setPurchaseData(response.purchase);
        } else {
          setStatus("error");
          setError(response.message || "Payment verification failed");
        }
      } catch (err) {
        setStatus("error");
        setError(err.response?.data?.message || "Failed to verify payment");
      }
    };

    verifySession();
  }, [searchParams]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body text-center">
            <div className="text-error text-6xl mb-4">✗</div>
            <h2 className="card-title justify-center text-error">
              Payment Failed
            </h2>
            <p className="text-gray-600">{error}</p>
            <div className="card-actions justify-center mt-4">
              <Link to="/books" className="btn btn-primary">
                Browse Books
              </Link>
              <Link to="/dashboard" className="btn btn-outline">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl max-w-md">
        <div className="card-body text-center">
          <div className="text-success text-6xl mb-4">✓</div>
          <h2 className="card-title justify-center text-success">
            Payment Successful!
          </h2>
          <p className="text-gray-600">
            Thank you for your purchase. You now have full access to the
            content.
          </p>

          {purchaseData && (
            <div className="bg-base-200 p-4 rounded-lg mt-4">
              <p className="font-semibold">{purchaseData.book?.title}</p>
              <p className="text-sm text-gray-500">
                Amount: ${purchaseData.price?.toFixed(2)}{" "}
                {purchaseData.currency?.toUpperCase()}
              </p>
            </div>
          )}

          <div className="card-actions justify-center mt-6">
            {purchaseData?.book?._id && (
              <Link
                to={`/book/${purchaseData.book._id}`}
                className="btn btn-primary"
              >
                Start Learning
              </Link>
            )}
            <Link to="/dashboard/purchases" className="btn btn-outline">
              View My Purchases
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
