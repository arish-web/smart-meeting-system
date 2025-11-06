import axios from "axios";

const baseURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:10000";

const API = axios.create({
  baseURL,
  withCredentials: true,
});

export default API;
