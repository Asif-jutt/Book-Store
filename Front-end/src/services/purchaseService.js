import api from "./api";

export const createCheckoutSession = async (bookId) => {
  const response = await api.post("/payment/create-session", { bookId });
  return response.data;
};

export const verifyPayment = async (sessionId) => {
  const response = await api.get(`/payment/verify/${sessionId}`);
  return response.data;
};

export const getPaymentHistory = async () => {
  const response = await api.get("/payment/history");
  return response.data;
};

export const enrollFreeBook = async (bookId) => {
  const response = await api.post("/purchases/enroll", { bookId });
  return response.data;
};

export const getUserPurchases = async () => {
  const response = await api.get("/purchases/my-purchases");
  return response.data;
};

export const checkPurchaseStatus = async (bookId) => {
  const response = await api.get(`/purchases/check/${bookId}`);
  return response.data;
};

export const getPurchaseDetails = async (purchaseId) => {
  const response = await api.get(`/purchases/${purchaseId}`);
  return response.data;
};

export const getAllPurchases = async () => {
  const response = await api.get("/purchases/admin/all");
  return response.data;
};
