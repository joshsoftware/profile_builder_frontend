import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CERTIFICATE_LIST_ENDPOINT,
  CERTIFICATE_REDUCER_PATH,
  CREATE_CERTIFICATE_ENDPOINTS,
  DELETE_CERTIFICATE_ENDPOINT,
  HTTP_METHODS,
  UPDATE_CERTIFICATE_ENDPOINT,
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const certificationApi = createApi({
  reducerPath: CERTIFICATE_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: ["certificate"],
  endpoints: (builder) => ({
    createCertificate: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: CREATE_CERTIFICATE_ENDPOINTS.replace(":profile_id", profile_id),
        method: HTTP_METHODS.POST,
        data: { certificates: values },
      }),
      invalidatesTags: ["certificate"],
      transformResponse: (response) => response.data,
    }),
    getCertificates: builder.query({
      query: (profile_id) => ({
        url: CERTIFICATE_LIST_ENDPOINT.replace(":profile_id", profile_id),
      }),
      providesTags: ["certificate"],
      transformResponse: (response) => {
        return response.data.certificates.map((certificate) => ({
          ...certificate,
          isExisting: true,
        }));
      },
    }),
    updateCertificate: builder.mutation({
      query: ({ profile_id, certificate_id, values }) => ({
        url: UPDATE_CERTIFICATE_ENDPOINT.replace(
          ":profile_id",
          profile_id
        ).replace(":certificate_id", certificate_id),
        method: HTTP_METHODS.PUT,
        data: { certificate: values },
      }),
      invalidatesTags: ["certificate"],
      transformResponse: (response) => response.data,
    }),
    deleteCertificate: builder.mutation({
      query: ({ profile_id, certificate_id }) => ({
        url: DELETE_CERTIFICATE_ENDPOINT.replace(
          ":profile_id",
          profile_id
        ).replace(":certificate_id", certificate_id),
        method: HTTP_METHODS.DELETE,
      }),
      invalidatesTags: ["certificate"],
      transformResponse: (response) => response.data.message,
    }),
  }),
});

export const {
  useCreateCertificateMutation,
  useGetCertificatesQuery,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation
} = certificationApi;
