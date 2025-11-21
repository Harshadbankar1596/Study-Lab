import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../Utils/ProtectedRoute";

// Eager load critical components
import AdminLayout from "../AdminLayout";
import LoginPage from "../pages/LoginPage";

// Lazy load all other components
const Dashboard = lazy(() => import("../pages/Dashboard"));
const BookingDetails = lazy(() => import("../pages/BookingDetails"));
const StudentsManagement = lazy(() => import("../pages/StudentManagement"));
const StaffManagement = lazy(() => import("../pages/StaffManagement"));
const SeatManagement = lazy(() => import("../components/SeatManagement"));
const SeatManagement1 = lazy(() => import("../pages/Seatmanagment"));
const FeesManagement = lazy(() => import("../pages/FeesManagement"));
const AddmissonManagement = lazy(() => import("../pages/AddmissionManagement"));
const Notification = lazy(() => import("../pages/NotificationPage"));
const AttendanceManagement = lazy(() => import("../pages/Attendance"));
const FinancePage = lazy(() => import("../pages/FinanceManagement"));
const CouponPage = lazy(() => import("../pages/CoupenManagemet"));
const BookingInformation = lazy(() => import("../pages/BookingInformation"));
const Setting = lazy(() => import("../pages/SettingPage"));
const AboutUs = lazy(() => import("../pages/AboutUsPage"));
const TermsAndConditions = lazy(() => import("../pages/TermsAndCondition"));
const Enquiries = lazy(() => import("../pages/Enquiry"));
const ServiceManagement = lazy(() => import("../pages/ServicesManagement"));
const HouseKeeping = lazy(() => import("../pages/HouseKeeppingManagement"));

// Loading fallback component
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "18px",
    }}
  >
    Loading...
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="students"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <StudentsManagement />
            </Suspense>
          }
        />
        <Route
          path="staff"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <StaffManagement />
            </Suspense>
          }
        />
        <Route
          path="seat"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SeatManagement1 />
            </Suspense>
          }
        />
        <Route
          path="seat1"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SeatManagement />
            </Suspense>
          }
        />
        <Route
          path="fees"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <FeesManagement />
            </Suspense>
          }
        />
        <Route
          path="addmission"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AddmissonManagement />
            </Suspense>
          }
        />
        <Route
          path="notification"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Notification />
            </Suspense>
          }
        />
        <Route
          path="attendance"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AttendanceManagement />
            </Suspense>
          }
        />
        <Route
          path="finance"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <FinancePage />
            </Suspense>
          }
        />
        <Route
          path="coupen"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <CouponPage />
            </Suspense>
          }
        />
        <Route
          path="booking"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BookingInformation />
            </Suspense>
          }
        />
        <Route
          path="bookingdetails"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BookingDetails />
            </Suspense>
          }
        />
        <Route
          path="setting"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Setting />
            </Suspense>
          }
        />
        <Route
          path="about"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AboutUs />
            </Suspense>
          }
        />
        <Route
          path="term"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <TermsAndConditions />
            </Suspense>
          }
        />
        <Route
          path="enquiry"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Enquiries />
            </Suspense>
          }
        />
        <Route
          path="service"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ServiceManagement />
            </Suspense>
          }
        />
        <Route
          path="housekeeping"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <HouseKeeping />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
