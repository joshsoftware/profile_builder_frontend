import toast from "react-hot-toast";
import axios from "axios";
import store from "../api/store/store";
import { NETWORK_ERROR } from "../Constants";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    error.response?.data?.error_code
      ? toast.error(error.response?.data?.error_message)
      : toast.error(NETWORK_ERROR);
    return Promise.reject(error);
  }
);

export default axiosInstance;
