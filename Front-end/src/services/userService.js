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

// Get all users (admin)
export const getAllUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${API_URL}/user/admin/all${queryString ? `?${queryString}` : ""}`,
    { headers: getAuthHeader() },
  );
  return response.data;
};

// Get user statistics (admin)
export const getUserStats = async () => {
  const response = await axios.get(`${API_URL}/user/admin/stats`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get single user (admin)
export const getUserById = async (userId) => {
  const response = await axios.get(`${API_URL}/user/admin/${userId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Update user role (admin)
export const updateUserRole = async (userId, role) => {
  const response = await axios.put(
    `${API_URL}/user/admin/${userId}/role`,
    { role },
    { headers: getAuthHeader() },
  );
  return response.data;
};

// Delete user (admin)
export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/user/admin/${userId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
