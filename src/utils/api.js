import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? "https://medical-backend-api-3d8q.onrender.com/auth"
    : `${import.meta.env.VITE_API_BASE_URL}/auth`,
  withCredentials: true,  // ✅ add this
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message;
    return Promise.reject(new Error(msg));
  }
);

export default api;