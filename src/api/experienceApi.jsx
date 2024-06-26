import { createApi } from "@reduxjs/toolkit/query/react";
import { EXPERIENCE_LIST_ENDPOINT, ReducerPath, TagTypes } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const experienceApi = createApi({
  reducerPath: ReducerPath.experience,
  baseQuery: axiosBaseQuery(),
  tagTypes: [TagTypes.experience],
  endpoints: (builder) => ({

    getExperiences: builder.query({
      query: (profile_id)=>({
        url: EXPERIENCE_LIST_ENDPOINT.replace(":profile_id", profile_id),
      }),
      providesTags: [TagTypes.experience],
      transformResponse: (response) => response.data.experiences
    })

  })
});

export const { useGetExperiencesQuery } = experienceApi;
