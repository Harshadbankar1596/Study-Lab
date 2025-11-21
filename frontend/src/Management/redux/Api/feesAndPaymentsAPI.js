import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const feesAndPaymentsAPI = createApi({
  reducerPath: "feesAndPaymentsAPI", // ✅ good practice to give a unique reducer path
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    GetCommisionTickets: builder.query({
      query: ({ managementId, month, year, paymentStatus }) => ({
        url: "/management/get-commision",
        method: "GET",
        params: { managementId, month, year, paymentStatus },
      }), // ✅ simpler syntax
    }),
    managementPayment: builder.mutation({
      query: (data) => ({
        url: "/management/management-payment",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetCommisionTicketsQuery, useManagementPaymentMutation } =
  feesAndPaymentsAPI;
