import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const StudentAPI = createApi({
  reducerPath: "StudentAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  tagTypes: ["Students"],
  endpoints: (builder) => ({
    getAllStudents: builder.query({
      query: () => "/management/get-all-students",
      // query: () => "/management/get-all-bookings",
      providesTags: ["Students"],
    }),
    approveStudent: builder.mutation({
      query: (id) => ({
        url: `/admin/approve-user/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Students"],
    }),

    addStudent: builder.mutation({
      query: (data) => ({
        url: "/management/add-student",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Students"],
    }),
    getCharges: builder.query({
      query: () => ({
        url: "/admin/get-charges",
        method: "GET",
      }),
    }),
    // rejectStudent: builder.mutation({
    //   query: (id) => ({
    //     url: `/admin/reject-user/${id}`,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: ["Students"],
    // }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useApproveStudentMutation,
  useAddStudentMutation,
  useGetChargesQuery,
} = StudentAPI;
