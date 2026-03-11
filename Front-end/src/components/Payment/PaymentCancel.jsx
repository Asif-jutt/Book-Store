import React from "react";
import { Link, useSearchParams } from "react-router-dom";

function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("book_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl max-w-md">
        <div className="card-body text-center">
          <div className="text-warning text-6xl mb-4">⚠</div>
          <h2 className="card-title justify-center">Payment Cancelled</h2>
          <p className="text-gray-600">
            Your payment was cancelled. No charges have been made to your
            account.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            If you encountered any issues, please try again or contact support.
          </p>

          <div className="card-actions justify-center mt-6">
            {bookId && (
              <Link to={`/book/${bookId}`} className="btn btn-primary">
                Try Again
              </Link>
            )}
            <Link to="/books" className="btn btn-outline">
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancel;
