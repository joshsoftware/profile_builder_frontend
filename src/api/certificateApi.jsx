import { createApi } from "@reduxjs/toolkit/query/react";
import { CERTIFICATE_LIST_ENDPOINT, ReducerPath, TagTypes } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const certificateApi = createApi({
  reducerPath: ReducerPath.certificate,
  baseQuery: axiosBaseQuery(),
  tagTypes: [TagTypes.certificate],
  endpoints: (builder) => ({

    getCertificates: builder.query({
      query: (profile_id)=>({
        url: CERTIFICATE_LIST_ENDPOINT.replace(":profile_id", profile_id),
      }),
      providesTags: [TagTypes.certificate],
      transformResponse: (response) => response.data.certificates
    })

  })
});

export const { useGetCertificatesQuery } = certificateApi;
