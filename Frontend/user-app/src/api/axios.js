import axios from "axios";

const API = axios.create({
  baseURL:"https://restaurant-backend-1rky.onrender.com",
  withCredentials: true,
});

export default API;