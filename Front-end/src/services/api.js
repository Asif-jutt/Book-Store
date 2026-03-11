import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
  updatePassword: (data) => api.put("/user/password", data),
  uploadProfilePicture: (formData) =>
    api.post("/user/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAccount: () => api.delete("/user/account"),
};

export const fileAPI = {
  upload: (formData) =>
    api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMyFiles: () => api.get("/files"),
  getFile: (id) => api.get(`/files/${id}`),
  deleteFile: (id) => api.delete(`/files/${id}`),
};

export const bookAPI = {
  getBooks: (params) => api.get("/books", { params }),
  getBook: (id) => api.get(`/books/${id}`),
  createBook: (data) => api.post("/books", data),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),
};

export default api;
