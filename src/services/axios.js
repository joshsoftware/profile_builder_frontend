import toast from "react-hot-toast";
import axios from "axios";
import { logout } from "../api/store/authSlice";
import store from "../api/store/store";
import { NETWORK_ERROR, ROOT_ROUTE } from "../Constants";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      window.localStorage.clear();
      toast.error("Unauthorized Access");
      history.push(ROOT_ROUTE);
      return Promise.reject(error);
    }
    error.response?.data?.error_code
      ? toast.error(error.response?.data?.error_message)
      : toast.error(NETWORK_ERROR);
    return Promise.reject(error);
  },
);

export default axiosInstance;
