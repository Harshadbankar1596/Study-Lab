import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PlansAPI = createApi({
  reducerPath: "PlansAPI", // ✅ good practice to give a unique reducer path
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllPlans: builder.query({
      query: () => "/management/get-all-plans", // ✅ simpler syntax
    }),
  }),
});

export const { useGetAllPlansQuery } = PlansAPI;
