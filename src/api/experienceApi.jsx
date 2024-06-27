import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_EXPERIENCE_ENDPOINTS,
  EXPERIENCE_LIST_ENDPOINT,
  EXPERIENCE_REDUCER_PATH,
  EXPERIENCE_TAG_TYPES,
  HTTP_METHODS
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const experienceApi = createApi({
  reducerPath: EXPERIENCE_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: EXPERIENCE_TAG_TYPES,
  endpoints: (builder) => ({
    createExperience: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: CREATE_EXPERIENCE_ENDPOINTS.replace(":profile_id", profile_id),
        method: HTTP_METHODS.POST,
        data: { experiences: values }
      }),
      invalidatesTags: EXPERIENCE_TAG_TYPES,
      transformResponse: (response) => response.data
    }),
    getExperiences: builder.query({
      query: (profile_id) => ({
        url: EXPERIENCE_LIST_ENDPOINT.replace(":profile_id", profile_id)
      }),
      providesTags: EXPERIENCE_TAG_TYPES,
      transformResponse: (response) => response.data.experiences
    })
  })
});

export const { useCreateExperienceMutation, useGetExperiencesQuery } =
  experienceApi;
