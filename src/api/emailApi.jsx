import { createApi } from "@reduxjs/toolkit/query/react";
import {
  EMPLOYEE_INVITE_ENDPOINT,
  HTTP_METHODS,
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
        url: EMPLOYEE_INVITE_ENDPOINT.replace(":profile_id", profile_id),
        method: HTTP_METHODS.POST,
        data: {
          profile_id,
        },
      }),
      invalidatesTags: ["user_email"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useUserEmailMutation } = userEmailApi;
