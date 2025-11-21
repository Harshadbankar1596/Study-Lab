const Management = require("../models/managementModel");
const Otp = require("../models/otpModel");
const Coupens = require("../models/coupensModel");
const Enquiry = require("../models/enquiryModel");
const AddOnServices = require("../models/addOnServices");
const Students = require("../models/userModel");
const Bookings = require("../models/bookingsModel");
const jwt = require("jsonwebtoken");
const POPULATE_USER = ["name", "email", "contact"];
const Staff = require("../models/staffModel");
const Seat = require("../models/seat");
const Task = require("../models/tasksModel");
const Time = require("../models/timeSlots");
const Allocated = require("../models/allocatedCoupens");
const uploadTheImage = require("../utils/cloudinary");
const Plan = require("../models/plansModel");
const Commision = require("../models/commisionModel");
const Waiting = require("../models/waitingList");
const fs = require("fs");

const Register = async (req, res) => {
  try {
    const { name, contact, email } = req.body;
    if (!name || !contact || !email) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const existingManagement = await Management.findOne({ email });
    if (existingManagement) {
      return res.status(400).json({ error: "Management already exists" });
    }
    const management = await Management({ name, contact, email });
    await management.save();
    res
      .status(201)
      .json({ message: "Management registered successfully", management });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const sendOtp = async (req, res) => {
  try {
    const { contact } = req.body;
    if (!contact) {
      return res.status(400).json({ error: "Please provide contact number" });
    }
    const existingManagement = await Management.findOne({ contact });
    if (!existingManagement) {
      return res.status(400).json({ error: "Management not found" });
    }
    // const otp = Math.floor(100000 + Math.random() * 900000);
    const otp = 123456;
    const newOtp = await Otp.findOneAndUpdate(
      { contact },
      { otp },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await newOtp.save();
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { contact, otp } = req.body;
    if (!contact || !otp) {
      return res
        .status(400)
        .json({ error: "Please provide contact number and OTP" });
    }
    const existingManagement = await Management.findOne({ contact });
    if (!existingManagement) {
      return res.status(400).json({ error: "Management not found" });
    }
    const existingOtp = await Otp.findOne({ contact, otp });
    if (!existingOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    await Otp.deleteMany({ contact });

    const token = jwt.sign({ _id: existingManagement._id }, process.env.JWT, {
      expiresIn: "15d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      management: existingManagement,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllSeats = async (req, res) => {
  try {
    const management = req.management;
    if (!management) {
      return res.status(400).json({ message: "Management not valid" });
    }
    const seats = await Seat.find({});
    res.status(200).json({ message: "Success", seats: seats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllStudents = async (req, res) => {
  try {
    const management = req.management;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    const students = await Students.find({});
    res.status(200).json({ students: students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllTimeSLots = async (req, res) => {
  try {
    const management = req.management;
    if (!management) {
      return res.status(400).json({ message: "Management is not valid" });
    }
    const allManagement = await Time.find({});
    res.status(200).json({ message: "Succes", allManagement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 
const getAllBookings = async (req, res) => {
  try {
    const management = req.management;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    const bookings = await Bookings.find({}).populate("userId", "name regiterationAmount");
    res.status(200).json({ bookings: bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllStaff = async (req, res) => {
  try {
    const management = req.management;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    const staff = await Staff.find({});
    res.status(200).json({ staff: staff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addCoupen = async (req, res) => {
  try {
    const { description, discount, code } = req.body;
    const management = req.management;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    if (!description || !discount || !code) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const existingCoupen = await Coupens.findOne({ code });
    if (existingCoupen) {
      return res.status(400).json({ error: "Coupen code already exists" });
    }
    const coupen = await Coupens({ description, discount, code });
    await coupen.save();
    res.status(201).json({ message: "Coupen added successfully", coupen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const editCoupen = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, discount, code, from, to } = req.body;
    console.log(req.body);
    const management = req.management;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    const coupen = await Coupens.findById(id);
    if (!coupen) {
      return res.status(404).json({ error: "Coupen not found" });
    }
    coupen.description = description || coupen.description;
    coupen.discount = discount || coupen.discount;
    coupen.code = code || coupen.code;
    coupen.from = from || coupen.from;
    coupen.to = to || coupen.to;
    await coupen.save();
    res.status(200).json({ message: "Coupen updated successfully", coupen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteCoupen = async (req, res) => {
  try {
    const { id } = req.params;
    const management = req.management;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    const coupen = await Coupens.findById(id);
    if (!coupen) {
      return res.status(404).json({ error: "Coupen not found" });
    }
    await Coupens.findByIdAndDelete(id);
    res.status(200).json({ message: "Coupen deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllCoupens = async (req, res) => {
  try {
    const management = req.management;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    const coupens = await Coupens.find({});
    res.status(200).json({ coupens: coupens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllEnquiries = async (req, res) => {
  try {
    const management = req.management;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    const enquiries = await Enquiry.find({});
    res.status(200).json({ enquiries: enquiries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addAddOnServices = async (req, res) => {
  try {
    const { serviceName, quantity, availability, price } = req.body;
    const management = req.management;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    if (!serviceName || !quantity || !availability || !price) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const existingService = await AddOnServices.findOne({ serviceName });
    if (existingService) {
      return res.status(400).json({ error: "Service already exists" });
    }
    const addOnService = new AddOnServices({
      serviceName,
      quantity,
      availability,
      price,
    });
    await addOnService.save();
    res
      .status(201)
      .json({ message: "Add-On Service added successfully", addOnService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const editAddOnServices = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, quantity, availability, price } = req.body;
    const management = req.management;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    const service = await AddOnServices.findById(id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    service.serviceName = serviceName || service.serviceName;
    service.quantity = quantity || service.quantity;
    service.availability = availability || service.availability;
    service.price = price || service.price;
    await service.save();
    res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteAddOnServices = async (req, res) => {
  try {
    const management = req.management;
    const { id } = req.params;
    if (!management) {
      return res.status(401).json({ message: "User not valid" });
    }
    const deletedService = await AddOnServices.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllAddOns = async (req, res) => {
  try {
    const management = req.management;
    if (!management) {
      return res.status(400).json({ message: "Management not valid" });
    }
    const addOns = await AddOnServices.find({});
    res.status(200).json({ message: "Success", addOns });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAvailableSeats = async (req, res) => {
  try {
    const management = req.management;
    if (!management) {
      return res.status(400).json({ message: "User not valid" });
    }
    const seats = await Seat.find({ status: { $in: ["pending", "expired"] } });
    res.status(200).json({ message: "success", data: seats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteStudent = async (req, res) => {
  try {
    const management = req.management;
    const { id } = req.params;

    if (!management) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deletedStudent = await Students.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      student: deletedStudent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addTaskToStaff = async (req, res) => {
  try {
    const management = req.management;
    const { name, staffName } = req.body;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    if (!name || !staffName) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const staff = await Staff.findOne({ name: staffName });
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }
    const task = await Task({ name, staff: staff._id });
    await task.save();
    res.status(201).json({ message: "Task added successfully", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const changeTaskStatus = async (req, res) => {
  try {
    const management = req.management;
    const { id, status } = req.params;
    if (!management) {
      return res.status(403).json({ error: "User not valid" });
    }
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (status !== "done" && status !== "undone") {
      return res.status(400).json({ error: "Invalid status" });
    }
    task.status = status || task.status;
    await task.save();
    res
      .status(200)
      .json({ message: `Task status marked to ${status} successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getDashboardData = async (req, res) => {
  try {
    const management = req.management;
    if (!management) {
      return res.status(400).json({ message: "Management not found" });
    }

    const students = await Students.find({});
    const staff = await Staff.find({});
    const seats = await Seat.find({ status: { $in: ["expired", "pending"] } });
    const bookings = await Bookings.find({});

    const studentsLength = students.length;
    const staffLength = staff.length;
    const seatsLength = seats.length;
    const bookingsLength = bookings.length;

    res.status(200).json({
      message: "Success",
      studentsLength,
      staffLength,
      seatsLength,
      bookingsLength,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllTask = async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ message: "success", task: tasks });
};
const addStudent = async (req, res) => {
  try {
    const management = req.management;
    const { _id } = management;
    if (!management) {
      return res.status(401).json({ message: "Management not valid" });
    }
    const {
      name,
      email,
      contact,
      dob,
      permenantAdd,
      currentAddress,
      parentsContact,
      regiterationAmount,
      classStd,
        college,
    } = req.body;
    if (
      !name ||
      !email ||
      !contact ||
      !dob ||
      !permenantAdd ||
      !currentAddress ||
      !parentsContact ||
      !regiterationAmount ||
      !classStd ||
      !college
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isUserExists = await Students.findOne({ email, contact });
    // console.log(first)
    if (isUserExists) {
      return res.status(400).json({ message: "User Already registered" });
    }

    let profileImage = null;
    if (req.file) {
      const uploadResult = await uploadTheImage(req.file.path);
      profileImage = uploadResult?.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const count = await Students.countDocuments();
    const index = count + 1;

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedIndex = String(index).padStart(2, "0");
    const uniqueId = `000${formattedIndex}${day}${month}${year}`;

    const user = new Students({
      name,
      email,
      contact,
      dob,
      permenantAdd,
      currentAddress,
      parentsContact,
      profileImage,
      regiterationAmount,
      isApproved: true,
      paymentStatus: "paid",
      addedBy: "Management",
      managementId: _id,
      uniqueId,
      classStd,
      college
    });
    await user.save();
    res.status(200).json({ message: "Student added successfully" }, user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const alocateCoupen = async (req, res) => {
  try {
    const { coupenId } = req.params;
    const { students, validTill } = req.body;
    const management = req.management;
    const now = new Date();
    console.log(students);
    if (!management) {
      return res.status(401).json({ message: "Management is not valid" });
    }

    if (validTill < now) {
      return res
        .status(400)
        .json({ message: "Date should be ahead of cuurent time" });
    }

    if (
      !coupenId ||
      !students ||
      !Array.isArray(students) ||
      students.length === 0 ||
      !validTill
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const coupenExists = await Coupens.findById(coupenId);
    if (!coupenExists) {
      return res.status(400).json({ message: "Coupon does not exist" });
    }

    for (const studentId of students) {
      console.log("student id", studentId);
      const studentExists = await Students.findById(studentId);
      if (!studentExists) {
        return res
          .status(400)
          .json({ message: `Student ${studentId} does not exist` });
      }

      const alreadyAllocated = await Allocated.findOne({
        coupenId,
        students: studentId,
      });

      if (alreadyAllocated) {
        return res.status(400).json({
          message: `${coupenExists.code} is already allocated to student ${studentExists.name}`,
        });
      }
    }

    const allocate = new Allocated({
      coupenId,
      students,
      validTill,
      status: "allocated",
    });
    await allocate.save();

    res
      .status(200)
      .json({ message: "Coupon allocated successfully", allocate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const getAllPlans = async (req, res) => {
  try {
    const management = req.management;
    if (!management) {
      return res.status(401).json({ message: "Management not valid" });
    }
    const plans = await Plan.find({});
    res.status(201).json({ message: plans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const bookSeat = async (req, res) => {
  try {
    // const user = req.user;
    const { _doc } = req.management;
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
      user,
    } = req.body;

    if (!user) return res.status(400).json({ message: "User does not exist" });
    if (!seatNo || !planId || !amount || !duration || !timings) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isPlanExists = await Plan.findById(planId);
    if (!isPlanExists) {
      return res.status(400).json({ message: "Plan does not exist" });
    }

    const existingBooking = await Bookings.findOne({
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
    const recentExpired = await Bookings.findOne({
      seatId,
      status: "expired",
    }).sort({ expiryDate: -1 });

    const waitingStudent = await Waiting.findOne({
      seatId,
      isExpired: false,
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
      const addOnService = await AddOnServices.findById(addOnServiceId);
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

    // Discount validation
    if (timings === "fullday") {
      const durationNum = duration.replace("months", "").trim();

      const disObj = isPLanExactly.discounts.find(
        (dis) => dis.duration === durationNum
      );

      if (disObj) {
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
        const expected = Number(amount) + Number(addOnPrice);
        if (Number(discountedAmount) !== expected) {
          return res.status(400).json({
            message: `Expected ${expected} but got ${discountedAmount}`,
          });
        }
      }
    } else {
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

    // Helper function to get duration in days
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

    // Compute expiry date
    const durationDays = getDurationInDays(duration, bookingDate);
    if (durationDays === null) {
      return res.status(400).json({ message: "Invalid duration format" });
    }

    expiryDate = new Date(bookingDate);
    expiryDate.setUTCDate(expiryDate.getUTCDate() + durationDays);
    expiryDate.setUTCHours(23, 59, 59, 999);

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

    // Gap bookings - Overlap check
    const normalizeUTC = (date) => {
      const d = new Date(date);
      return new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      );
    };

    const newStart = normalizeUTC(bookingDate);
    const newEnd = new Date(newStart);
    newEnd.setUTCDate(
      newEnd.getUTCDate() + getDurationInDays(duration, newStart)
    );

    const requestedTiming = (timings || "").toLowerCase().trim();

    const activeBookings = await Bookings.find({
      seatId,
      status: { $in: ["booked", "pending"] },
      $or: [
        { timings: requestedTiming },
        { timings: "fullday" },
        ...(requestedTiming === "fullday"
          ? [{ timings: { $in: ["morning", "evening"] } }]
          : []),
      ],
    });

    let conflict = null;

    for (const existing of activeBookings) {
      const existingStart = normalizeUTC(existing.bookingDate);
      const existingEnd = normalizeUTC(existing.expiryDate);
      const existingTiming = (existing.timings || "").toLowerCase();

      const timingConflict =
        requestedTiming === "fullday" ||
        existingTiming === "fullday" ||
        requestedTiming === existingTiming;

      if (!timingConflict) continue;

      const overlaps = existingStart < newEnd && existingEnd > newStart;

      if (overlaps) {
        conflict = existing;
        break;
      }
    }

    if (conflict) {
      return res.status(400).json({
        message: `Requested slot overlaps with existing booking (${
          conflict.timings
        }) from ${conflict.bookingDate.toLocaleDateString()} to ${conflict.expiryDate.toLocaleDateString()}. Try another timing or check available gap.`,
      });
    }

    console.log(
      `✅ Booking valid for seat ${seatId} from ${newStart.toISOString()} to ${newEnd.toISOString()}.`
    );

    const booking = new Bookings({
      userId: user._id,
      planId,
      seatNo,
      seatId,
      timings,
      addOnServiceId: addOnServiceId || null,
      addOnServiceQuantity: addOnServiceQuantity || null,
      amount,
      discountedAmount,
      duration,
      expiryDate,
      status,
      isPreBooked,
      adharF,
      adharB,
      bookingDate,
      paymentStatus: "paid",
    });

    await seat.save();
    await booking.save();

    // Commission calculation logic
    const totalCommission = discountedAmount * 0.25;

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();

    const perDayCommission = totalCommission / totalDays;

    const currentMonthCommission = Math.floor(perDayCommission * today);
    const nextMonthCommission = Math.floor(
      totalCommission - currentMonthCommission
    );

    console.log({
      currentMonthCommission,
      nextMonthCommission,
      managementId: _doc?._id,
      userId: user._id,
    });

    const commision = new Commision({
      managementId: _doc?._id,
      userId: user._id,
      commissionForThisMonth: {
        amount: currentMonthCommission,
        month: monthNames[month],
        year,
      },
      commissionForNextMonth: {
        amount: nextMonthCommission,
        month: monthNames[nextMonth],
        year: nextMonthYear,
      },
    });

    await commision.save();

    res.status(200).json({
      success: true,
      message: "Seat booked successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Seat booking error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const getCommissionDetails = async (req, res) => {
  try {
    const { managementId, month, year, paymentStatus = "unpaid" } = req.query;

    if (!managementId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "managementId, month, and year are required.",
      });
    }
    const isManagementExist = await Management.findById(managementId);

    if (!isManagementExist) {
      res.status(400).json({ message: "Management does not exist!" });
    }
    // Find all commissions for this management
    const commissions = await Commision.find({ managementId }).populate(
      "userId",
      "uniqueId"
    );

    if (!commissions.length) {
      return res.status(404).json({
        success: false,
        message: "No commission records found for this management.",
      });
    }

    // --- Filter and calculate dynamically ---
    let totalCommission = 0;
    const filteredData = [];

    commissions.forEach((item) => {
      const thisMonth = item.commissionForThisMonth;
      const nextMonth = item.commissionForNextMonth;

      // ✅ Match by month, year, and payment status for "this month"
      if (
        thisMonth?.month === month &&
        thisMonth?.year === year &&
        thisMonth?.paymentStatus === paymentStatus
      ) {
        const amount = parseFloat(thisMonth.amount || 0);
        totalCommission += amount;
        filteredData.push({
          _id: item._id,
          userId: item.userId,
          managementId: item.managementId,
          type: "commissionForThisMonth",
          commission: thisMonth,
          amount,
        });
      }

      // ✅ Also match if the selected month/year matches the "next month" field
      if (
        nextMonth?.month === month &&
        nextMonth?.year === year &&
        nextMonth?.paymentStatus === paymentStatus
      ) {
        const amount = parseFloat(nextMonth.amount || 0);
        totalCommission += amount;
        filteredData.push({
          _id: item._id,
          userId: item.userId,
          managementId: item.managementId,
          type: "commissionForNextMonth",
          commission: nextMonth,
          amount,
        });
      }
    });

    res.status(200).json({
      totalCommission,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error fetching commissions:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
const managementPaymentRequest = async (req, res) => {
  try {
    const { managementId, month, year, paymentStatusFrom, paymentStatusTo } =
      req.body;

    if (
      !managementId ||
      !month ||
      !year ||
      !paymentStatusFrom ||
      !paymentStatusTo
    ) {
      return res.status(400).json({
        success: false,
        message:
          "managementId, month, year, paymentStatusFrom, and paymentStatusTo are required.",
      });
    }

    // ✅ Management can only do: unpaid → pending and paid → received
    const validTransitions = {
      unpaid: ["pending"],
      paid: ["received"],
    };

    const allowedNextStatuses = validTransitions[paymentStatusFrom];

    if (!allowedNextStatuses) {
      return res.status(400).json({
        success: false,
        message: `Invalid paymentStatusFrom: "${paymentStatusFrom}". Management can only transition from: unpaid or paid.`,
      });
    }

    if (!allowedNextStatuses.includes(paymentStatusTo)) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition: Management cannot change status from "${paymentStatusFrom}" to "${paymentStatusTo}". Allowed transitions: ${paymentStatusFrom} → ${allowedNextStatuses.join(
          " or "
        )}.`,
      });
    }

    const isManagementExist = await Management.findById(managementId);

    if (!isManagementExist) {
      return res.status(400).json({
        success: false,
        message: "Management does not exist!",
      });
    }

    // Find all commissions for this management
    const commissions = await Commision.find({ managementId });

    if (!commissions.length) {
      return res.status(404).json({
        success: false,
        message: "No commission records found for this management.",
      });
    }

    // --- Filter and calculate dynamically ---
    let totalCommission = 0;
    const filteredData = [];

    commissions.forEach((item) => {
      const thisMonth = item.commissionForThisMonth;
      const nextMonth = item.commissionForNextMonth;

      // ✅ Match by month, year, and paymentStatusFrom for "this month"
      if (
        thisMonth?.month === month &&
        thisMonth?.year === year &&
        thisMonth?.paymentStatus === paymentStatusFrom
      ) {
        const amount = parseFloat(thisMonth.amount || 0);
        totalCommission += amount;
        filteredData.push({
          _id: item._id,
          userId: item.userId,
          managementId: item.managementId,
          type: "commissionForThisMonth",
          commission: thisMonth,
          amount,
        });
      }

      // ✅ Also match if the selected month/year matches the "next month" field
      if (
        nextMonth?.month === month &&
        nextMonth?.year === year &&
        nextMonth?.paymentStatus === paymentStatusFrom
      ) {
        const amount = parseFloat(nextMonth.amount || 0);
        totalCommission += amount;
        filteredData.push({
          _id: item._id,
          userId: item.userId,
          managementId: item.managementId,
          type: "commissionForNextMonth",
          commission: nextMonth,
          amount,
        });
      }
    });

    if (!filteredData.length) {
      return res.status(404).json({
        success: false,
        message: `No commission records found with payment status "${paymentStatusFrom}" for ${month}/${year}.`,
      });
    }

    // ✅ Update payment status from paymentStatusFrom to paymentStatusTo for filtered records
    const updatePromises = filteredData.map(async (record) => {
      const updateField =
        record.type === "commissionForThisMonth"
          ? "commissionForThisMonth.paymentStatus"
          : "commissionForNextMonth.paymentStatus";

      return await Commision.findByIdAndUpdate(
        record._id,
        { [updateField]: paymentStatusTo },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: `Payment status updated from "${paymentStatusFrom}" to "${paymentStatusTo}" successfully by management`,
      totalCommission,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error in management payment request:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  Register,
  sendOtp,
  login,
  getAllStudents,
  addCoupen,
  editCoupen,
  deleteCoupen,
  getAllCoupens,
  getAllEnquiries,
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
};
