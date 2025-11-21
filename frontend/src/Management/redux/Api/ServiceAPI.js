import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const serviceAPI = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (data) => ({
        url: `/management/add-addOn-services`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),
    getService: builder.query({
      query: () => ({
        url: "/management/get-addons",
        method: "GET",
      }),
      transformResponse: (res) => res.addOns,
      providesTags: ["Service"],
    }),
    updateService: builder.mutation({
      query: (data) => ({
        url: `/management/edit-addon/${data?._id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/management/delete-addOn-services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useAddServiceMutation,
  useGetServiceQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceAPI;
