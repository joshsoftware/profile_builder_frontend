import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_EDUCATION_ENDPOINTS,
  EDUCATION_REDUCER_PATH,
  EDUCATION_TAG_TYPES,
  HTTP_METHODS
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const educationApi = createApi({
  reducerPath: EDUCATION_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: EDUCATION_TAG_TYPES,
  endpoints: (builder) => ({
    createEducation: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: CREATE_EDUCATION_ENDPOINTS.replace(":id", profile_id),
        method: HTTP_METHODS.POST,
        data: { educations: values }
      }),
      invalidatesTags: EDUCATION_TAG_TYPES,
      transformResponse: (response) => response.data
    })
  })
});

export const { useCreateEducationMutation } = educationApi;
