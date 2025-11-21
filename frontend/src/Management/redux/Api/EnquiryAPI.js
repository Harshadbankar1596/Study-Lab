import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const EnquiryAPI = createApi({
  reducerPath: "EnquiryAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllEnquiries: builder.query({
      query: () => ({
        url: "/management/get-all-enquiries",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllEnquiriesQuery } = EnquiryAPI;
