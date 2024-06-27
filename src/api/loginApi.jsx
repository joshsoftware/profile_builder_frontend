import { createApi } from "@reduxjs/toolkit/query/react";
import {
  HTTP_METHODS,
  LOGIN_ENDPOINT,
  LOGIN_REDUCER_PATH,
  LOGIN_TAG_TYPES
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";
export const loginApi = createApi({
  reducerPath: LOGIN_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: LOGIN_TAG_TYPES,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (access_token) => ({
        url: LOGIN_ENDPOINT,
        method: HTTP_METHODS.POST,
        data: {
          access_token: access_token
        }
      }),
      invalidatesTags: LOGIN_TAG_TYPES,
      transformResponse: (response) => response.data
    })
  })
});

export const { useLoginMutation } = loginApi;
