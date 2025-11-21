const express = require("express");
const {
  Register,
  sendOtp,
  login,
  getAllStudents,
  addCoupen,
  getAllCoupens,
  getAllEnquiries,
  editCoupen,
  deleteCoupen,
  addAddOnServices,
  getAllStaff,
  getAvailableSeats,
  deleteStudent,
  getAllBookings,
  deleteAddOnServices,
  editAddOnServices,
  addTaskToStaff,
  changeTaskStatus,
  getAllSeats,
  getDashboardData,
  getAllAddOns,
  getAllTimeSLots,
  getAllTask,
  addStudent,
  alocateCoupen,
  bookSeat,
  getCommissionDetails,
  getAllPlans,
  managementPaymentRequest,
} = require("../controllers/managementController");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const manageRouter = express.Router();

manageRouter.post("/register", Register);
manageRouter.post("/send-otp", sendOtp);
manageRouter.post("/login", login);
manageRouter.post("/add-coupen", authMiddleware, addCoupen);
manageRouter.post("/add-addOn-services", authMiddleware, addAddOnServices);
manageRouter.post("/add-task", authMiddleware, addTaskToStaff);
manageRouter.post("/alocate-coupen/:coupenId", authMiddleware, alocateCoupen);
manageRouter.post(
  "/management-payment",
  authMiddleware,
  managementPaymentRequest
);

manageRouter.post(
  "/book-seat-via-management/:seatId",
  authMiddleware,
  upload.fields([
    { name: "adharF", maxCount: 1 },
    { name: "adharB", maxCount: 1 },
  ]),
  bookSeat
);

manageRouter.patch("/edit-coupen/:id", authMiddleware, editCoupen);
manageRouter.patch("/edit-addon/:id", authMiddleware, editAddOnServices);
manageRouter.patch(
  "/change-task-status/:status/:id",
  authMiddleware,
  changeTaskStatus
);

manageRouter.get("/get-all-seats", authMiddleware, getAllSeats);
manageRouter.get("/get-all-bookings", authMiddleware, getAllBookings);
manageRouter.get("/get-all-students", authMiddleware, getAllStudents);
manageRouter.get("/get-all-enquiries", authMiddleware, getAllEnquiries);
manageRouter.get("/get-all-coupens", authMiddleware, getAllCoupens);
manageRouter.get("/get-staff", authMiddleware, getAllStaff);
manageRouter.get("/get-available-seats", authMiddleware, getAvailableSeats);
manageRouter.get("/get-dashboard-data", authMiddleware, getDashboardData);
manageRouter.get("/get-addons", authMiddleware, getAllAddOns);
manageRouter.get("/get-timeslots", authMiddleware, getAllTimeSLots);
manageRouter.get("/get-all-task", authMiddleware, getAllTask);
manageRouter.get("/get-commision", authMiddleware, getCommissionDetails);
manageRouter.get("/get-all-plans", authMiddleware, getAllPlans);

manageRouter.delete("/delete-coupen/:id", authMiddleware, deleteCoupen);
manageRouter.delete(
  "/delete-addOn-services/:id",
  authMiddleware,
  deleteAddOnServices
);

manageRouter.delete("/delete-student/:id", authMiddleware, deleteStudent);

manageRouter.post(
  "/add-student",
  authMiddleware,
  upload.single("profileImage"),
  addStudent
);

module.exports = manageRouter;
