import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_PROFILE_ENDPOINT,
  HTTP_METHODS,
  PROFILE_GET_ENDPOINT,
  PROFILE_LIST_ENDPOINT,
  PROFILE_REDUCER_PATH,
  PROFILE_TAG_TYPES
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const profileApi = createApi({
  reducerPath: PROFILE_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: PROFILE_TAG_TYPES,
  endpoints: (builder) => ({
    createProfile: builder.mutation({
      query: (values) => ({
        url: CREATE_PROFILE_ENDPOINT,
        method: HTTP_METHODS.POST,
        data: {
          profile: values
        }
      }),
      invalidatesTags: PROFILE_TAG_TYPES,
      providesTags: PROFILE_TAG_TYPES,
      transformResponse: (response) => response.data
    }),
    getProfileList: builder.query({
      query: () => ({
        url: PROFILE_LIST_ENDPOINT
      }),
      providesTags: PROFILE_TAG_TYPES,
      transformResponse: (response) => response.data
    }),
    getBasicInfo: builder.query({
      query: (profile_id) => ({
        url: PROFILE_GET_ENDPOINT.replace(":profile_id", profile_id)
      }),
      providesTags: PROFILE_TAG_TYPES,
      transformResponse: (response) => response.data.profile
    })
  })
});

export const {
  useGetProfileListQuery,
  useCreateProfileMutation,
  useGetBasicInfoQuery
} = profileApi;
