import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_EDUCATION_ENDPOINTS,
  EDUCATION_LIST_ENDPOINT,
  EDUCATION_REDUCER_PATH,
  HTTP_METHODS
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const educationApi = createApi({
  reducerPath: EDUCATION_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: ["education"],
  endpoints: (builder) => ({
    createEducation: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: CREATE_EDUCATION_ENDPOINTS.replace(":profile_id", profile_id),
        method: HTTP_METHODS.POST,
        data: { educations: values }
      }),
      invalidatesTags: ["education"],
      transformResponse: (response) => response.data
    }),
    getEducations: builder.query({
      query: (profile_id) => ({
        url: EDUCATION_LIST_ENDPOINT.replace(":profile_id", profile_id)
      }),
      providesTags: ["education"],
      transformResponse: (response) => response.data.educations
    })
  })
});

export const { useCreateEducationMutation, useGetEducationsQuery } =
  educationApi;
