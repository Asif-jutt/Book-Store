import api from "./api";

export const getBooks = async (params = {}) => {
  const response = await api.get("/books", { params });
  return response.data;
};

export const getBook = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const getBookContent = async (id) => {
  const response = await api.get(`/books/${id}/content`);
  return response.data;
};

export const searchBooks = async (query) => {
  const response = await api.get("/books/search", { params: { q: query } });
  return response.data;
};

export const getAdminBooks = async () => {
  const response = await api.get("/books/admin/all");
  return response.data;
};

export const createBook = async (bookData) => {
  const config =
    bookData instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  const response = await api.post("/books", bookData, config);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const config =
    bookData instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  const response = await api.put(`/books/${id}`, bookData, config);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};
