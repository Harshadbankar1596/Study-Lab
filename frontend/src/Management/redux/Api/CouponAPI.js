import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const couponAPI = createApi({
  reducerPath: "couponAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  tagTypes: ["Coupons"],
  endpoints: (builder) => ({
    getCouopons: builder.query({
      query: () => "/management/get-all-coupens",
      providesTags: ["Coupons"],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/management/delete-coupen/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),
    editCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `/management/edit-coupen/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),
    addCoupon: builder.mutation({
      query: (data) => ({
        url: "/management/add-coupen",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["Coupons"],
    }),
    allocateToStudent: builder.mutation({
      query: (data) => ({
        url: `/management/alocate-coupen/${data?.couponId}`,
        body: data,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCouoponsQuery,
  useDeleteCouponMutation,
  useEditCouponMutation,
  useAddCouponMutation,
  useAllocateToStudentMutation,
} = couponAPI;
