import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_FULL_PROFILE_ENDPOINT,
  CREATE_PROFILE_ENDPOINT,
  DELETE_PROFILE_ENDPOINT,
  HTTP_METHODS,
  INTRANET_EMPLOYEE_ENDPOINT,
  PROFILE_COMPLETE_ENDPOINT,
  PROFILE_GET_ENDPOINT,
  PROFILE_LIST_ENDPOINT,
  PROFILE_REDUCER_PATH,
  UPDATE_PROFILE_ENDPOINT,
  UPDATE_SEQUENCE_ENDPOINT,
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const profileApi = createApi({
  reducerPath: PROFILE_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: ["profile"],
  endpoints: (builder) => ({
    createProfile: builder.mutation({
      query: (values) => ({
        url: CREATE_PROFILE_ENDPOINT,
        method: HTTP_METHODS.POST,
        data: {
          profile: values,
        },
      }),
      invalidatesTags: ["profile"],
      providesTags: ["profile"],
      transformResponse: (response) => response.data,
    }),
    createFullProfile: builder.mutation({
      query: (values) => ({
        url: CREATE_FULL_PROFILE_ENDPOINT,
        method: HTTP_METHODS.POST,
        data: values,
      }),
      invalidatesTags: ["profile"],
      providesTags: ["profile"],
      transformResponse: (response) => response.data,
    }),
    getProfileList: builder.query({
      query: () => ({
        url: PROFILE_LIST_ENDPOINT,
      }),
      providesTags: ["profile"],
      transformResponse: (response) => response.data,
    }),
    getBasicInfo: builder.query({
      query: (profile_id) => ({
        url: PROFILE_GET_ENDPOINT.replace(":profile_id", profile_id),
      }),
      providesTags: ["profile"],
      transformResponse: (response) => response.data.profile,
    }),
    updateProfile: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: UPDATE_PROFILE_ENDPOINT.replace(":profile_id", profile_id),
        method: HTTP_METHODS.PUT,
        data: { profile: values },
      }),
      invalidatesTags: ["profile"],
      transformResponse: (response) => response.data,
    }),
    deleteProfile: builder.mutation({
      query: ({ profile_id }) => ({
        url: DELETE_PROFILE_ENDPOINT.replace(":profile_id", profile_id),
        method: HTTP_METHODS.DELETE,
      }),
      invalidatesTags: ["profile"],
      transformResponse: (response) => response.data.message,
    }),
    updateSequence: builder.mutation({
      query: (values) => ({
        url: UPDATE_SEQUENCE_ENDPOINT,
        method: HTTP_METHODS.PUT,
        data: values,
      }),
      invalidatesTags: ["profile"],
      transformResponse: (response) => response.data.message,
    }),
    updateProfileStatus: builder.mutation({
      query: ({ profile_id, profile_status }) => ({
        url: UPDATE_PROFILE_ENDPOINT.replace(":profile_id", profile_id),
        method: HTTP_METHODS.PATCH,
        data: { profile_status },
      }),
      invalidatesTags: ["profile"],
      transformResponse: (response) => response.data,
    }),
    completeProfile: builder.mutation({
      query: ({ profile_id }) => ({
        url: PROFILE_COMPLETE_ENDPOINT.replace(":profile_id", profile_id),
        method: HTTP_METHODS.PATCH,
      }),
      invalidatesTags: ["profile"],
      transformResponse: (response) => response.data,
    }),
    getIntranetEmployee: builder.query({
      query: (employeeId) => ({
        url: INTRANET_EMPLOYEE_ENDPOINT.replace(":employee_id", employeeId),
        method: HTTP_METHODS.GET,
        _suppressToastForStatuses: [409],
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetProfileListQuery,
  useCreateProfileMutation,
  useCreateFullProfileMutation,
  useGetBasicInfoQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useUpdateSequenceMutation,
  useUpdateProfileStatusMutation,
  useCompleteProfileMutation,
  useLazyGetIntranetEmployeeQuery,
} = profileApi;
