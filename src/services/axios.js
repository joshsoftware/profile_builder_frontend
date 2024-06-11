import axios from "axios";
import store from "../api/store/store";

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
    console.log("Token in response interceptor : ", token);
    console.log("Config : ", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("response in interceptor : ", response);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const get = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const post = async (url, payload) => {
  try {
    const response = await axiosInstance.post(url, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const put = async (url) => {
  try {
    const response = await axiosInstance.put(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const patch = async (url) => {
  try {
    const response = await axiosInstance.patch(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const remove = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default axiosInstance;
