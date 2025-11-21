// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/AuthSlice";
import { SeatAPI } from "./Api/SeatApi";
import { AuthAPI } from "./Api/AuthApi";
import { couponAPI } from "./Api/CouponAPI";
import { serviceAPI } from "./Api/ServiceAPI";
import { StudentAPI } from "./Api/StudentAPI";
import { EnquiryAPI } from "./Api/EnquiryAPI";
import { TimeSlotAPI } from "./Api/TimeSlotAPI";
import { DashboardAPI } from "./Api/DashboardAPI";
import { StaffAPI } from "./Api/StaffAPI";
import { BookingsAPI } from "./Api/BookingsAPI";
import { AdmissionAPI } from "./Api/AdmissionAPI";
import { PlansAPI } from "./Api/PlansAPI";
import { feesAndPaymentsAPI } from "./Api/feesAndPaymentsAPI";

export const store = configureStore({
  reducer: {
    management: authReducer,
    [SeatAPI.reducerPath]: SeatAPI.reducer,
    [AdmissionAPI.reducerPath]: AdmissionAPI.reducer,
    [AuthAPI.reducerPath]: AuthAPI.reducer,
    [couponAPI.reducerPath]: couponAPI.reducer,
    [StudentAPI.reducerPath]: StudentAPI.reducer,
    [EnquiryAPI.reducerPath]: EnquiryAPI.reducer,
    [TimeSlotAPI.reducerPath]: TimeSlotAPI.reducer,
    [feesAndPaymentsAPI.reducerPath]: feesAndPaymentsAPI.reducer,
    [DashboardAPI.reducerPath]: DashboardAPI.reducer,
    [BookingsAPI.reducerPath]: BookingsAPI.reducer,
    [PlansAPI.reducerPath]: PlansAPI.reducer,
    [StaffAPI.reducerPath]: StaffAPI.reducer,
    [serviceAPI.reducerPath]: serviceAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(SeatAPI.middleware)
      .concat(AuthAPI.middleware)
      .concat(StudentAPI.middleware)
      .concat(feesAndPaymentsAPI.middleware)
      .concat(AdmissionAPI.middleware)
      .concat(TimeSlotAPI.middleware)
      .concat(EnquiryAPI.middleware)
      .concat(BookingsAPI.middleware)
      .concat(DashboardAPI.middleware)
      .concat(StaffAPI.middleware)
      .concat(PlansAPI.middleware)
      .concat(couponAPI.middleware)
      .concat(serviceAPI.middleware),
});
