import { createApi } from "@reduxjs/toolkit/query/react";
import { PROFILE_ENDPOINT, PROFILE_LIST_ENDPOINT } from "../Constants";
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
    }),

    getBasicInfo: builder.query({
      query: (id) => {
        if (id === undefined) {
          return { data: null };
        }
        return {
          url: PROFILE_ENDPOINT + id
        };
      },
      providesTags: ["profiles"],
      transformResponse: (response) => response.data
    })
    
  })
});

export const { useGetProfileListQuery, useGetBasicInfoQuery } = profileApi;
