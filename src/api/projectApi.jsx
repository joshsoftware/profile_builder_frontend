import { createApi } from "@reduxjs/toolkit/query/react";
import { PROJECT_LIST_ENDPOINT, ReducerPath, TagTypes } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const projectApi = createApi({
  reducerPath: ReducerPath.project,
  baseQuery: axiosBaseQuery(),
  tagTypes: [TagTypes.project],
  endpoints: (builder) => ({

    getProject: builder.query({
      query: (profile_id)=>({
        url: PROJECT_LIST_ENDPOINT.replace(":profile_id", profile_id),
      }),
      providesTags: [TagTypes.project],
      transformResponse: (response) => response.data.projects
    })

  })
});

export const { useGetProjectQuery } = projectApi;
