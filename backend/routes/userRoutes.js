const express = require("express");
const {
  register,
  login,
  bookSeat,
  getActiveBookings,
  getAllSeats,
  unknownEnquiry,
  getUpdates,
  sendOtp,
  getTimeSlots,
  getAllAddOns,
  getCharges,
  getGallery,
  getAllCoupens,
  logout,
  redeem,
  getRedemmedCoupens,
  getAllocatedCoupens,
  editProfile,
  verifyPaymentAndBook,
  verifyPayment,
  getAllPlans,
  WaitingList,
  verifyPaymentForBooking,
  getMyAllBookings,
  punch
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");
const userRouter = express.Router();
const upload = require("../middlewares/multer");
const { createOrder } = require("../controllers/paymentController.js");
const ctrl = require("../controllers/notificationController");
// const createOrder =

userRouter.post("/register", upload.single("profileImage"), register);
userRouter.post("/verifyy", verifyPayment);
userRouter.post("/send-otp", sendOtp);
userRouter.post("/login", login);
userRouter.post(
  "/book-seats/:seatId",
  authMiddleware,
  upload.fields([
    { name: "adharF", maxCount: 1 },
    { name: "adharB", maxCount: 1 },
  ]),
  bookSeat
);
userRouter.post(
  "/verify-booking",
  authMiddleware,
  upload.fields([
    { name: "adharF", maxCount: 1 },
    { name: "adharB", maxCount: 1 },
  ]),
  verifyPaymentForBooking
);

userRouter.patch(
  "/edit-profile",
  authMiddleware,
  upload.single("profileImage"),
  editProfile
);
userRouter.post("/post-enquiry", unknownEnquiry);
userRouter.post("/redeem/:coupenId", authMiddleware, redeem);

userRouter.get("/get-all-seats", authMiddleware, getAllSeats);
userRouter.get("/get-timeslots", authMiddleware, getTimeSlots);
userRouter.get("/my-active-bookings", authMiddleware, getActiveBookings);
userRouter.get("/get-updates", authMiddleware, getUpdates);
userRouter.get("/get-all-addons", authMiddleware, getAllAddOns);
userRouter.get("/get-all-charges", getCharges);
userRouter.get("/get-gallery", authMiddleware, getGallery);
userRouter.get("/get-coupens", authMiddleware, getAllCoupens);
userRouter.get("/get-redeemed-coupens", authMiddleware, getRedemmedCoupens);
userRouter.get("/get-allocated-coupens", authMiddleware, getAllocatedCoupens);
userRouter.get("/get-my/all/bookings", authMiddleware, getMyAllBookings);

// userRouter.post('/create-order', createOrder)

userRouter.post("/logout", logout);

// New api's
userRouter.get("/get-plans", authMiddleware, getAllPlans);
userRouter.post("/add-me/in/waiting-list/:seatId", authMiddleware, WaitingList);

userRouter.post("/subscribe/token", authMiddleware, ctrl.subscribeTokenToTopic);
userRouter.post("/save/token", authMiddleware, ctrl.saveFCMToken);


userRouter.post("/punch" , punch)

module.exports = userRouter;
