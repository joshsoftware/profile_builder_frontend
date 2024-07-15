import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_EXPERIENCE_ENDPOINTS,
  DELETE_EXPERIENCE_ENDPOINT,
  EXPERIENCE_LIST_ENDPOINT,
  EXPERIENCE_REDUCER_PATH,
  HTTP_METHODS,
  UPDATE_EXPERIENCE_ENDPOINT,
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
        data: { experiences: values },
      }),
      invalidatesTags: ["experience"],
      transformResponse: (response) => response.data,
    }),
    getExperiences: builder.query({
      query: (profile_id) => ({
        url: EXPERIENCE_LIST_ENDPOINT.replace(":profile_id", profile_id),
      }),
      providesTags: ["experience"],
      transformResponse: (response) => {
        return response.data.experiences.map((experience) => ({
          ...experience,
          isExisting: true,
        }));
      },
    }),
    updateExperience: builder.mutation({
      query: ({ profile_id, experience_id, values }) => ({
        url: UPDATE_EXPERIENCE_ENDPOINT.replace(
          ":profile_id",
          profile_id
        ).replace(":experience_id", experience_id),
        method: HTTP_METHODS.PUT,
        data: { experience: values },
      }),
      invalidatesTags: ["experience"],
      transformResponse: (response) => response.data,
    }),
    deleteExperience: builder.mutation({
      query: ({ profile_id, experience_id }) => ({
        url: DELETE_EXPERIENCE_ENDPOINT.replace(
          ":profile_id",
          profile_id
        ).replace(":experience_id", experience_id),
        method: HTTP_METHODS.DELETE,
      }),
      invalidatesTags: ["experience"],
      transformResponse: (response) => response.data.message,
    }),
  }),
});

export const {
  useCreateExperienceMutation,
  useGetExperiencesQuery,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceApi;
