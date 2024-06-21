import { createApi } from "@reduxjs/toolkit/query/react";
import { PROFILE_ENDPOINT, PROJECT_ENDPOINT } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["projects"],
  endpoints: (builder) => ({

    getProject :builder.query({
      query: (profile_id)=>({
        url: PROFILE_ENDPOINT+profile_id+PROJECT_ENDPOINT
      }),
      providesTags: ["projects"],
      transformResponse: (response) => response.data.projects
    })

  })
});

export const { useGetProjectQuery } = projectApi;
