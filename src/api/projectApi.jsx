import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_PROJECT_ENDPOINTS,
  HTTP_METHODS,
  PROJECT_LIST_ENDPOINT,
  PROJECT_REDUCER_PATH
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const projectApi = createApi({
  reducerPath: PROJECT_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: ["project"],
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: CREATE_PROJECT_ENDPOINTS.replace(":profile_id", profile_id),
        method: HTTP_METHODS.POST,
        data: { projects: values }
      }),
      invalidatesTags: ["project"],
      transformResponse: (response) => response.data
    }),
    getProject: builder.query({
      query: (profile_id) => ({
        url: PROJECT_LIST_ENDPOINT.replace(":profile_id", profile_id)
      }),
      providesTags: ["project"],
      transformResponse: (response) => response.data.projects
    })
  })
});

export const { useCreateProjectMutation, useGetProjectQuery } = projectApi;
