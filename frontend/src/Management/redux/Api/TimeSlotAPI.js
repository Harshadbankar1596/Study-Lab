import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const TimeSlotAPI = createApi({
  reducerPath: "TimeSlotAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  tagTypes: ["TimeSlots"],
  endpoints: (builder) => ({
    getTimeSlots: builder.query({
      query: () => "/management/get-timeslots",
      providesTags: ["TimeSlots"],
      transformResponse: (res) => res.allManagement,
    }),
    getTimeSlotsOfAdminCode: builder.query({
      query: () => "/management/get-timeslots",
      providesTags: ["TimeSlots"],
      // transformResponse: (res) => res.allManagement,
    }),
    addTimeSlot: builder.mutation({
      query: ({ fromTime, toTime }) => ({
        url: "/admin/add-time-slot",
        method: "POST",
        body: { fromTime, toTime },
      }),
      invalidatesTags: ["TimeSlots"],
    }),
  }),
});

export const {
  useGetTimeSlotsQuery,
  useAddTimeSlotMutation,
  useGetTimeSlotsOfAdminCodeQuery,
} = TimeSlotAPI;
