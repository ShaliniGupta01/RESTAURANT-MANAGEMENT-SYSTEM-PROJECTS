import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://restaurant-backend-1rky.onrender.com";

const API = axios.create({
  baseURL: API_BASE,
});

export default API;
