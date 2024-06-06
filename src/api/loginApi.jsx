import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HTTP_METHODS, LOGIN_ENDPOINT } from "../Constants";
export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    // eslint-disable-next-line no-undef
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  tagTypes: ["login"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (access_token) => ({
        url: LOGIN_ENDPOINT,
        method: HTTP_METHODS.POST,
        body: {
          access_token: access_token,
        },
      }),

      invalidatesTags: ["login"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useLoginMutation } = loginApi;
