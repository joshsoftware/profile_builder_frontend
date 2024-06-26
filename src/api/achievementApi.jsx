import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ACHIEVEMENT_LIST_ENDPOINT,
  ACHIEVEMENT_REDUCER_PATH,
  ACHIEVEMENT_TAG_TYPES,
  CREATE_ACHIEVEMENT_ENDPOINTS,
  HTTP_METHODS
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const achievementApi = createApi({
  reducerPath: ACHIEVEMENT_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: ACHIEVEMENT_TAG_TYPES,
  endpoints: (builder) => ({
    createAchievement: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: CREATE_ACHIEVEMENT_ENDPOINTS.replace(":profile_id", profile_id),
        method: HTTP_METHODS.POST,
        data: { achievements: values }
      }),
      invalidatesTags: ACHIEVEMENT_TAG_TYPES,
      transformResponse: (response) => response.data
    }),
    getAchievements: builder.query({
      query: (profile_id) => ({
        url: ACHIEVEMENT_LIST_ENDPOINT.replace(":profile_id", profile_id)
      }),
      providesTags: ACHIEVEMENT_TAG_TYPES,
      transformResponse: (response) => response.data.achievements
    })
  })
});

export const { useCreateAchievementMutation, useGetAchievementsQuery } =
  achievementApi;
