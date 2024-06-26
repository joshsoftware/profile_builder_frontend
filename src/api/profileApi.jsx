import { createApi } from "@reduxjs/toolkit/query/react";
import { PROFILE_GET_ENDPOINT, PROFILE_LIST_ENDPOINT, ReducerPath, TagTypes } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const profileApi = createApi({
  reducerPath: ReducerPath.profile,
  baseQuery: axiosBaseQuery(),
  tagTypes: [TagTypes.profile],
  endpoints: (builder) => ({
    getProfileList: builder.query({
      query: () => ({
        url: PROFILE_LIST_ENDPOINT
      }),
      providesTags: [TagTypes.profile],
      transformResponse: (response) => response.data
    }),

    getBasicInfo: builder.query({
      query: (id) => {
        if (id === undefined) {
          return { data: null };
        }
        return {
          url: PROFILE_GET_ENDPOINT + id
        };
      },
      providesTags: ["profiles"],
      transformResponse: (response) => response.data
    })
    
  })
});

export const { useGetProfileListQuery, useGetBasicInfoQuery } = profileApi;
