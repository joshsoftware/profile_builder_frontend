import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_EDUCATION_ENDPOINTS,
  DELETE_EDUCATION_ENDPOINT,
  EDUCATION_LIST_ENDPOINT,
  EDUCATION_REDUCER_PATH,
  HTTP_METHODS,
  UPDATE_EDUCATION_ENDPOINT,
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
        data: { educations: values },
      }),
      invalidatesTags: ["education"],
      transformResponse: (response) => response.data,
    }),
    getEducations: builder.query({
      query: (profile_id) => ({
        url: EDUCATION_LIST_ENDPOINT.replace(":profile_id", profile_id),
      }),
      providesTags: ["education"],
      transformResponse: (response) => {
        return response.data.educations.map((education) => ({
          ...education,
          isExisting: true,
        }));
      },
    }),
    updateEducation: builder.mutation({
      query: ({ profile_id, education_id, values }) => ({
        url: UPDATE_EDUCATION_ENDPOINT.replace(
          ":profile_id",
          profile_id
        ).replace(":education_id", education_id),
        method: HTTP_METHODS.PUT,
        data: { education: values },
      }),
      invalidatesTags: ["education"],
      transformResponse: (response) => response.data,
    }),
    deleteEducation: builder.mutation({
      query: ({ profile_id, education_id }) => ({
        url: DELETE_EDUCATION_ENDPOINT.replace(
          ":profile_id",
          profile_id
        ).replace(":education_id", education_id),
        method: HTTP_METHODS.DELETE,
      }),
      invalidatesTags: ["education"],
      transformResponse: (response) => response.data.message,
    }),
  }),
});

export const {
  useCreateEducationMutation,
  useGetEducationsQuery,
  useUpdateEducationMutation,
  useDeleteEducationMutation
} = educationApi;
