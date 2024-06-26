import { createApi } from "@reduxjs/toolkit/query/react";
import { ACHIEVEMENT_LIST_ENDPOINT, ReducerPath, TagTypes } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const achievementApi = createApi({
  reducerPath: ReducerPath.achievement,
  baseQuery: axiosBaseQuery(),
  tagTypes: [TagTypes.achievement],
  endpoints: (builder) => ({

    getAchievements: builder.query({
      query: (profile_id)=>({
        url: ACHIEVEMENT_LIST_ENDPOINT.replace(":profile_id", profile_id),
      }),
      providesTags: [TagTypes.achievement],
      transformResponse: (response) => response.data.achievements
    })

  })
});

export const { useGetAchievementsQuery } = achievementApi;
