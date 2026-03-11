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

// Get user's orders
export const getMyOrders = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${API_URL}/orders/my-orders${queryString ? `?${queryString}` : ""}`,
    { headers: getAuthHeader() },
  );
  return response.data;
};

// Get single order by ID
export const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_URL}/orders/order/${orderId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get order by order number
export const getOrderByNumber = async (orderNumber) => {
  const response = await axios.get(`${API_URL}/orders/number/${orderNumber}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Admin: Get all orders
export const getAllOrders = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${API_URL}/orders/admin/all${queryString ? `?${queryString}` : ""}`,
    { headers: getAuthHeader() },
  );
  return response.data;
};

// Admin: Get order statistics
export const getOrderStats = async () => {
  const response = await axios.get(`${API_URL}/orders/admin/stats`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Admin: Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.put(
    `${API_URL}/orders/admin/${orderId}/status`,
    { paymentStatus: status },
    { headers: getAuthHeader() },
  );
  return response.data;
};
