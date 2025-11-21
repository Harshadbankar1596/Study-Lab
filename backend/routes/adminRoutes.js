const express = require("express");
const adminRouter = express.Router();
const {
  register,
  login,
  addTimeSlots,
  addSeats,
  addStaff,
  editStaff,
  deleteStaff,
  getAllStaff,
  getStudents,
  getAllSeats,
  approveUser,
  addUpdate,
  editUpdate,
  deleteUpdate,
  addImage,
  deleteImage,
  getAllEnquiries,
  sendOtp,
  getImage,
  getAllBookings,
  getAllUpdates,
  getTimeSlots,
  addCharges,
  editCharges,
  deleteCharge,
  getCharges,
  editSeats,
  editImage,
  deleteSeatById,
  logout,
  alocateCoupen,
  addStudent,
  getAllCoupens,
  addPLans,
  editDiscount,
  deleteDiscount,
  addDiscount,
  addPasses,
  deletePass,
  getAllPlans,
  deletePlan,
  getCommissionDetails,
  adminPaymentRequest,
  getWaitingList,
  getManagements,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/multer");

adminRouter.post("/register", register);
adminRouter.post("/send-otp", sendOtp);
adminRouter.post("/login", login);
adminRouter.post("/add-time-slot", authMiddleware, addTimeSlots);
adminRouter.post("/add-seats", authMiddleware, addSeats);
adminRouter.post("/add-staff", authMiddleware, addStaff);
adminRouter.post("/add-update", authMiddleware, addUpdate);
adminRouter.post("/accept-payment", authMiddleware, adminPaymentRequest);
adminRouter.post(
  "/add-image",
  authMiddleware,
  upload.single("imageUrl"),
  addImage
);
adminRouter.post("/add-charges", authMiddleware, addCharges);

adminRouter.patch("/edit-charge/:id", authMiddleware, editCharges);
adminRouter.patch("/approve-user/:userId", authMiddleware, approveUser);
adminRouter.patch("/edit-staff/:staffId", authMiddleware, editStaff);
adminRouter.patch("/edit-update/:updateId", authMiddleware, editUpdate);
adminRouter.patch("/edit-seat/:seatId", authMiddleware, editSeats);
adminRouter.patch(
  "/edit-image/:id",
  authMiddleware,
  upload.single("imageUrl"),
  editImage
);

adminRouter.get("/get-time-slots", authMiddleware, getTimeSlots);
adminRouter.get("/get-staff", authMiddleware, getAllStaff);
adminRouter.get("/get-students", authMiddleware, getStudents);
adminRouter.get("/get-available-seats", authMiddleware, getAllSeats);
adminRouter.get("/get-enquiries", authMiddleware, getAllEnquiries);
adminRouter.get("/get-images", authMiddleware, getImage);
adminRouter.get("/get-all-bookings", authMiddleware, getAllBookings);
adminRouter.get("/get-all-updates", authMiddleware, getAllUpdates);
adminRouter.get("/get-charges", authMiddleware, getCharges);
adminRouter.get("/get-commision", authMiddleware, getCommissionDetails);
adminRouter.get("/get-managements", authMiddleware, getManagements);

adminRouter.delete("/delete-charge/:id", authMiddleware, deleteCharge);
adminRouter.delete("/delete-update/:updateId", authMiddleware, deleteUpdate);
adminRouter.delete("/delete-staff/:staffId", authMiddleware, deleteStaff);
adminRouter.delete("/delete-image/:imageId", authMiddleware, deleteImage);
adminRouter.delete("/delete-seat/:seatId", authMiddleware, deleteSeatById);

adminRouter.post("/logout", logout);

// New Api's
adminRouter.post("/add-plans", authMiddleware, addPLans);
adminRouter.delete("/delete-plan/:planId", authMiddleware, deletePlan);
adminRouter.get("/get-plans", authMiddleware, getAllPlans);
adminRouter.post("/add-pass/:planId", authMiddleware, addPasses);
adminRouter.delete("/delete-pass/:planId/:passId", authMiddleware, deletePass);
adminRouter.post("/add-discount-toplan/:planId", authMiddleware, addDiscount);
adminRouter.patch(
  "/edit-discount/:planId/:discountId",
  authMiddleware,
  editDiscount
);
adminRouter.delete(
  "/delete-discount/:planId/:discountId",
  authMiddleware,
  deleteDiscount
);

adminRouter.get('/waiting-list', authMiddleware,  getWaitingList)

module.exports = adminRouter;
