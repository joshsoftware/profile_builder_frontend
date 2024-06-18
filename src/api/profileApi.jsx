import { createApi } from "@reduxjs/toolkit/query/react";
import { PROFILE_LIST_ENDPOINT } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["profiles"],
  endpoints: (builder) => ({
    getProfileList: builder.query({
      query: () => ({
        url: PROFILE_LIST_ENDPOINT
      }),
      providesTags: ["profiles"],
      transformResponse: (response) => response.data
    })
  })
});

export const { useGetProfileListQuery } = profileApi;
