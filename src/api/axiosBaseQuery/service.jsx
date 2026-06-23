import axiosInstance from "../../services/axios";

const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers, body, ...rest }) => {
    try {
      const result = await axiosInstance({
        url: url,
        method,
        data,
        params,
        headers,
        body,
        ...rest,
      });
      return { data: result.data };
    } catch (axiosError) {
      return {
        error: {
          status: axiosError?.response?.status,
          data: axiosError?.response?.data,
          message: axiosError?.message,
        },
      };
    }
  };

export default axiosBaseQuery;
