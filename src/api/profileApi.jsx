import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../Constants";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["profile"],
  endpoints: (builder) => ({
    getProfileList: builder.query({
      query: () => ({
        url: API_ENDPOINTS.PROFILES_LIST,
      }),
      providesTags: ["profile"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetProfileListQuery } = profileApi;
