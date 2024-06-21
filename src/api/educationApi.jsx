import { createApi } from "@reduxjs/toolkit/query/react";
import { EDUCATION_ENDPOINT, PROFILE_ENDPOINT } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const educationApi = createApi({
  reducerPath: "educationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["educations"],
  endpoints: (builder) => ({

    getEducations :builder.query({
      query: (profile_id)=>({
        url: PROFILE_ENDPOINT+profile_id+EDUCATION_ENDPOINT
      }),
      providesTags: ["educations"],
      transformResponse: (response) => response.data.educations
    })

  })
});

export const { useGetEducationsQuery } = educationApi;
