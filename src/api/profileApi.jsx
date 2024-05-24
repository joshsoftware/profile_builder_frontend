import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  tagTypes: ["profile"],
  endpoints: (builder) => ({
    getProfileList: builder.query({
      query: () => ({
        url: `/list_profiles`,
      }),
      providesTags: ["profile"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetProfileListQuery } = profileApi;
