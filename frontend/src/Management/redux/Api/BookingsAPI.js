import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BookingsAPI = createApi({
  reducerPath: "BookingsAPI", // ✅ good practice to give a unique reducer path
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: () => "/management/get-all-bookings", // ✅ simpler syntax
    }),
  }),
});

export const { useGetAllBookingsQuery } = BookingsAPI;
