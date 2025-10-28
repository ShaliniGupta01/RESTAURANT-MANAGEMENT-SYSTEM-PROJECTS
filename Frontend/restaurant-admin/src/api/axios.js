import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE,
});

export default API;
