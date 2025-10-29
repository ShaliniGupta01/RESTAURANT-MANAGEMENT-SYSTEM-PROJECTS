import axios from "axios";

const API_BASE = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export default API;

