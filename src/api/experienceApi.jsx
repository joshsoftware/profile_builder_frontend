import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_EXPERIENCE_ENDPOINTS,
  EXPERIENCE_LIST_ENDPOINT,
  EXPERIENCE_REDUCER_PATH,
  HTTP_METHODS
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const experienceApi = createApi({
  reducerPath: EXPERIENCE_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: ["experience"],
  endpoints: (builder) => ({
    createExperience: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: CREATE_EXPERIENCE_ENDPOINTS.replace(":profile_id", profile_id),
        method: HTTP_METHODS.POST,
        data: { experiences: values }
      }),
      invalidatesTags: ["experience"],
      transformResponse: (response) => response.data
    }),
    getExperiences: builder.query({
      query: (profile_id) => ({
        url: EXPERIENCE_LIST_ENDPOINT.replace(":profile_id", profile_id)
      }),
      providesTags: ["experience"],
      transformResponse: (response) => response.data.experiences
    })
  })
});

export const { useCreateExperienceMutation, useGetExperiencesQuery } =
  experienceApi;
