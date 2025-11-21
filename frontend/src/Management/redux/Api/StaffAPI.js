import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const StaffAPI = createApi({
  reducerPath: "StaffAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),

  tagTypes: ["Staff", "Tasks"],
  endpoints: (builder) => ({
    getTask: builder.query({
      query: () => "/management/get-all-task",
      providesTags: ["Tasks"],
    }),
    getAllStaff: builder.query({
      query: () => "/management/get-staff",
      providesTags: ["Available-Seats"],
    }),
    addTask: builder.mutation({
      query: (data) => ({
        url: `/management/add-task`,
        method: "POST",
        body: data,
      }),
    }),
    changeTaskStatus: builder.mutation({
      query: (data) => ({
        url: `/management/change-task-status/${data?.status}/${data?.id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetAllStaffQuery,
  useAddTaskMutation,
  useChangeTaskStatusMutation,
  useGetTaskQuery,
} = StaffAPI;
