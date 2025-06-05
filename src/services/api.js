import axios from "axios";
import { store } from "../redux/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000, // Add timeout to prevent hanging requests
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    // Get the token from the Redux store
    const state = store.getState();
    const token = state.auth?.user?.token;

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized request - user may need to log in");
      // You could dispatch a logout action here if needed
    }

    // Handle validation errors (400)
    if (error.response && error.response.status === 400) {
      console.log("Validation error:", error.response.data);

      // Add more detailed error information
      if (error.response.data && error.response.data.errors) {
        error.validationErrors = error.response.data.errors;
      }
    }

    // Handle server errors (500)
    if (error.response && error.response.status >= 500) {
      console.error("Server error:", error.response.data);
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error - server may be down or unreachable");
    }

    return Promise.reject(error);
  }
);

export default api;
