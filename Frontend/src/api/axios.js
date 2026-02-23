import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL:API_URL,
    withCredentials:false
})
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authtoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api