import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CERTIFICATE_REDUCER_PATH,
  CERTIFICATE_TAG_TYPES,
  CREATE_CERTIFICATE_ENDPOINTS,
  HTTP_METHODS
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const certificationApi = createApi({
  reducerPath: CERTIFICATE_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: CERTIFICATE_TAG_TYPES,
  endpoints: (builder) => ({
    createCertificate: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: CREATE_CERTIFICATE_ENDPOINTS.replace(":id", profile_id),
        method: HTTP_METHODS.POST,
        data: { certificates: values }
      }),
      invalidatesTags: CERTIFICATE_TAG_TYPES,
      transformResponse: (response) => response.data
    })
  })
});

export const { useCreateCertificateMutation } = certificationApi;
