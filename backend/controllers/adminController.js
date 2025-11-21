const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const Time = require("../models/timeSlots");
const Seat = require("../models/seat");
const jwt = require("jsonwebtoken");
const Staff = require("../models/staffModel");
const User = require("../models/userModel");
const Bookings = require("../models/bookingsModel");
const Updates = require("../models/updatesModel");
const Gallery = require("../models/galleryModel");
const uploadTheImage = require("../utils/cloudinary");
const fs = require("fs");
const Enquiry = require("../models/enquiryModel");
const Otp = require("../models/otpModel");
const Charges = require("../models/chargesModel");
const Coupen = require("../models/coupensModel");
const Allocated = require("../models/allocatedCoupens");
const Plan = require("../models/plansModel");

const POPULATE_USER = ["name", "email", "contact", "regiterationAmount"];
const POPULATE_SEAT = ["floor", "row", "seatNumber"];
// const SAFE_BOOKING_DATA = [""];

const twilio = require("twilio");
const Management = require("../models/managementModel");
const Commision = require("../models/commisionModel");
const Waiting = require("../models/waitingList");
const account_sid = process.env.ACCOUNT_SID;
const auth_token = process.env.AUTH_TOKEN;

const twilioClient = new twilio(account_sid, auth_token);

const register = async (req, res) => {
  try {
    const { name, contact, email, password } = req.body;
    if (!name || !contact || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin({
      name,
      contact,
      email,
      password: hashedPassword,
    });
    await admin.save();
    res.status(200).json({ message: "Admin Registered" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const sendOtp = async (req, res) => {
  try {
    const { contact } = req.body;
    if (!contact) {
      return res.status(400).json({ message: "Contact is required" });
    }
    const adminExists = await Admin.findOne({ contact });
    if (!adminExists) {
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
    //   body: `Otp - ${otp}`,
    //   from: process.env.PHONE_NUMBER,
    //   to: contact.startsWith('+') ? contact : `+91${contact}`,
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

    if (!contact || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const adminExists = await Admin.findOne({ contact });
    if (!adminExists) {
      return res.status(400).json({ message: "Admin does not exist" });
    }

    const isOtpValid = await Otp.findOne({ contact, otp });
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    await Otp.deleteOne({ _id: isOtpValid._id });

    const token = jwt.sign({ _id: adminExists._id }, process.env.JWT, {
      expiresIn: "15d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    adminExists.password = undefined;

    res.status(200).json({
      message: "Logged In Successfully",
      admin: adminExists,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User does not exist" });
    }
    userExists.isApproved = true;
    await userExists.save();
    res
      .status(200)
      .json({ message: `${userExists.name} marked as approved !` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addTimeSlots = async (req, res) => {
  try {
    const { fromTime, toTime } = req.body;
    if (!fromTime || !toTime) {
      return res.status(400).json({ message: "Time is required" });
    }
    if (fromTime === toTime) {
      return res
        .status(400)
        .json({ message: "To time must be ahead of from time" });
    }
    const slot = await Time({
      fromTime,
      toTime,
    });
    await slot.save();
    res
      .status(200)
      .json({ message: "Time Slot added successfully", time: slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addSeats = async (req, res) => {
  try {
    let seats = req.body;

    if (!Array.isArray(seats)) {
      seats = [seats];
    }

    if (seats.length === 0) {
      return res.status(400).json({ message: "Seats data is required" });
    }

    for (let seat of seats) {
      if (!seat.floor || !seat.row || !seat.seatNumber) {
        return res
          .status(400)
          .json({ message: "Each seat must have floor, row and seatNumber" });
      }
    }

    const existingSeats = await Seat.find({
      $or: seats.map((seat) => ({
        floor: seat.floor,
        row: seat.row,
        seatNumber: seat.seatNumber,
      })),
    });

    if (existingSeats.length > 0) {
      return res.status(409).json({
        message: "seat already exist",
        // duplicates: existingSeats
      });
    }

    const savedSeats = await Seat.insertMany(seats);

    res.status(201).json({
      message: "Seats added successfully",
      seats: savedSeats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const editSeats = async (req, res) => {
  try {
    const { floor, row, seatNumber } = req.body;
    const { seatId } = req.params;

    const seatExists = await Seat.findById(seatId);
    if (!seatExists) {
      return res.status(400).json({ message: "Seat does not exist" });
    }

    if (floor) seatExists.floor = floor;
    if (row) seatExists.row = row;
    if (seatNumber) seatExists.seatNumber = seatNumber;

    await seatExists.save();

    res.status(200).json({
      message: "Seat updated successfully",
      seat: seatExists,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addStaff = async (req, res) => {
  try {
    const admin = req.admin;
    const { name, contact, role } = req.body;
    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }
    const isStaffExists = await Staff.findOne({ contact });
    if (isStaffExists) {
      return res.status(400).json({ message: "Staff member already exists" });
    }

    const staff = new Staff({ name, contact, role });
    await staff.save();
    res.status(200).json({ message: "Staff Added Successfully", data: staff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const editStaff = async (req, res) => {
  try {
    const admin = req.admin;
    const staffId = req.params.staffId;
    const { role } = req.body;
    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }
    const isStaffExists = await Staff.findById({ _id: staffId });
    if (!isStaffExists) {
      return res.status(400).json({ message: "Staff doesn't exists" });
    }
    const updatedData = await Staff.findByIdAndUpdate(
      staffId,
      { role },
      { new: true }
    );
    await updatedData.save();
    res
      .status(200)
      .json({ message: "Staff Updated Successfully", data: updatedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    if (!staffId) {
      return res.status(400).json({ message: "Staff id is required" });
    }
    const staffExists = await Staff.findById({ _id: staffId });
    if (!staffExists) {
      return res.status(400).json({ message: "Staff does not exists" });
    }
    await Staff.findByIdAndDelete({ _id: staffId });
    res.status(200).json({ message: "Staff Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllStaff = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }

    const staffs = await Staff.find({});
    res.status(200).json({ message: "success", data: staffs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getStudents = async (req, res) => {
  try {
    const admin = req.admin;

    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }
    const students = await User.find({});
    res.status(200).json({ message: "success", data: students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find({});
    res.status(200).json({ message: "success", data: seats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addUpdate = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const update = await Updates({ title, description });
    await update.save();
    res
      .status(200)
      .json({ message: "Update added successfully", data: update });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const editUpdate = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }
    const { updateId } = req.params;
    const { title, description } = req.body;
    if (!updateId || !title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updateExists = await Updates.findById(updateId);
    if (!updateExists) {
      return res.status(404).json({ message: "Update does not exist" });
    }
    updateExists.title = title;
    updateExists.description = description;
    await updateExists.save();
    res
      .status(200)
      .json({ message: "Update edited successfully", data: updateExists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteUpdate = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }
    const { updateId } = req.params;
    if (!updateId) {
      return res.status(400).json({ message: "UpdateId is required" });
    }
    const updateExists = await Updates.findById(updateId);
    if (!updateExists) {
      return res.status(404).json({ message: "Update does not exist" });
    }
    await Updates.findByIdAndDelete(updateId);
    res.status(200).json({ message: "Update deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addImage = async (req, res) => {
  try {
    const admin = req.admin;
    const { caption } = req.body;

    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }

    if (!caption) {
      return res.status(400).json({ message: "Caption is required" });
    }

    console.log("req.file:", req.file);

    let imageUrl = null;

    if (req.file) {
      try {
        const uploadResult = await uploadTheImage(req.file.path);

        // console.log("uploadResult:", uploadResult);

        if (uploadResult?.secure_url) {
          imageUrl = uploadResult.secure_url;
        } else {
          console.error("Upload did not return ");
        }

        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (err) {
        console.error("❌ Error during image upload:", err);
        return res
          .status(500)
          .json({ message: "Image upload failed", error: err.message });
      }
    }

    // console.log(imageUrl);

    if (!imageUrl) {
      return res.status(400).json({ message: "Image upload failed" });
    }
    const image = new Gallery({ imageUrl, caption });
    await image.save();
    return res
      .status(200)
      .json({ message: "Image uploaded successfully", image });
  } catch (error) {
    // console.error("addImage error:", error);
    return res.status(500).json({ error: error.message });
  }
};
const editImage = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ message: "Admin not authenticated" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Image ID is required" });
    }

    const existingImage = await Gallery.findById(id);
    if (!existingImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    const { caption } = req.body;
    let imageUrl = existingImage.imageUrl;

    if (req.file) {
      try {
        const uploadResult = await uploadTheImage(req.file.path);

        if (uploadResult?.secure_url) {
          imageUrl = uploadResult.secure_url;
        } else {
          console.error("Upload did not return a URL");
        }

        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    existingImage.caption = caption || existingImage.caption;
    existingImage.imageUrl = imageUrl;

    const updatedImage = await existingImage.save();

    res
      .status(200)
      .json({ message: "Image updated successfully", data: updatedImage });
  } catch (error) {
    console.error("Edit image error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getImage = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }
    const images = await Gallery.find({});
    res.status(200).json({ message: "success", data: images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteImage = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }
    const { imageId } = req.params;
    if (!imageId) {
      return res.status(400).json({ message: "ImageId is required" });
    }
    const imageExists = await Gallery.findById(imageId);
    if (!imageExists) {
      return res.status(404).json({ message: "Image does not exist" });
    }
    await Gallery.findByIdAndDelete(imageId);
    // await Gallery.save();
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllEnquiries = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }
    const enquiries = await Enquiry.find({});
    res.status(200).json({ message: "success", data: enquiries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllBookings = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(400).json({ message: "Admin is not valid" });
    }
    const bookings = await Bookings.find(
      {},
      { razorpay_signature: 0, razorpay_payment_id: 0, razorpay_order_id: 0 }
    )
      .populate("seatId", POPULATE_SEAT)
      .populate("userId", POPULATE_USER);

    bookings.razorpay_signature = undefined;

    if (!bookings) {
      return res.status(400).json({ message: "Error fetching Bookings" });
    }
    res.status(200).json({ message: "Success", data: bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllUpdates = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }
    const updates = await Updates.find({});
    res.status(200).json({ message: "Success", data: updates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getTimeSlots = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(400).json({ message: "Admin is not valid" });
    }
    const timeslots = await Time.find({});
    res.status(200).json({ message: "Success", data: timeslots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addCharges = async (req, res) => {
  try {
    const admin = req.admin;
    const { type, price } = req.body;
    if (!type || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const typeExists = await Charges.findOne({ type });
    if (typeExists) {
      return res.status(400).json({ message: "type already exists" });
    }
    const charges = new Charges({
      type,
      price,
    });
    await charges.save();
    res.status(200).json({ message: "success", charges });
    if (!admin) {
      return res.status(400).json({ message: "Admin is not valid" });
    }
  } catch (error) {
    res.staus(500).json({ error: error.message });
  }
};
const editCharges = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, price } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Charge ID is required" });
    }

    const chargeExists = await Charges.findById(id);
    if (!chargeExists) {
      return res.status(404).json({ message: "Charge not found" });
    }

    if (type) chargeExists.type = type;
    if (price) chargeExists.price = price;

    await chargeExists.save();

    res.status(200).json({
      message: "Charge updated successfully",
      updatedCharge: chargeExists,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteCharge = async (req, res) => {
  try {
    const admin = req.admin;
    const { id } = req.params;

    if (!admin) {
      return res.status(400).json({ message: "Admin is not valid" });
    }

    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const isChargeExists = await Charges.findById(id);
    if (!isChargeExists) {
      return res.status(404).json({ message: "Charge does not exist" });
    }

    await Charges.findByIdAndDelete(id);

    res.status(200).json({ message: "Charge deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getCharges = async (req, res) => {
  try {
    // const admin = req.admin;
    // if (!admin) {
    //   return res.status(400).json({ message: "Admin is not valid" });
    // }
    const charges = await Charges.find({});
    res.status(200).json({ message: "Success", charges: charges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteSeatById = async (req, res) => {
  res.status(200).json({ message: "Hi Admin" });
  // try {
  //     const { seatId } = req.params;
  //     console.log(seatId)

  //     const objectId = new mongoose.Types.ObjectId(seatId);
  //     const seat = await Seat.findOne({
  //         _id: objectId,
  //         bookedForMorning: { $in: [false || null] },
  //         bookedForEvening: { $in: [false || null] },
  //         bookedForFullDay: { $in: [false || null] },
  //     });
  //     console.log("Matched seat:", seat);
  //     if (!seat) {
  //         return res.status(400).json({
  //             message: "Seat not found or cannot be deleted (already booked)"
  //         });
  //     }

  //     await Seat.findByIdAndDelete(objectId);

  //     res.status(200).json({ message: "Seat deleted successfully" });

  // } catch (error) {
  //     res.status(500).json({ error: error.message });
  // }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(200).json({ message: "Logout successfull" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// New Api's
const addPLans = async (req, res) => {
  try {
    const { planType, timing, morningTime, eveningTime, pass, discounts } =
      req.body;

    if (!planType) {
      return res.status(400).json({ message: "planType are required" });
    }

    const isPlanExists = await Plan.findOne({ planType, timing });
    if (isPlanExists) {
      return res
        .status(400)
        .json({ message: "Plan with this type and timing already exists" });
    }

    if (planType === "halfday") {
      if (timing !== "morning" && timing !== "evening") {
        return res.status(400).json({
          message:
            "Timing must be either 'morning' or 'evening' for halfday plan",
        });
      }

      if (timing === "morning" && !morningTime) {
        return res.status(400).json({
          message: "Morning time is required for morning halfday plan",
        });
      }

      if (timing === "evening" && !eveningTime) {
        return res.status(400).json({
          message: "Evening time is required for evening halfday plan",
        });
      }

      if (discounts && Array.isArray(discounts) && discounts.length > 0) {
        return res
          .status(422)
          .json({ message: "Can't add discounts for half day bookings" });
      }

      const plan = new Plan({
        planType,
        timing,
        morningTime,
        eveningTime,
        pass,
      });

      await plan.save();
      return res
        .status(201)
        .json({ message: "Halfday plan added successfully", plan });
    }

    // Full day

    if (planType === "fullday") {
      // if (timing !== "fullday") {
      //     return res.status(400).json({
      //         message: "Timing must be 'fullday' for a fullday plan",
      //     });
      // }

      const plan = new Plan({
        planType,
        timing: "fullday",
        pass,
        discounts,
      });

      await plan.save();
      return res
        .status(201)
        .json({ message: "Fullday plan added successfully", plan });
    }

    return res.status(400).json({ message: "Invalid planType" });
  } catch (error) {
    console.error("Error adding plan:", error);
    res.status(500).json({ error: error.message });
  }
};
const deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    if (!planId) {
      return res.status(400).json({ message: "Plan id is required" });
    }
    await Plan.findByIdAndDelete(planId);
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllPlans = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(400).json({ message: "Admin not valid" });
    }
    const plans = await Plan.find({});
    res.status(200).json({ message: "Sucess", data: plans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addPasses = async (req, res) => {
  try {
    const { planId } = req.params;
    if (!planId) {
      return res.status(400).json({ message: "Plan Id is required" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan does not exist" });
    }

    const { pass } = req.body;
    if (!pass || !Array.isArray(pass)) {
      return res
        .status(400)
        .json({ message: "Pass data is required and should be an array" });
    }

    plan.pass.push(...pass);
    await plan.save();

    return res.status(200).json({ message: "Passes added successfully", plan });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deletePass = async (req, res) => {
  try {
    const { planId, passId } = req.params;

    if (!planId || !passId) {
      return res
        .status(400)
        .json({ message: "Plan ID and Pass ID are required" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan does not exist" });
    }

    const passIndex = plan.pass.findIndex((p) => p._id.toString() === passId);
    if (passIndex === -1) {
      return res.status(404).json({ message: "Pass not found in this plan" });
    }

    plan.pass.splice(passIndex, 1);

    await plan.save();

    return res.status(200).json({ message: "Pass deleted successfully", plan });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const addDiscount = async (req, res) => {
  try {
    const { planId } = req.params;
    const { discounts } = req.body;

    if (!planId) {
      return res.status(400).json({ message: "Plan ID is required" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan does not exist" });
    }

    if (!discounts || !Array.isArray(discounts) || discounts.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one discount is required" });
    }

    discounts.forEach((newDiscount) => {
      const existing = plan.discounts.find(
        (d) => d.duration === newDiscount.duration
      );

      if (existing) {
        return res.status(400).json({ message: "Discount already exists" });
      } else {
        plan.discounts.push(newDiscount);
      }
    });

    await plan.save();

    return res.status(200).json({
      message: "Discount(s) added or updated successfully",
      plan,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const editDiscount = async (req, res) => {
  try {
    const { planId, discountId } = req.params;
    const { discountPercent } = req.body;

    if (!planId || !discountId) {
      return res
        .status(400)
        .json({ message: "planId and discountId are required" });
    }

    const plan = await Plan.findOne({
      _id: planId,
      "discounts._id": discountId,
    });
    if (!plan) {
      return res.status(404).json({ message: "Plan or discount not found" });
    }

    await Plan.updateOne(
      { _id: planId, "discounts._id": discountId },
      {
        $set: {
          //   "discounts.$.duration": duration,
          "discounts.$.discountPercent": discountPercent,
        },
      }
    );

    const updatedPlan = await Plan.findById(planId);
    res
      .status(200)
      .json({ message: "Discount updated successfully", plan: updatedPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteDiscount = async (req, res) => {
  try {
    const { planId, discountId } = req.params;

    if (!planId || !discountId) {
      return res
        .status(400)
        .json({ message: "planId and discountId are required" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await Plan.updateOne(
      { _id: planId },
      { $pull: { discounts: { _id: discountId } } }
    );

    const updatedPlan = await Plan.findById(planId);
    res.status(200).json({ message: "Discount deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
const getWaitingList = async (req, res) => {
  try {
    // const admin = req.admin;
    // if (!admin) {
    //   return res.status(401).json({ message: "Admin is not valid" });
    // }
    const list = await Waiting.find({})
      .populate("studentId", POPULATE_USER)
      .populate("seatId", POPULATE_SEAT)
      .populate("bookingId", "expiryDate");
    res.status(200).json({ message: "Success", data: list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const adminPaymentRequest = async (req, res) => {
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

    const validTransitions = {
      pending: ["paid"],
    };

    const allowedNextStatuses = validTransitions[paymentStatusFrom];

    if (!allowedNextStatuses) {
      return res.status(400).json({
        success: false,
        message: `Invalid paymentStatusFrom: "${paymentStatusFrom}". Admin can only transition from: pending.`,
      });
    }

    if (!allowedNextStatuses.includes(paymentStatusTo)) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition: Admin cannot change status from "${paymentStatusFrom}" to "${paymentStatusTo}". Allowed transitions: ${paymentStatusFrom} → ${allowedNextStatuses.join(
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

    const commissions = await Commision.find({ managementId });

    if (!commissions.length) {
      return res.status(400).json({
        success: false,
        message: "No commission records found for this management.",
      });
    }

    let totalCommission = 0;
    const filteredData = [];

    commissions.forEach((item) => {
      const thisMonth = item.commissionForThisMonth;
      const nextMonth = item.commissionForNextMonth;

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
      return res.status(400).json({
        success: false,
        message: `No commission records found with payment status "${paymentStatusFrom}" for ${month}/${year}.`,
      });
    }

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
      message: `Payment status updated from "${paymentStatusFrom}" to "${paymentStatusTo}" successfully by admin`,
      totalCommission,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error in admin payment request:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
const getManagements = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ message: "Admin is not valid" });
    }
    const manages = await Management.find({});
    res.status(200).json({ message: "Success", data: manages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getTransactions = async (req, res) => {};

module.exports = {
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
  addPLans,
  addDiscount,
  editDiscount,
  deleteDiscount,
  addPasses,
  deletePass,
  getAllPlans,
  deletePlan,
  getCommissionDetails,
  adminPaymentRequest,
  getWaitingList,
  getManagements,
};
