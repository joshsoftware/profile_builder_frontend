import { createApi } from "@reduxjs/toolkit/query/react";
import { EDUCATION_LIST_ENDPOINT, ReducerPath, TagTypes } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const educationApi = createApi({
  reducerPath: ReducerPath.education,
  baseQuery: axiosBaseQuery(),
  tagTypes: [TagTypes.education],
  endpoints: (builder) => ({

    getEducations: builder.query({
      query: (profile_id)=>({
        url: EDUCATION_LIST_ENDPOINT.replace(":profile_id", profile_id),
      }),
      providesTags: [TagTypes.education],
      transformResponse: (response) => response.data.educations
    })

  })
});

export const { useGetEducationsQuery } = educationApi;
