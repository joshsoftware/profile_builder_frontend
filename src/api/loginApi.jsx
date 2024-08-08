import { createApi } from "@reduxjs/toolkit/query/react";
import {
  HTTP_METHODS,
  LOGIN_ENDPOINT,
  LOGIN_REDUCER_PATH,
  LOGOUT_ENDPOINT,
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";
export const loginApi = createApi({
  reducerPath: LOGIN_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: ["login", "logout"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (access_token) => ({
        url: LOGIN_ENDPOINT,
        method: HTTP_METHODS.POST,
        data: {
          access_token: access_token,
        },
      }),
      invalidatesTags: ["login"],
      transformResponse: (response) => response.data,
    }),
    logout: builder.mutation({
      query: () => ({
        url: LOGOUT_ENDPOINT,
        method: HTTP_METHODS.POST,
      }),
      invalidatesTags: ["logout"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = loginApi;
