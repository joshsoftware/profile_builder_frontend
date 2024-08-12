import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_PROJECT_ENDPOINTS,
  DELETE_PROJECT_ENDPOINT,
  HTTP_METHODS,
  PROJECT_LIST_ENDPOINT,
  PROJECT_REDUCER_PATH,
  UPDATE_PROJECT_ENDPOINT,
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
        data: { projects: values },
      }),
      invalidatesTags: ["project"],
      transformResponse: (response) => response.data,
    }),
    getProject: builder.query({
      query: (profile_id) => ({
        url: PROJECT_LIST_ENDPOINT.replace(":profile_id", profile_id),
      }),
      providesTags: ["project"],
      transformResponse: (response) => {
        return response.data.projects.map((project) => ({
          ...project,
          isExisting: true,
        }));
      },
    }),
    updateProject: builder.mutation({
      query: ({ profile_id, project_id, values }) => ({
        url: UPDATE_PROJECT_ENDPOINT.replace(":profile_id", profile_id).replace(
          ":project_id",
          project_id,
        ),
        method: HTTP_METHODS.PUT,
        data: { project: values },
      }),
      invalidatesTags: ["project"],
      transformResponse: (response) => response.data,
    }),
    deleteProject: builder.mutation({
      query: ({ profile_id, project_id }) => ({
        url: DELETE_PROJECT_ENDPOINT.replace(":profile_id", profile_id).replace(
          ":project_id",
          project_id,
        ),
        method: HTTP_METHODS.DELETE,
      }),
      invalidatesTags: ["project"],
      transformResponse: (response) => response.data.message,
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
