import api from "./api";

export const getAllUsers = async (params = {}) => {
  const response = await api.get("/user/admin/all", { params });
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get("/user/admin/stats");
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/user/admin/${userId}`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/user/admin/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/user/admin/${userId}`);
  return response.data;
};
