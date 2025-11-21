import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const SeatAPI = createApi({
  reducerPath: "SeatAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  tagTypes: ["All-Seats", "Available-Seats"],
  endpoints: (builder) => ({
    getAvailableSeats: builder.query({
      query: () => "/management/get-available-seats",
      providesTags: ["Available-Seats", "All-Seats"],
    }),
    getAvailableSeatsOfAdminCode: builder.query({
      query: () => "/management/get-all-seats",
      providesTags: ["Available-Seats"],
      transformResponse: (res) => {
        return { data: res.seats };
      },
    }),
    addSeats: builder.mutation({
      query: (seats) => ({
        url: "/admin/add-seats",
        method: "POST",
        body: seats,
      }),
      invalidatesTags: ["All-Seats", "Available-Seats"],
    }),
    //
    getAllSeats: builder.query({
      query: () => ({
        url: "/management/get-all-seats",
        method: "GET",
      }),
      providesTags: ["All-Seats"],
    }),
    deleteSeat: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-seat/${id}`,
        method: "DELETE",
      }),
    }),
    bookseat: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-seat/${id}`,
        method: "DELETE",
      }),
    }),
    createBooking: builder.mutation({
      query: ({ seatId, fd }) => ({
        url: `/management/book-seat-via-management/${seatId}`,
        body: fd,
        method: "POST",
      }),
      invalidatesTags: ["Available-Seats"],
    }),
  }),
});

export const {
  useGetAvailableSeatsQuery,
  useCreateBookingMutation,
  useGetAllSeatsQuery,
  useAddSeatsMutation,
  useDeleteSeatMutation,
  useGetAvailableSeatsOfAdminCodeQuery,
  useBookseatMutation,
} = SeatAPI;
