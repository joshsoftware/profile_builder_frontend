import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_PROJECT_ENDPOINTS,
  HTTP_METHODS,
  PROJECT_REDUCER_PATH,
  PROJECT_TAG_TYPES
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const projectApi = createApi({
  reducerPath: PROJECT_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: PROJECT_TAG_TYPES,
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: CREATE_PROJECT_ENDPOINTS.replace(":profile_id", profile_id),
        method: HTTP_METHODS.POST,
        data: { projects: values }
      }),
      invalidatesTags: PROJECT_TAG_TYPES,
      transformResponse: (response) => response.data
    })
  })
});

export const { useCreateProjectMutation } = projectApi;
