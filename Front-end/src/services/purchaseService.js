import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Get auth header
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// Create checkout session for paid books
export const createCheckoutSession = async (bookId) => {
  const response = await axios.post(
    `${API_URL}/payment/create-session`,
    { bookId },
    { headers: getAuthHeader() },
  );
  return response.data;
};

// Verify payment after successful checkout
export const verifyPayment = async (sessionId) => {
  const response = await axios.get(`${API_URL}/payment/verify/${sessionId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get payment history
export const getPaymentHistory = async () => {
  const response = await axios.get(`${API_URL}/payment/history`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Enroll in free book
export const enrollFreeBook = async (bookId) => {
  const response = await axios.post(
    `${API_URL}/purchases/enroll`,
    { bookId },
    { headers: getAuthHeader() },
  );
  return response.data;
};

// Get user's purchases
export const getUserPurchases = async () => {
  const response = await axios.get(`${API_URL}/purchases/my-purchases`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Check if user has purchased a book
export const checkPurchaseStatus = async (bookId) => {
  const response = await axios.get(`${API_URL}/purchases/check/${bookId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get purchase details
export const getPurchaseDetails = async (purchaseId) => {
  const response = await axios.get(`${API_URL}/purchases/${purchaseId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Admin: Get all purchases
export const getAllPurchases = async () => {
  const response = await axios.get(`${API_URL}/purchases/admin/all`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
