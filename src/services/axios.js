import axios from "axios";
import store from "../api/store/store";

const client = axios.create({
  baseURL: "http://localhost:1925",
});

client.interceptors.request.use(
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

client.interceptors.response.use(
  (response) => {
    // Modify the response data here (e.g., parse, transform)

    return response;
  },
  (error) => {
    // Handle response errors here

    return Promise.reject(error);
  }
);

export const get = async (url) => {
  try {
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const post = async (url, payload) => {
  try {
    const response = await client.post(url, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const put = async (url) => {
  try {
    const response = await client.put(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const patch = async (url) => {
  try {
    const response = await client.patch(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const remove = async (url) => {
  try {
    const response = await client.delete(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
