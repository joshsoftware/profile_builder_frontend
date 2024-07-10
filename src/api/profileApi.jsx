import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_PROFILE_ENDPOINT,
  HTTP_METHODS,
  PROFILE_GET_ENDPOINT,
  PROFILE_LIST_ENDPOINT,
  PROFILE_REDUCER_PATH
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const profileApi = createApi({
  reducerPath: PROFILE_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: ["profile"],
  endpoints: (builder) => ({
    createProfile: builder.mutation({
      query: (values) => ({
        url: CREATE_PROFILE_ENDPOINT,
        method: HTTP_METHODS.POST,
        data: {
          profile: values
        }
      }),
      invalidatesTags: ["profile"],
      transformResponse: (response) => response.data
    }),
    getProfileList: builder.query({
      query: () => ({
        url: PROFILE_LIST_ENDPOINT
      }),
      providesTags: ["profile"],
      transformResponse: (response) => response.data
    }),
    getBasicInfo: builder.query({
      query: (profile_id) => ({
        url: PROFILE_GET_ENDPOINT.replace(":profile_id", profile_id)
      }),
      providesTags: ["profile"],
      transformResponse: (response) => response.data.profile
    })
  })
});

export const {
  useGetProfileListQuery,
  useCreateProfileMutation,
  useGetBasicInfoQuery
} = profileApi;
