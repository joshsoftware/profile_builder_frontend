import axiosInstance from "../../services/axios";

const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers, body }) => {
    try {
      const result = await axiosInstance({
        url: url,
        method,
        data,
        params,
        headers,
        body,
      });
      return Promise.resolve(result);
    } catch (axiosError) {
      return Promise.reject(axiosError?.response?.data);
    }
  };

export default axiosBaseQuery;
