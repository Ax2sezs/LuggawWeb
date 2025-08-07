import axios from "axios";
import useLineAuth from "../hooks/useLineAuth";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },

});

// เพิ่ม interceptor ถ้าคุณใช้ JWT token เก็บใน localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("lineUser");
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("admin_user")

      window.location.href = "/"; // กลับหน้า login
    }
    return Promise.reject(error);
  }
);

export default api;
