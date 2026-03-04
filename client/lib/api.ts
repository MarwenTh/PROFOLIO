import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach Clerk token
api.interceptors.request.use(async (config) => {
  // We can't use useAuth() here as it's not a React component/hook.
  // We rely on the __session cookie which Clerk sets automatically
  // and is handled by withCredentials: true.
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized request, please sign in.");
    }
    return Promise.reject(error);
  },
);

export default api;
