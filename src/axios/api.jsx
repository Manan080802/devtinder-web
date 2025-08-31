import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3500", // Base URL for YouTube Data API v3
  headers: {
    // Default headers for all requests
    "Content-Type": "application/json",
  },
});
export default api;
