import { createApi } from "@reduxjs/toolkit/query/react";
import { ACHIEVEMENT_ENDPOINT, PROFILE_ENDPOINT } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const achievementApi = createApi({
  reducerPath: "achievementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["achievements"],
  endpoints: (builder) => ({

    getAchievements :builder.query({
      query: (profile_id)=>({
        url: PROFILE_ENDPOINT+profile_id+ACHIEVEMENT_ENDPOINT
      }),
      providesTags: ["achievements"],
      transformResponse: (response) => response.data.achievements
    })

  })
});

export const { useGetAchievementsQuery } = achievementApi;
