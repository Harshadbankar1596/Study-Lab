const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Booking = require("../models/bookingsModel");
const cron = require("node-cron");
const Seat = require("../models/seat");
const Time = require("../models/timeSlots");
const Enquiry = require("../models/enquiryModel");
const Update = require("../models/updatesModel");
const Otp = require("../models/otpModel");
const twilio = require("twilio");
const AddOn = require("../models/addOnServices");
const addOnServices = require("../models/addOnServices");
const Charges = require("../models/chargesModel");
const Gallery = require("../models/galleryModel");
const Coupen = require("../models/coupensModel");
const Reedem = require("../models/redeemedCoupen");
const Allocated = require("../models/allocatedCoupens");
const uploadTheImage = require("../utils/cloudinary");
const fs = require("fs");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Plan = require("../models/plansModel");
const Waiting = require("../models/waitingList");
const mongoose = require("mongoose");
const Logs = require("../models/Logs");

const BOOKING_POPULATE = ["parentsContact", "dob", "address"];

const account_sid = process.env.ACCOUNT_SID;
const auth_token = process.env.AUTH_TOKEN;
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const twilioClient = new twilio(account_sid, auth_token);

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      regiterationAmount,
      dob,
      parentsContact,
      permenantAdd,
      currentAddress,
      classStd,
      college,
    } = req.body;

    if (
      !name ||
      !email ||
      !contact ||
      !dob ||
      !parentsContact ||
      !permenantAdd ||
      !classStd ||
      !currentAddress ||
      !college
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({
      $or: [{ email }, { contact }],
    });
    if (userExists) {
      return res.status(404).json({ message: "User already exists" });
    }

    const amount = Number(regiterationAmount) * 100;
    const currency = "INR";

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    const count = await User.countDocuments();
    const index = count + 1;

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedIndex = String(index).padStart(2, "0");
    const uniqueId = `000${formattedIndex}${day}${month}${year}`;

    return res.status(200).json({
      success: true,
      message: "Order created successfully. Awaiting payment verification.",
      order,
      userData: {
        name,
        email,
        contact,
        regiterationAmount,
        dob,
        parentsContact,
        permenantAdd,
        currentAddress,
        classStd,
        college,
        uniqueId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userData,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "All Razorpay payment fields are required",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed — invalid signature",
      });
    }

    const count = await User.countDocuments();
    const index = count + 1;

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedIndex = String(index).padStart(2, "0");
    const uniqueId = `000${formattedIndex}${day}${month}${year}`;
    console.log("Generated Unique ID:", uniqueId);
    const user = new User({
      ...userData,
      // uniqueId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentStatus: "paid",
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "✅ Payment verified and user registered successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { contact } = req.body;
    if (!contact) {
      return res.status(400).json({ message: "Contact is required" });
    }
    const userExists = await User.findOne({ contact });
    if (!userExists) {
      return res.status(400).json({ message: "User Does not exists" });
    }

    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = 123456;
    const newOtp = await Otp.findOneAndUpdate(
      { contact },
      { otp },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // await twilioClient.messages.create({
    //     body: `Otp - ${otp}`,
    //     from: process.env.PHONE_NUMBER,
    //     to: contact.startsWith('+') ? contact : `+91${contact}`,
    // })

    await newOtp.save();
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { contact, otp } = req.body;

    console.log(contact);
    const userExists = await User.findOne({ contact });
    if (!userExists) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isOtpValid = await Otp.findOne({ contact, otp });
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await Otp.deleteOne({ _id: isOtpValid._id });
    // await isOtpValid?.password = undefined

    if (!userExists.isApproved) {
      return res.status(400).json({ message: "Wait for admin approval" });
    }

    const token = jwt.sign({ _id: userExists._id }, process.env.JWT, {
      expiresIn: "15d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ message: "Logged in successfully", data: userExists, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "User is not valid" });
    }

    const {
      contact,
      address,
      permenantAdd,
      currentAddress,
      classStd,
      college,
    } = req.body;

    const existingUser = await User.findById(user._id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let profileImage = existingUser.profileImage;
    if (req.file) {
      const uploadResult = await uploadTheImage(req.file.path);
      profileImage = uploadResult?.secure_url;
      fs.unlinkSync(req.file.path);
    }

    existingUser.contact = contact || existingUser.contact;
    existingUser.address = address || existingUser.address;
    existingUser.profileImage = profileImage;
    existingUser.permenantAdd = permenantAdd || existingUser.permenantAdd;
    existingUser.currentAddress = currentAddress || existingUser.currentAddress;
    existingUser.classStd = classStd || existingUser.classStd;
    existingUser.college = college || existingUser.college;

    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: existingUser,
    });
  } catch (error) {
    console.error("Edit Profile Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllSeats = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "User not valid" });
    }
    const seats = await Seat.find({});
    res.status(200).json({ message: "success", data: seats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPlans = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User not valid" });
    }
    const plans = await Plan.find({});
    res.status(200).json({ message: "Success", plans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bookSeat = async (req, res) => {
  try {
    const user = req.user;
    const { seatId } = req.params;
    const {
      seatNo,
      planId,
      amount,
      discountedAmount,
      duration,
      timings,
      addOnServiceId,
      addOnServiceQuantity,
    } = req.body;

    if (!user) return res.status(400).json({ message: "User does not exist" });
    if (!seatNo || !planId || !amount || !duration || !timings) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isPlanExists = await Plan.findById(planId);
    if (!isPlanExists) {
      return res.status(400).json({ message: "Plan does not exist" });
    }

    const existingBooking = await Booking.findOne({
      userId: user._id,
      status: { $in: ["booked", "pending"] },
    });
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "User already has an active booking" });
    }

    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(400).json({ message: "Seat does not exist" });
    if (seat.seatNumber !== seatNo)
      return res.status(400).json({ message: "Seat number is not valid" });

    ////////// Seat waiting list logic
    const recentExpired = await Booking.findOne({
      seatId,
      status: "expired",
    }).sort({ expiryDate: -1 });

    const waitingStudent = await Waiting.findOne({
      seatId,
      isExpired: false,
      // expiryDate: { $lte: new Date() }
    });

    console.log(
      "recentExpired:",
      recentExpired ? recentExpired.userId.toString() : null
    );
    console.log(
      "waitingStudent:",
      waitingStudent ? waitingStudent.studentId.toString() : null
    );
    console.log("loggedIn user:", user._id.toString());

    // ---- Decision Logic ----

    // CASE 1: No expired booking, no waiting list
    if (!recentExpired && !waitingStudent) {
      console.log("allowed: no expired booking and no waiting list");
    }

    // CASE 2: Expired booking exists, but no one in waiting list
    else if (recentExpired && !waitingStudent) {
      console.log(
        "allowed: expired booking exists but no waiting student — open to all"
      );
    }

    // CASE 3: No expired booking, but someone waiting
    else if (!recentExpired && waitingStudent) {
      if (waitingStudent.studentId.toString() !== user._id.toString()) {
        return res.status(400).json({
          message:
            "This seat is currently reserved for another student on the waiting list.",
        });
      }
      console.log("allowed: active waiting student (no expired booking)");
    }

    // CASE 4: Both expired booking and waiting list exist
    else if (recentExpired && waitingStudent) {
      const expiredOwnerId = recentExpired.userId.toString();
      if (
        expiredOwnerId === user._id.toString() ||
        waitingStudent.studentId.toString() === user._id.toString()
      ) {
        console.log("allowed: previous owner or active waiting student");
      } else {
        return res.status(400).json({
          message:
            "This seat is currently reserved for another student on the waiting list.",
        });
      }
    }
    // Seat waiting list logic

    const isValidDuration = isPlanExists.pass.some(
      (p) =>
        p.passType.name.trim().toLowerCase() === duration.trim().toLowerCase()
    );

    if (!isValidDuration) {
      return res.status(400).json({ message: "Duration is not valid" });
    }

    if (
      timings === "morning" &&
      (seat.bookedForFullDay || seat.bookedForMorning)
    )
      return res
        .status(400)
        .json({ message: "Seat already booked for morning" });
    if (
      timings === "evening" &&
      (seat.bookedForFullDay || seat.bookedForEvening)
    )
      return res
        .status(400)
        .json({ message: "Seat already booked for evening" });
    if (
      timings === "fullday" &&
      (seat.bookedForFullDay || seat.bookedForMorning || seat.bookedForEvening)
    )
      return res
        .status(400)
        .json({ message: "Seat already booked — full day not allowed" });

    let totalAmount = 0;

    const isPLanExactly = await Plan.findOne({
      _id: planId,
      timing: timings,
      "pass.passType.name": duration,
      "pass.passType.price": amount,
    });

    if (!isPLanExactly) {
      return res.status(400).json({ message: "Plan not found" });
    }

    const exactAmount = isPLanExactly.pass.find(
      (pa) => pa.passType.name === duration
    );

    if (!exactAmount) {
      return res.status(400).json({ message: "Duration not found in pass" });
    }

    totalAmount += Number(exactAmount.passType.price);

    if (addOnServiceId) {
      const addOnService = await AddOn.findById(addOnServiceId);
      if (!addOnService)
        return res
          .status(400)
          .json({ message: "Add-on service does not exist" });

      if (
        !addOnServiceQuantity ||
        Number(addOnServiceQuantity) < 1 ||
        Number(addOnServiceQuantity) > Number(addOnService.quantity)
      ) {
        return res.status(400).json({ message: "Invalid add-on quantity" });
      }

      var addOnPrice =
        Number(addOnService.price) * Number(addOnServiceQuantity);

      addOnService.quantity -= Number(addOnServiceQuantity);

      await addOnService.save();
    } else {
      var addOnPrice = 0;
    }

    // 3 months
    if (timings === "fullday") {
      // Extract numeric value from duration like "3months" -> "3"
      const durationNum = duration.replace("months", "").trim();

      // Find matching discount object
      const disObj = isPLanExactly.discounts.find(
        (dis) => dis.duration === durationNum
      );

      if (disObj) {
        // Discount applicable
        const disPercentage = disObj.discountPercent;
        const moneyToSubstract = (disPercentage / 100) * amount;
        const discountedBase = amount - moneyToSubstract;
        const finalAmount = Math.floor(discountedBase + addOnPrice);

        if (Number(discountedAmount) !== Number(finalAmount)) {
          return res.status(400).json({
            message: `Expected ${finalAmount} but got ${discountedAmount}`,
          });
        }
      } else {
        // No discount found, expect exact sum
        const expected = Number(amount) + Number(addOnPrice);
        if (Number(discountedAmount) !== expected) {
          return res.status(400).json({
            message: `Expected ${expected} but got ${discountedAmount}`,
          });
        }
      }
    } else {
      // Non-fullday timing
      const expected = Number(amount) + Number(addOnPrice);
      if (Number(discountedAmount) !== expected) {
        return res.status(400).json({
          message: `Expected ${expected} but got ${discountedAmount}`,
        });
      }
    }

    let adharF = null,
      adharB = null;
    if (req.files?.adharF?.[0]) {
      const uploadResult = await uploadTheImage(req.files.adharF[0].path);
      adharF = uploadResult?.secure_url;
      fs.unlinkSync(req.files.adharF[0].path);
    }
    if (req.files?.adharB?.[0]) {
      const uploadResult = await uploadTheImage(req.files.adharB[0].path);
      adharB = uploadResult?.secure_url;
      fs.unlinkSync(req.files.adharB[0].path);
    }

    const createdAt = new Date();
    const bookingDate = req.body.bookingDate
      ? new Date(req.body.bookingDate)
      : new Date();
    const bookingDateUTC = new Date(bookingDate.toISOString());
    let expiryDate = new Date(bookingDateUTC);
    const durationStr = duration.toLowerCase().replace(/\s+/g, "");

    switch (durationStr) {
      case "1day":
      case "2days":
      case "3days":
      case "4days":
      case "5days":
      case "6days":
        expiryDate.setUTCDate(expiryDate.getUTCDate() + parseInt(durationStr));
        break;

      case "oneweek":
        expiryDate.setUTCDate(expiryDate.getUTCDate() + 7);
        break;

      case "halfmonth":
        expiryDate.setUTCDate(expiryDate.getUTCDate() + 16);
        break;

      case "1month":
        expiryDate.setUTCMonth(expiryDate.getUTCMonth() + 1);
        break;

      case "3months":
        expiryDate.setUTCMonth(expiryDate.getUTCMonth() + 3);
        break;

      case "6months":
        expiryDate.setUTCMonth(expiryDate.getUTCMonth() + 6);
        break;

      case "12months":
        expiryDate.setUTCMonth(expiryDate.getUTCMonth() + 12);
        break;

      default:
        return res.status(400).json({ message: "Invalid duration format" });
    }

    let isPreBooked = false;
    let status = "booked";
    if (bookingDate > createdAt) {
      const diffInMs = bookingDate - createdAt;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      console.log(`Booking is ${diffInDays} days after creation.`);
      isPreBooked = true;
      status = "pending";
      if (timings === "morning") seat.bookedForMorning = null;
      if (timings === "evening") seat.bookedForEvening = null;
      if (timings === "fullday") seat.bookedForFullDay = null;
    } else {
      if (timings === "morning") seat.bookedForMorning = true;
      if (timings === "evening") seat.bookedForEvening = true;
      if (timings === "fullday") seat.bookedForFullDay = true;
    }

    // Gap bookings

    function getDurationInDays(durationStr, startDate = new Date()) {
      const normalized = durationStr.toLowerCase().replace(/\s+/g, "");

      switch (normalized) {
        case "1day":
          return 1;
        case "2days":
          return 2;
        case "3days":
          return 3;
        case "4days":
          return 4;
        case "5days":
          return 5;
        case "6days":
          return 6;
        case "oneweek":
          return 7;
        case "halfmonth":
          return 16;

        case "1month": {
          const nextMonth = new Date(startDate);
          nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
          const diffMs = nextMonth - startDate;
          return Math.round(diffMs / (1000 * 60 * 60 * 24));
        }

        case "3months": {
          const next3 = new Date(startDate);
          next3.setUTCMonth(next3.getUTCMonth() + 3);
          const diffMs = next3 - startDate;
          return Math.round(diffMs / (1000 * 60 * 60 * 24));
        }

        case "6months": {
          const next6 = new Date(startDate);
          next6.setUTCMonth(next6.getUTCMonth() + 6);
          const diffMs = next6 - startDate;
          return Math.round(diffMs / (1000 * 60 * 60 * 24));
        }

        case "12months": {
          const next12 = new Date(startDate);
          next12.setUTCMonth(next12.getUTCMonth() + 12);
          const diffMs = next12 - startDate;
          return Math.round(diffMs / (1000 * 60 * 60 * 24));
        }

        default:
          return null;
      }
    }

    const diffInMs = bookingDate - createdAt;
    const bufferDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    // --- Step 1: Compute expiry date (UTC-safe)
    // --- Step 1: Compute expiry date (UTC-safe)
    const durationDays = getDurationInDays(duration, bookingDate);
    if (durationDays === null) {
      return res.status(400).json({ message: "Invalid duration format" });
    }

    // create expiryDate as copy of bookingDate
    expiryDate = new Date(bookingDate);

    // add the duration
    expiryDate.setUTCDate(expiryDate.getUTCDate() + durationDays);

    expiryDate.setUTCHours(23, 59, 59, 999);

    // --- Step 2: Build timing filter
    let timingFilter;
    const requestedTiming = (timings || "").toLowerCase().trim();
    if (requestedTiming === "fullday") {
      timingFilter = {}; // conflicts with all
    } else {
      timingFilter = {
        $or: [{ timings: requestedTiming }, { timings: "fullday" }],
      };
    }

    // --- Step 3: Refined overlap logic (gap + UTC-safe, ignores time zone) ---

    // --- Step 3: Overlap / Gap Check (UTC-safe, timing-aware)

    // Helper: strip time and force midnight UTC
    const normalizeUTC = (date) => {
      const d = new Date(date);
      return new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      );
    };

    // Normalize new booking window
    const newStart = normalizeUTC(bookingDate);
    const newEnd = new Date(newStart);
    newEnd.setUTCDate(
      newEnd.getUTCDate() + getDurationInDays(duration, newStart)
    );

    // Find all active bookings for same seat and timing conflict type
    const activeBookings = await Booking.find({
      seatId,
      status: { $in: ["booked", "pending"] },
      $or: [
        { timings: requestedTiming }, // same timing
        { timings: "fullday" }, // or full-day bookings
        ...(requestedTiming === "fullday"
          ? [{ timings: { $in: ["morning", "evening"] } }]
          : []), // full-day conflicts with all
      ],
    });

    let conflict = null;

    for (const existing of activeBookings) {
      const existingStart = normalizeUTC(existing.bookingDate);
      const existingEnd = normalizeUTC(existing.expiryDate);
      const existingTiming = (existing.timings || "").toLowerCase();

      // Timing conflict logic
      const timingConflict =
        requestedTiming === "fullday" ||
        existingTiming === "fullday" ||
        requestedTiming === existingTiming;

      if (!timingConflict) continue;

      // ✅ Overlap check (true overlap only if ranges intersect)
      const overlaps = existingStart < newEnd && existingEnd > newStart;

      if (overlaps) {
        conflict = existing;
        break;
      }
    }

    // --- Step 4: Handle result
    if (conflict) {
      return res.status(400).json({
        message: `Requested slot overlaps with existing booking (${conflict.timings
          }) from ${conflict.bookingDate.toLocaleDateString()} to ${conflict.expiryDate.toLocaleDateString()}. Try another timing or check available gap.`,
      });
    }

    console.log(
      `✅ Booking valid for seat ${seatId} from ${newStart.toISOString()} to ${newEnd.toISOString()}.`
    );

    // --- Step 4: Handle conflict or proceed
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `Requested slot overlaps with existing booking (${conflict.timings
          }) from ${conflict.bookingDate.toISOString()} to ${conflict.expiryDate.toISOString()}. Try another timing or check available gap.`,
      });
    }

    console.log(
      `✅ Booking valid from ${bookingDate.toISOString()} to ${expiryDate.toISOString()}.`
    );

    const orderOptions = {
      amount: Math.round(discountedAmount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: user._id.toString(),
        seatId,
        planId,
        timings,
        duration,
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // const booking = new Booking({
    //   userId: user._id,
    //   planId,
    //   seatNo,
    //   seatId,
    //   timings,
    //   addOnServiceId: addOnServiceId || null,
    //   addOnServiceQuantity: addOnServiceQuantity || null,
    //   amount,
    //   discountedAmount,
    //   duration,
    //   expiryDate,
    //   status,
    //   isPreBooked,
    //   adharF,
    //   adharB,
    //   bookingDate,
    //   paymentStatus: "paid",
    // });

    // await seat.save();
    // await booking.save();

    res.status(200).json({
      success: true,
      message: "Order Created Sucessfully!",
      // booking,
      order: razorpayOrder,
    });
  } catch (error) {
    console.error("❌ Seat booking error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPaymentForBooking = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      planId,
      seatId,
      seatNo,
      timings,
      duration,
      amount,
      discountedAmount,
      bookingDate,
      expiryDate,
      addOnServiceId,
      addOnServiceQuantity,
      isPreBooked,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Missing payment details or booking data" });
    }

    // ✅ Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const seat = await Seat.findById(seatId);
    if (!seat)
      return res.status(400).json({ message: "Seat no longer exists" });

    // ✅ Handle file uploads (Cloudinary)
    let adharFUrl = null,
      adharBUrl = null;
    if (req.files?.adharF?.[0]) {
      const uploadResult = await uploadTheImage(req.files.adharF[0].path);
      adharFUrl = uploadResult?.secure_url;
      fs.unlinkSync(req.files.adharF[0].path);
    }
    if (req.files?.adharB?.[0]) {
      const uploadResult = await uploadTheImage(req.files.adharB[0].path);
      adharBUrl = uploadResult?.secure_url;
      fs.unlinkSync(req.files.adharB[0].path);
    }

    // ✅ Update seat status if not a pre-booking
    if (!JSON.parse(isPreBooked)) {
      if (timings === "morning") seat.bookedForMorning = true;
      if (timings === "evening") seat.bookedForEvening = true;
      if (timings === "fullday") seat.bookedForFullDay = true;
    }

    // ✅ Create booking document
    const booking = new Booking({
      userId,
      planId,
      seatNo,
      seatId,
      timings,
      addOnServiceId: addOnServiceId || null,
      addOnServiceQuantity: addOnServiceQuantity || 0,
      amount,
      discountedAmount,
      duration,
      expiryDate,
      status: "booked",
      isPreBooked: JSON.parse(isPreBooked),
      adharF: adharFUrl,
      adharB: adharBUrl,
      bookingDate,
      paymentStatus: "paid",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    // ✅ Save booking and seat
    await seat.save();
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and booking stored successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const WaitingList = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User not valid" });
    }

    const { seatId } = req.params;
    if (!seatId) {
      return res.status(400).json({ message: "Seat id is required" });
    }

    const isSeatExists = await Seat.findById(seatId);
    if (!isSeatExists) {
      return res.status(404).json({ message: "Seat does not exist" });
    }

    const booking = await Booking.findOne({ seatId });
    if (!booking) {
      return res
        .status(400)
        .json({ message: "No Booking found, or maybe seat is vacant" });
    }

    if (booking.status === "expired") {
      return res
        .status(200)
        .json({ message: "The seat is already expired, you can book!" });
    }

    const alreadyInWaitingList = await Waiting.findOne({ studentId: user._id });
    if (alreadyInWaitingList) {
      return res.status(400).json({ message: `Already in the waiting list` });
    }

    const isListFull = await Waiting.findOne({ seatId });
    if (isListFull) {
      return res.status(400).json({
        message:
          "Waiting list of this is seat is full, you can book another seat.",
      });
    }

    const bookingExp = new Date(booking.expiryDate);

    const waitingExp = new Date(bookingExp);
    waitingExp.setDate(bookingExp.getDate() + 1);

    const waiting = new Waiting({
      studentId: user._id,
      seatId,
      expiredDate: waitingExp,
      bookingId: booking._id,
    });

    await waiting.save();

    res.status(201).json({
      message: "Added to waiting list successfully",
      waiting,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActiveBookings = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "Invalid User" });
    }
    const bookings = await Booking.find({
      status: "booked",
      userId: user._id,
    }).populate("seatId", "floor");
    res.status(200).json({ message: "success", ActiveBookings: bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUpdates = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "Invalid User" });
    }
    const updates = await Update.find({});
    res.status(200).json({ message: "success", data: updates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAddOns = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User is not valid" });
    }
    const addons = await AddOn.find({});
    if (!addons) {
      return res.status(400).json({ message: "No addons found" });
    }
    return res.status(200).json({ message: "Addons", AddOns: addons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTimeSlots = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "User is not valid" });
    }
    const timeslots = await Time.find({});
    res.status(200).json({ message: "Success", timeslots: timeslots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCharges = async (req, res) => {
  try {
    const charges = await Charges.find({});
    res.status(200).json({ message: "Success", charges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unknownEnquiry = async (req, res) => {
  try {
    const { name, email, contact, query } = req.body;
    if (!name || !email || !contact || !query) {
      return res.status(400).json({ message: "All the fields are required" });
    }
    const enquiry = new Enquiry({ name, email, contact, query });
    await enquiry.save();
    res.status(200).json({ message: "Enquiry saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find({});
    res.status(200).json({ gallery: gallery, message: "Success" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getAllCoupens = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User not valid" });
    }
    const coupens = await Coupen.find({});
    res.status(200).json({ message: "success", coupens: coupens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const redeem = async (req, res) => {
  try {
    const user = req.user;
    const { coupenId } = req.params;

    if (!user) return res.status(401).json({ message: "User is Invalid" });
    if (!coupenId)
      return res.status(400).json({ message: "Coupen id is required" });

    const coupenExists = await Coupen.findById(coupenId);
    if (!coupenExists) {
      return res.status(400).json({ message: "Coupen does not exists" });
    }

    const isCoupenAllocated = await Allocated.findOne({
      coupenId,
      students: user._id,
      status: "allocated",
    });

    // if (isCoupenAllocated.status === "expired" || isCoupenAllocated.status === "pending") {
    //     return res.status(400).json({ message: "Coupen maybe expired or not alloted to you" });
    // }

    if (!isCoupenAllocated) {
      return res.status(404).json({ message: "Coupon not allocated to you" });
    }

    const alreadyRedeemed = await Reedem.findOne({
      studentId: user._id,
      coupenId,
      status: "active",
    });

    if (alreadyRedeemed) {
      return res.status(400).json({ message: "Coupen Already Redeemed" });
    }

    if (isCoupenAllocated) {
      isCoupenAllocated.status = "redeemed";
      await isCoupenAllocated.save();
    }

    const redeemed = new Reedem({
      studentId: user._id,
      coupenId,
      status: "active",
    });
    await redeemed.save();

    // await Allocated.updateOne(
    //     { _id: isCoupenExists._id },
    //     { $pull: { students: user._id } }
    // );

    res.status(200).json({ message: "Redeem Successful", redeem: redeemed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRedemmedCoupens = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User is not valid" });
    }
    const redeemed = await Reedem.find({ studentId: user._id });
    res.status(200).json({ message: "Success", redeemed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllocatedCoupens = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User is not valid" });
    }
    const allocatedCoupens = await Allocated.find({
      students: { $in: [user._id] },
    }).populate("coupenId", "discount code description");
    res.status(200).json({
      message: `Allocated Coupens to ${user.name} `,
      AllocatedCoupens: allocatedCoupens,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyAllBookings = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User Invalid" });
    }
    const getPastBookings = await Booking.find({ userId: user._id });
    res.status(200).json({ message: "Success", data: getPastBookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

cron.schedule("*/10 * * * *", async () => {
  console.log("🕒 Cron running...");

  try {
    const nowUTC = new Date();
    const nowIST = new Date(
      nowUTC.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    console.log("Now (UTC):", nowUTC.toISOString());
    console.log("Now (IST):", nowIST.toISOString());

    const preBookings = await Booking.find({
      isPreBooked: true,
      status: "pending",
      bookingDate: { $lte: nowUTC },
    });

    console.log(`🔹 Found ${preBookings.length} pre-bookings to activate`);

    for (const [i, booking] of preBookings.entries()) {
      console.log(`Activating pre-booking ${i + 1}: ${booking._id}`);

      const seat = await Seat.findById(booking.seatId);
      if (!seat) continue;

      const timing = booking.timings?.toLowerCase().trim();

      if (timing === "morning") seat.bookedForMorning = true;
      if (timing === "evening") seat.bookedForEvening = true;
      if (timing === "fullday") seat.bookedForFullDay = true;

      await seat.save();

      booking.isPreBooked = false;
      booking.status = "booked";
      await booking.save();

      booking.isPreBooked = false;
      booking.status = "booked";
      await booking.save();

      console.log(`Activated booking for seat ${seat.seatNumber} (${timing})`);
    }

    // const nowUTC = new Date();
    console.log("Current UTC time:", nowUTC.toISOString());

    const expiredBookings = await Booking.find({
      expiryDate: { $lte: nowUTC },
      status: "booked",
      isPreBooked: false,
    });

    if (expiredBookings.length === 0) {
      console.log("No expired bookings found at", nowUTC.toISOString());
      // return;
    }

    console.log(`Found ${expiredBookings.length} expired bookings`);

    for (const booking of expiredBookings) {
      booking.status = "expired";
      await booking.save();

      const seat = await Seat.findById(booking.seatId);
      if (!seat) continue;

      const timing = booking.timings?.toLowerCase().trim();

      if (timing === "morning") {
        seat.bookedForMorning = null;
      } else if (timing === "evening") {
        seat.bookedForEvening = null;
      } else if (timing === "fullday") {
        // seat.bookedForMorning = false;
        seat.bookedForFullDay = null;
      }

      await seat.save();

      // Addons
      if (booking.addOnServiceId) {
        const addOn = await AddOn.findById(booking.addOnServiceId);
        if (addOn) {
          addOn.quantity += Number(booking.addOnServiceQuantity);
          await addOn.save();
        }
      }
    }

    console.log("Expiry update completed at", new Date().toISOString());

    console.log("Seat full-day sync done");

    // const activeBookings = await Booking.find({ status: "booked" });

    // for (const booking of activeBookings) {
    //     const seat = await Seat.findById(booking.seatId);
    //     if (!seat) continue;

    //     const timing = booking.timings?.toLowerCase().trim();

    //     if (timing === "morning") seat.bookedForMorning = true;
    //     if (timing === "evening") seat.bookedForEvening = true;
    //     if (timing === "fullday") {
    //         seat.bookedForMorning = true;
    //         seat.bookedForEvening = true;
    //         seat.bookedForFullDay = true;
    //     }

    //     await seat.save();
    // }

    // Coupens
    const expiredAllocations = await Allocated.find({
      validTill: { $lt: nowUTC },
      status: { $in: ["allocated", "redeemed"] },
    }).select("coupenId");

    if (expiredAllocations.length > 0) {
      await Allocated.updateMany(
        {
          validTill: { $lt: nowUTC },
          status: { $in: ["allocated", "redeemed"] },
        },
        { $set: { status: "expired" } }
      );

      const coupenIds = expiredAllocations
        .map((item) => item.coupenId)
        .filter(Boolean);
      if (coupenIds.length > 0) {
        await Reedem.updateMany(
          { coupenId: { $in: coupenIds }, status: "active" },
          { $set: { status: "expired" } }
        );
      }

      console.log(
        "🎟️ Expired Allocated and Redeem entries updated successfully"
      );
    }

    // Waiting Expiry
    const expiredWaitings = await Waiting.find({
      expiredDate: { $lte: nowUTC },
      isExpired: false,
    });

    if (expiredWaitings.length === 0) {
      console.log(
        "No expired waitings found. Current UTC:",
        nowUTC.toISOString()
      );
    } else {
      const expiredIds = expiredWaitings.map((w) => w._id);

      // Delete all expired waiting documents
      const deleteResult = await Waiting.deleteMany({
        _id: { $in: expiredIds },
      });

      console.log(
        `Deleted ${deleteResult.deletedCount} expired waiting entries`
      );
    }

    console.log("Cron completed successfully");
  } catch (err) {
    console.error("❌ Cron job error:", err.message);
  }
});

const punch = async (req, res) => {
  console.log(req.body);
  
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User id is required" });
    }

    const now = new Date();
    const today = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString();
    console.log("date => " , today);
    console.log("time => " , currentTime);
    

    // Step 1: Find logs for this user
    let userLogs = await Logs.findOne({ User: id });

    // No logs exist → create first log document
    if (!userLogs) {
      const newLog = await Logs.create({
        User: id,
        Logs: [
          {
            Date: today,
            PunchIn: [currentTime],
          },
        ],
      });

      return res.json({
        message: "Punch recorded (first entry)",
        logs: newLog.Logs,
      });
    }

    // Step 2: Check today's log using index 0 (O(1) fastest)
    const firstLog = userLogs.Logs[0];

    if (firstLog && firstLog.Date === today) {
      // Today already exists → add punch time
      firstLog.PunchIn.push(currentTime);
    } else {
      // New day → add new entry at top
      userLogs.Logs.unshift({
        Date: today,
        PunchIn: [currentTime],
      });
    }

    // Save updates
    await userLogs.save();

    res.json({
      message: "Punch recorded",
      logs: userLogs.Logs,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  register,
  verifyPayment,
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
  getAllPlans,
  WaitingList,
  verifyPaymentForBooking,
  getMyAllBookings,
  punch
};
