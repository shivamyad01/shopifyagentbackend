import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
    }
    const message =
      err?.response?.data?.message || err.message || "Request failed";
    return Promise.reject(new Error(message));
  },
);

export const authApi = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((r) => r.data),
  register: (tenantName, email, password) =>
    api
      .post("/auth/register", { tenantName, email, password })
      .then((r) => r.data),
};

export const analyticsApi = {
  aiRevenue: () => api.get("/analytics/ai-revenue").then((r) => r.data),
  orders: () => api.get("/analytics/orders").then((r) => r.data),
};

export const storesApi = {
  connect: (shop) => api.post("/stores/connect", { shop }).then((r) => r.data),
};

export const adminApi = {
  tenants: () => api.get("/admin/tenants").then((r) => r.data),
  createTenant: ({ tenantName, ownerEmail, ownerPassword }) =>
    api
      .post("/admin/tenants", { tenantName, ownerEmail, ownerPassword })
      .then((r) => r.data),
  stores: () => api.get("/admin/stores").then((r) => r.data),
};
