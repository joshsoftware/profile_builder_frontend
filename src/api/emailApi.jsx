import { createApi } from "@reduxjs/toolkit/query/react";
import {
  HTTP_METHODS,
  USER_EMAIL_ENDPOINT,
  USER_EMAIL_REDUCER_PATH,
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";
export const userEmailApi = createApi({
  reducerPath: USER_EMAIL_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: ["user_email"],
  endpoints: (builder) => ({
    userEmail: builder.mutation({
      query: ({ profile_id }) => ({
        url: USER_EMAIL_ENDPOINT,
        method: HTTP_METHODS.POST,
        data: {
          profile_id,
        },
      }),
      invalidatesTags: ["profile"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useUserEmailMutation } = userEmailApi;
