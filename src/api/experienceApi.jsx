import { createApi } from "@reduxjs/toolkit/query/react";
import { EXPERIENCE_ENDPOINT, PROFILE_ENDPOINT } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const experienceApi = createApi({
  reducerPath: "experienceApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["experiences"],
  endpoints: (builder) => ({

    getExperiences :builder.query({
      query: (profile_id)=>({
        url: PROFILE_ENDPOINT+profile_id+EXPERIENCE_ENDPOINT
      }),
      providesTags: ["experiences"],
      transformResponse: (response) => response.data.experiences
    })

  })
});

export const { useGetExperiencesQuery } = experienceApi;
