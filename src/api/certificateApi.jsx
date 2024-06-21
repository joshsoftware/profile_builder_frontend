import { createApi } from "@reduxjs/toolkit/query/react";
import { CERTIFICATE_ENDPOINT, PROFILE_ENDPOINT } from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const certificateApi = createApi({
  reducerPath: "certificateApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["certificates"],
  endpoints: (builder) => ({

    getCertificates :builder.query({
      query: (profile_id)=>({
        url: PROFILE_ENDPOINT+profile_id+CERTIFICATE_ENDPOINT
      }),
      providesTags: ["certificates"],
      transformResponse: (response) => response.data.certificates
    })

  })
});

export const { useGetCertificatesQuery } = certificateApi;
