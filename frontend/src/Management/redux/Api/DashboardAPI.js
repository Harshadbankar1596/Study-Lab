import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const DashboardAPI = createApi({
  reducerPath: "DashboardAPI", // ✅ good practice to give a unique reducer path
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => "/management/get-dashboard-data", // ✅ simpler syntax
    }),
  }),
});

export const { useGetDashboardDataQuery } = DashboardAPI;
