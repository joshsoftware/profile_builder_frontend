import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ACHIEVEMENT_LIST_ENDPOINT,
  ACHIEVEMENT_REDUCER_PATH,
  CREATE_ACHIEVEMENT_ENDPOINTS,
  DELETE_ACHIEVEMENT_ENDPOINT,
  HTTP_METHODS,
  UPDATE_ACHIEVEMENT_ENDPOINT,
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const achievementApi = createApi({
  reducerPath: ACHIEVEMENT_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: ["achievement"],
  endpoints: (builder) => ({
    createAchievement: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: CREATE_ACHIEVEMENT_ENDPOINTS.replace(":profile_id", profile_id),
        method: HTTP_METHODS.POST,
        data: { achievements: values },
      }),
      invalidatesTags: ["achievement"],
      transformResponse: (response) => response.data,
    }),
    getAchievements: builder.query({
      query: (profile_id) => ({
        url: ACHIEVEMENT_LIST_ENDPOINT.replace(":profile_id", profile_id),
      }),
      providesTags: ["achievement"],
      transformResponse: (response) => {
        return response.data.achievements.map((achievement) => ({
          ...achievement,
          isExisting: true,
        }));
      },
    }),
    updateAchievement: builder.mutation({
      query: ({ profile_id, achievement_id, values }) => ({
        url: UPDATE_ACHIEVEMENT_ENDPOINT.replace(
          ":profile_id",
          profile_id
        ).replace(":achievement_id", achievement_id),
        method: HTTP_METHODS.PUT,
        data: { achievement: values },
      }),
      invalidatesTags: ["achievement"],
      transformResponse: (response) => response.data,
    }),
    deleteAchievement: builder.mutation({
      query: ({ profile_id, achievement_id }) => ({
        url: DELETE_ACHIEVEMENT_ENDPOINT.replace(
          ":profile_id",
          profile_id
        ).replace(":achievement_id", achievement_id),
        method: HTTP_METHODS.DELETE,
      }),
      invalidatesTags: ["achievement"],
      transformResponse: (response) => response.data.message,
    }),
  }),
});

export const {
  useCreateAchievementMutation,
  useGetAchievementsQuery,
  useUpdateAchievementMutation,
  useDeleteAchievementMutation,
} = achievementApi;
