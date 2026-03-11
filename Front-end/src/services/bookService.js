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

// Get all published books
export const getBooks = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${API_URL}/books${queryString ? `?${queryString}` : ""}`,
  );
  return response.data;
};

// Get single book
export const getBook = async (id) => {
  const response = await axios.get(`${API_URL}/books/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get book content (protected - requires purchase)
export const getBookContent = async (id) => {
  const response = await axios.get(`${API_URL}/books/${id}/content`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Search books
export const searchBooks = async (query) => {
  const response = await axios.get(
    `${API_URL}/books/search?q=${encodeURIComponent(query)}`,
  );
  return response.data;
};

// Admin: Get all books (including unpublished)
export const getAdminBooks = async () => {
  const response = await axios.get(`${API_URL}/books/admin/all`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Admin: Create book
export const createBook = async (bookData) => {
  const response = await axios.post(`${API_URL}/books`, bookData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Admin: Update book
export const updateBook = async (id, bookData) => {
  const response = await axios.put(`${API_URL}/books/${id}`, bookData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Admin: Delete book
export const deleteBook = async (id) => {
  const response = await axios.delete(`${API_URL}/books/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
