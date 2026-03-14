import api from "./api";

export const getMyOrders = async (params = {}) => {
  const response = await api.get("/orders/my-orders", { params });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/order/${orderId}`);
  return response.data;
};

export const getOrderByNumber = async (orderNumber) => {
  const response = await api.get(`/orders/number/${orderNumber}`);
  return response.data;
};

export const getAllOrders = async (params = {}) => {
  const response = await api.get("/orders/admin/all", { params });
  return response.data;
};

export const getOrderStats = async () => {
  const response = await api.get("/orders/admin/stats");
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/admin/${orderId}/status`, {
    paymentStatus: status,
  });
  return response.data;
};
