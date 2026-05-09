import axios from "axios";

// Tất cả request đều đi qua đây
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // gửi cookie JWT tự động
});

// ── Auth ──────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};



// ── Identify ──────────────────────────────────────────────────────────
export const identifyAPI = {
  identify: (formData) =>
    api.post("/identify", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ── History ───────────────────────────────────────────────────────────
export const historyAPI = {
  getHistory: () => api.get("/history"),
};

export default api;
