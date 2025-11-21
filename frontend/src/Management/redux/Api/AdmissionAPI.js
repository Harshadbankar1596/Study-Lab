import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AdmissionAPI = createApi({
  reducerPath: "AdmissionAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    appproveStudent: builder.mutation({
      query: (id) => ({
        url: `/admin/approve-user/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["All-Seates"],
    }),
  }),
});

export const { useAppproveStudentMutation, useAddStudentMutation } =
  AdmissionAPI;
