// import React, { useState, useEffect } from "react";
// import { Upload, X } from "lucide-react";
// import ChairIcon from "/seat.svg";
// import EditSeatPopup from "../components/EditSitPopup";
// import AddSeatPopup from "../components/AddSeatPopup";
// import { useNavigate } from "react-router-dom";
// import { useGetAvailableSeatsOfAdminCodeQuery } from "../redux/Api/SeatApi";
// import { useGetServiceQuery } from "../redux/Api/ServiceAPI";
// import { useGetAllPlansQuery } from "../redux/Api/PlansAPI";
// import { useGetAllStudentsQuery } from "../redux/Api/StudentAPI";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useCreateBookingMutation } from "../redux/Api/SeatApi";
// import { decryptData } from "../Utils/Encryption";

// const SeatManagement = () => {
//   const navigate = useNavigate();
//   const [activeFloor, setActiveFloor] = useState("Floor 1");
//   const [activeTime, setActiveTime] = useState("Morning");
//   const [seats, setSeats] = useState([]);
//   const [editSeatPopupOpen, setEditSeatPopupOpen] = useState(false);
//   const [addSeatPopupOpen, setAddSeatPopupOpen] = useState(false);
//   const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
//   const [selectedSeat, setSelectedSeat] = useState(null);
//   const [management, setManagement] = useState({});
//   const encryptedManagement = localStorage.getItem("Management");

//   try {
//     const managementdecryped = decryptData(encryptedManagement);
//     setManagement(managementdecryped);
//     console.log(management);
//   } catch (error) {
//     console.log("Can't decrypt the management data", error);
//   }

//   // API Calls
//   const {
//     data: seatsResponse,
//     isLoading,
//     isError,
//     error,
//   } = useGetAvailableSeatsOfAdminCodeQuery();

//   // Update seats when API data is received
//   useEffect(() => {
//     setSeats(seatsResponse?.data || []);
//   }, [seatsResponse]);

//   const filteredSeats = seats.filter(
//     (seat) => seat.floor === (activeFloor === "Floor 1" ? "1" : "2")
//   );

//   const rows = {};
//   filteredSeats.forEach((seat) => {
//     if (!rows[seat.row]) rows[seat.row] = [];
//     rows[seat.row].push(seat);
//   });

//   const sortedRows = Object.keys(rows)
//     .sort((a, b) => Number(a) - Number(b))
//     .map((rowNum) => ({
//       rowNum,
//       seats: rows[rowNum].sort(
//         (a, b) => Number(a.seatNumber) - Number(b.seatNumber)
//       ),
//     }));

//   const handleSeatClick = (seat) => {
//     setSelectedSeat(seat);
//     setIsBookingFormOpen(true);
//   };

//   const handleBookingSuccess = (bookingData) => {
//     console.log("Booking successful:", bookingData);
//     setIsBookingFormOpen(false);
//     setSelectedSeat(null);
//   };

//   // SEAT BOX COMPONENT WITH SPLIT COLORS
//   const SeatBox = ({ seat }) => {
//     const { bookedForMorning, bookedForEvening, bookedForFullDay } = seat;

//     const isFullDayBooked = bookedForFullDay;
//     const isMorningBooked = bookedForMorning && !bookedForFullDay;
//     const isEveningBooked = bookedForEvening && !bookedForFullDay;
//     const isBothBooked =
//       bookedForMorning && bookedForEvening && !bookedForFullDay;
//     const isVacant =
//       !bookedForMorning && !bookedForEvening && !bookedForFullDay;

//     const isHighlighted =
//       (activeTime === "Morning" && bookedForMorning) ||
//       (activeTime === "Evening" && bookedForEvening) ||
//       (activeTime === "Full Day" && bookedForFullDay);

//     return (
//       <div
//         className="relative w-14 h-14 rounded-md shadow overflow-hidden cursor-pointer hover:opacity-80 transition"
//         onClick={() => handleSeatClick(seat)}
//       >
//         {isFullDayBooked && (
//           <div className="w-full h-full bg-red-600 flex items-center justify-center">
//             <img src={ChairIcon} alt="Chair" className="w-9 h-9" />
//           </div>
//         )}

//         {isBothBooked && (
//           <div className="w-full h-full bg-red-600 flex items-center justify-center">
//             <img src={ChairIcon} alt="Chair" className="w-9 h-9" />
//           </div>
//         )}

//         {isMorningBooked && !bookedForEvening && (
//           <div className="w-full h-full flex flex-col">
//             <div className="w-full h-1/2 bg-red-600"></div>
//             <div className="w-full h-1/2 bg-white flex items-start justify-center">
//               <div className="-translate-y-1/2">
//                 <img src={ChairIcon} alt="Chair" className="w-9 h-9" />
//               </div>
//             </div>
//           </div>
//         )}

//         {isEveningBooked && !bookedForMorning && (
//           <div className="w-full h-full flex flex-col">
//             <div className="w-full h-1/2 bg-white flex items-end justify-center">
//               <div className="translate-y-1/2">
//                 <img src={ChairIcon} alt="Chair" className="w-9 h-9" />
//               </div>
//             </div>
//             <div className="w-full h-1/2 bg-red-600"></div>
//           </div>
//         )}

//         {isVacant && (
//           <div className="w-full h-full bg-gray-200 text-gray-700 flex items-center justify-center">
//             <img src={ChairIcon} alt="Chair" className="w-9 h-9" />
//           </div>
//         )}

//         {isHighlighted && (
//           <div className="absolute inset-0 border-2 border-blue-500 rounded-md pointer-events-none"></div>
//         )}
//       </div>
//     );
//   };

//   if (isLoading) return <p>Loading seats...</p>;
//   if (isError) return <p>Error fetching seats: {JSON.stringify(error)}</p>;

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       {/* Top Bar */}
//       <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4 mb-4 px-4 sm:px-6 relative w-full">
//         <div className="flex flex-1 flex-wrap items-center gap-4">
//           <div className="flex gap-2 flex-wrap bg-[#0073FF0F] p-3 rounded-lg -ml-4">
//             {["Floor 1", "Floor 2"].map((floor) => (
//               <button
//                 key={floor}
//                 className={`px-4 py-1.5 rounded-lg font-semibold whitespace-nowrap ${
//                   activeFloor === floor
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 text-gray-700"
//                 }`}
//                 onClick={() => setActiveFloor(floor)}
//               >
//                 {floor}
//               </button>
//             ))}
//           </div>

//           <div className="flex gap-4 flex-wrap text-sm">
//             <div className="flex items-center gap-3">
//               <span className="w-5 h-5 bg-red-600 rounded"></span>Full Day
//               Booked
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-5 h-5 rounded overflow-hidden flex flex-col">
//                 <div className="h-1/2 bg-red-600"></div>
//                 <div className="h-1/2 bg-white"></div>
//               </div>
//               Morning Booked
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-5 h-5 rounded overflow-hidden flex flex-col">
//                 <div className="h-1/2 bg-white"></div>
//                 <div className="h-1/2 bg-red-600"></div>
//               </div>
//               Evening Booked
//             </div>
//             <div className="flex items-center gap-3">
//               <span className="w-5 h-5 bg-gray-200 rounded"></span>Vacant
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
//           <button
//             onClick={() => setEditSeatPopupOpen(true)}
//             className="bg-[#059500] text-white px-3 py-1.5 rounded-lg whitespace-nowrap"
//           >
//             + Edit Seat
//           </button>
//           <button
//             onClick={() => setAddSeatPopupOpen(true)}
//             className="bg-[#059500] text-white px-3 py-1.5 rounded-lg whitespace-nowrap"
//           >
//             + Add Seat
//           </button>

//           <button
//             onClick={() => navigate("/bookingdetails")}
//             className="text-black font-medium flex items-center gap-2 px-3 py-1 whitespace-nowrap"
//           >
//             View Bookings Info <span className="text-lg">›</span>
//           </button>
//         </div>
//       </div>

//       {/* Time Buttons */}
//       <div className="overflow-x-auto scrollbar-hide mb-6 max-w-full">
//         <div className="bg-gray-100 text-[#797878] rounded py-2 px-2 flex gap-4 whitespace-nowrap">
//           {["Morning", "Evening", "Full Day"].map((time) => (
//             <button
//               key={time}
//               onClick={() => setActiveTime(time)}
//               className={`px-4 py-1.5 rounded-lg font-semibold ${
//                 activeTime === time
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               {time}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Seats Grid */}
//       <div className="w-full flex flex-col gap-4 mt-4">
//         {sortedRows.map(({ rowNum, seats }) => (
//           <div key={rowNum} className="flex items-center gap-4 ml-7">
//             <div className="w-10 text-sm font-semibold text-blue-600 flex-shrink-0">
//               R {rowNum}
//             </div>

//             <div className="flex gap-11 flex-wrap">
//               {seats.map((seat) => (
//                 <div key={seat._id} className="flex items-center gap-2">
//                   <span className="text-[12px] font-semibold">
//                     {seat.seatNumber}
//                   </span>
//                   <SeatBox seat={seat} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Booking Form Popup */}
//       {isBookingFormOpen && selectedSeat && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
//           <div className="relative">
//             <button
//               onClick={() => {
//                 setIsBookingFormOpen(false);
//                 setSelectedSeat(null);
//               }}
//               className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <ConfirmBooking
//               seatId={selectedSeat._id}
//               seatData={selectedSeat}
//               seatNumber={selectedSeat.seatNumber}
//               onConfirm={handleBookingSuccess}
//               management={management}
//             />
//           </div>
//         </div>
//       )}

//       {/* Other Popups */}
//       <EditSeatPopup
//         isOpen={editSeatPopupOpen}
//         onClose={() => setEditSeatPopupOpen(false)}
//       />
//       <AddSeatPopup
//         isOpen={addSeatPopupOpen}
//         onClose={() => setAddSeatPopupOpen(false)}
//       />
//     </div>
//   );
// };

// // export default SeatManagement;

// const ConfirmBooking = ({
//   seatId,
//   seatData,
//   seatNumber,
//   onConfirm,
//   // management,
// }) => {
//   const { data: addons } = useGetServiceQuery();
//   const { data: users2, isLoading: isLoadindGetAllStudents } =
//     useGetAllStudentsQuery();

//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     if (users2?.students) {
//       setUsers(users2.students);
//     }
//   }, [users2]);

//   const { data } = useGetAllPlansQuery();
//   const plans = Array.isArray(data?.message) ? data.message : [];

//   const [durationOptions, setDurationOptions] = useState([]);
//   const [addonPrice, setAddonPrice] = useState(0);
//   const [planPrice, setPlanPrice] = useState(0);
//   const [originalPrice, setOriginalPrice] = useState(0);
//   const [discountInfo, setDiscountInfo] = useState(null);
//   const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState(null);
//   const [aadhaarBackPreview, setAadhaarBackPreview] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   const [bookSeat, { isLoading }] = useCreateBookingMutation();

//   // Validation Schema
//   const validationSchema = Yup.object({
//     selectedUser: Yup.object().nullable().required("Please select a student"),
//     selectedPlanOptionId: Yup.string().required("Please select a plan"),
//     selectedDuration: Yup.string().required("Please select duration"),
//     aadhaarFront: Yup.mixed().required("Aadhaar front is required"),
//     aadhaarBack: Yup.mixed().required("Aadhaar back is required"),
//   });

//   // Formik initialization
//   const formik = useFormik({
//     initialValues: {
//       selectedUser: null,
//       selectedPlanOptionId: "",
//       selectedPlanType: "",
//       selectedPlanId: "",
//       selectedTime: "",
//       selectedHalfDayTiming: "",
//       selectedAddonId: "",
//       selectedDuration: "",
//       addonQuantity: 1,
//       aadhaarFront: null,
//       aadhaarBack: null,
//     },

//     validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const selectedOption = durationOptions.find(
//           (o) => o.pass._id === values.selectedDuration
//         );
//         if (!selectedOption) {
//           alert("Please select a valid duration!");
//           return;
//         }

//         const fd = new FormData();

//         // Required fields as per API spec
//         fd.append("user[_id]", values.selectedUser._id);
//         fd.append("seatNo", seatData?.seatNumber || seatNumber);
//         fd.append("planId", values.selectedPlanId);
//         fd.append("amount", originalPrice);
//         fd.append("discountedAmount", planPrice + totalAddonAmount);
//         fd.append("duration", selectedOption.pass.passType.name);
//         fd.append("timings", values.selectedTime);

//         // Aadhaar files
//         if (values.aadhaarFront) fd.append("adharF", values.aadhaarFront);
//         if (values.aadhaarBack) fd.append("adharB", values.aadhaarBack);

//         // Log FormData for debugging
//         console.log("FormData being sent:");
//         for (let [key, value] of fd.entries()) {
//           console.log(key, value);
//         }

//         const response = await bookSeat({ seatId, fd }).unwrap();
//         console.log(response);
//         onConfirm({
//           seatNumber: seatData?.seatNumber,
//           bookingType: values.selectedPlanType,
//           duration: selectedOption.pass.passType.name,
//           paidAmount: {
//             admission: planPrice,
//             addon: totalAddonAmount,
//             total: totalPrice,
//           },
//           timings: values.selectedTime,
//         });

//         alert("Seat Booked Successfully!");
//         formik.resetForm();
//         resetAll();
//       } catch (err) {
//         console.error("Booking error:", err);
//         alert(err?.data?.message || "Booking Failed");
//       }
//     },
//   });

//   const totalAddonAmount = addonPrice * formik.values.addonQuantity;
//   const totalPrice = totalAddonAmount + planPrice;

//   const getDurationMonths = (name) => {
//     if (name.endsWith("months")) return parseInt(name.slice(0, -6), 10);
//     if (name.endsWith("month")) return 1;
//     return null;
//   };

//   // Filter users based on search query
//   useEffect(() => {
//     if (users && Array.isArray(users)) {
//       if (searchQuery.trim() === "") {
//         setFilteredUsers([]);
//       } else {
//         const filtered = users.filter(
//           (user) =>
//             user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             user.phone?.includes(searchQuery) ||
//             user.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             user.managementId == "management?._id"
//         );
//         setFilteredUsers(filtered);
//       }
//     }
//   }, [searchQuery, users]);

//   useEffect(() => {
//     if (formik.values.selectedDuration) {
//       const option = durationOptions.find(
//         (o) => o.pass._id === formik.values.selectedDuration
//       );
//       if (option) {
//         formik.setFieldValue("selectedPlanId", option.plan._id);
//         const base = option.pass.passType.price;
//         setOriginalPrice(base);

//         const dur = getDurationMonths(option.pass.passType.name);
//         let finalPrice = base;
//         let discount = null;

//         if (dur !== null && formik.values.selectedPlanType === "fullday") {
//           discount = option.plan.discounts.find(
//             (d) => d.duration === dur.toString()
//           );
//           if (discount) {
//             const saved = Math.round(base * (discount.discountPercent / 100));
//             finalPrice = base - saved;
//             setDiscountInfo({
//               percent: discount.discountPercent,
//               amount: saved,
//             });
//           } else {
//             setDiscountInfo(null);
//           }
//         } else {
//           setDiscountInfo(null);
//         }
//         setPlanPrice(finalPrice);
//       }
//     } else {
//       setPlanPrice(0);
//       setOriginalPrice(0);
//       setDiscountInfo(null);
//     }
//   }, [
//     formik.values.selectedDuration,
//     durationOptions,
//     formik.values.selectedPlanType,
//   ]);

//   const handleAddonChange = (e) => {
//     const addonId = e.target.value;
//     formik.setFieldValue("selectedAddonId", addonId);
//     const addon = addons.find((a) => a._id === addonId);
//     if (addon) {
//       setAddonPrice(Number(addon.price));
//       formik.setFieldValue("addonQuantity", 1);
//     } else {
//       setAddonPrice(0);
//       formik.setFieldValue("addonQuantity", 1);
//     }
//   };

//   const handleTimeChange = (e) => {
//     const selectedId = e.target.value;
//     const selectedPlan = plans.find((p) => p._id === selectedId);

//     if (!selectedPlan) {
//       formik.setFieldValue("selectedPlanId", "");
//       formik.setFieldValue("selectedPlanType", "");
//       setDurationOptions([]);
//       return;
//     }

//     formik.setFieldValue("selectedPlanId", selectedPlan._id);
//     formik.setFieldValue("selectedPlanType", selectedPlan.planType);

//     formik.setFieldValue("selectedTime", "");
//     formik.setFieldValue("selectedHalfDayTiming", "");
//     setDurationOptions([]);
//     setPlanPrice(0);
//     setOriginalPrice(0);
//     setDiscountInfo(null);
//     formik.setFieldValue("selectedDuration", "");

//     if (selectedPlan.planType === "fullday") {
//       formik.setFieldValue("selectedTime", "fullday");
//       const opts = plans
//         .filter((p) => p.planType === "fullday")
//         .flatMap((p) => p.pass.map((pass) => ({ plan: p, pass })));
//       setDurationOptions(opts);
//       if (opts.length === 1)
//         formik.setFieldValue("selectedDuration", opts[0].pass._id);
//     }

//     if (selectedPlan.planType === "halfday") {
//       const timing = selectedPlan.morningTime ? "morning" : "evening";
//       formik.setFieldValue("selectedHalfDayTiming", timing);
//       formik.setFieldValue("selectedTime", timing);
//       const opts = plans
//         .filter(
//           (p) =>
//             p.planType === "halfday" &&
//             ((timing === "morning" && p.morningTime) ||
//               (timing === "evening" && p.eveningTime))
//         )
//         .flatMap((p) => p.pass.map((pass) => ({ plan: p, pass })));
//       setDurationOptions(opts);
//       if (opts.length === 1)
//         formik.setFieldValue("selectedDuration", opts[0].pass._id);
//     }
//   };

//   const handleFileChange = (e, type) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (type === "front") {
//         formik.setFieldValue("aadhaarFront", file);
//         const reader = new FileReader();
//         reader.onloadend = () => setAadhaarFrontPreview(reader.result);
//         reader.readAsDataURL(file);
//       } else {
//         formik.setFieldValue("aadhaarBack", file);
//         const reader = new FileReader();
//         reader.onloadend = () => setAadhaarBackPreview(reader.result);
//         reader.readAsDataURL(file);
//       }
//     }
//   };

//   const resetAll = () => {
//     setDurationOptions([]);
//     setAddonPrice(0);
//     setPlanPrice(0);
//     setOriginalPrice(0);
//     setDiscountInfo(null);
//     setAadhaarFrontPreview(null);
//     setAadhaarBackPreview(null);
//     setSearchQuery("");
//     setFilteredUsers([]);
//   };

//   return (
//     <form onSubmit={formik.handleSubmit} className="w-full max-w-[600px]">
//       <div className="bg-white shadow-md rounded-2xl w-full mx-auto p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto flex flex-col">
//         <div className="text-center mb-5 sm:mb-6">
//           <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
//             Confirm Your Seat Booking
//           </h2>
//           <p className="text-gray-400 text-xs sm:text-sm mt-1">
//             Fill the details below to complete your booking
//           </p>
//         </div>

//         <div className="space-y-5 flex-1">
//           {/* Selected Seat */}
//           <div>
//             <label className="block text-gray-700 text-sm mb-1 font-semibold">
//               Selected Seat
//             </label>
//             <div className="bg-blue-600 text-white rounded-md px-3 py-2 text-sm">
//               {seatData ? `Seat No ${seatData.seatNumber}` : "No seat selected"}
//             </div>
//           </div>

//           {/* User Search Section */}
//           <div>
//             <label className="block text-gray-700 text-sm mb-1 font-semibold">
//               Search Student
//             </label>

//             {isLoadindGetAllStudents ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <span className="ml-3 text-gray-600">Loading students...</span>
//               </div>
//             ) : (
//               <>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search by name, email, phone, or student ID"
//                     className="w-full rounded-md px-3 py-2 border border-gray-300 text-sm pr-10"
//                   />
//                   {searchQuery && (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSearchQuery("");
//                         setFilteredUsers([]);
//                       }}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       ✕
//                     </button>
//                   )}
//                 </div>

//                 {formik.values.selectedUser && (
//                   <div className="mt-2 bg-blue-50 border border-blue-200 rounded-md p-3">
//                     <div className="flex justify-between items-start">
//                       <div className="text-sm">
//                         <p className="font-semibold text-blue-900">
//                           {formik.values.selectedUser.name}
//                         </p>
//                         <p className="text-gray-600">
//                           {formik.values.selectedUser.email}
//                         </p>
//                         {formik.values.selectedUser.phone && (
//                           <p className="text-gray-600">
//                             Phone: {formik.values.selectedUser.phone}
//                           </p>
//                         )}
//                         {formik.values.selectedUser.studentId && (
//                           <p className="text-gray-600">
//                             ID: {formik.values.selectedUser.studentId}
//                           </p>
//                         )}
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() =>
//                           formik.setFieldValue("selectedUser", null)
//                         }
//                         className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                       >
//                         Change
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {searchQuery &&
//                   !formik.values.selectedUser &&
//                   filteredUsers.length > 0 && (
//                     <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-lg">
//                       {filteredUsers.map((user) => (
//                         <div
//                           key={user._id}
//                           onClick={() => {
//                             formik.setFieldValue("selectedUser", user);
//                             setSearchQuery("");
//                             setFilteredUsers([]);
//                           }}
//                           className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                         >
//                           <p className="font-medium text-sm text-gray-900">
//                             {user.name}
//                           </p>
//                           <p className="text-xs text-gray-600">{user.email}</p>
//                           {user.phone && (
//                             <p className="text-xs text-gray-500">
//                               Phone: {user.phone}
//                             </p>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                 {searchQuery &&
//                   !formik.values.selectedUser &&
//                   filteredUsers.length === 0 && (
//                     <p className="mt-2 text-sm text-gray-500">
//                       No students found
//                     </p>
//                   )}

//                 {formik.touched.selectedUser && formik.errors.selectedUser && (
//                   <p className="text-red-500 text-sm mt-1 font-bold">
//                     {formik.errors.selectedUser}
//                   </p>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Plan Selection */}
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-gray-700 text-sm mb-1 font-semibold">
//                   Select Plan Type
//                 </label>
//                 <select
//                   name="selectedPlanOptionId"
//                   className="w-full rounded-md px-3 py-2 border border-gray-300 text-sm"
//                   onChange={(e) => {
//                     formik.handleChange(e);
//                     handleTimeChange(e);
//                   }}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.selectedPlanOptionId}
//                 >
//                   <option value="">Select Plan</option>
//                   {plans.map((plan) => {
//                     let label =
//                       plan.planType === "fullday"
//                         ? "Full Day"
//                         : plan.morningTime
//                         ? `Half Day (Morning - ${plan.morningTime})`
//                         : `Half Day (Evening - ${plan.eveningTime})`;
//                     return (
//                       <option key={plan._id} value={plan._id}>
//                         {label}
//                       </option>
//                     );
//                   })}
//                 </select>
//                 {formik.touched.selectedPlanOptionId &&
//                   formik.errors.selectedPlanOptionId && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {formik.errors.selectedPlanOptionId}
//                     </p>
//                   )}
//               </div>

//               {formik.values.selectedPlanType === "halfday" && (
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-1 font-semibold">
//                     Timing (Auto-selected)
//                   </label>
//                   <select
//                     value={formik.values.selectedHalfDayTiming}
//                     disabled
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
//                   >
//                     <option>
//                       {formik.values.selectedHalfDayTiming === "morning"
//                         ? "Morning"
//                         : "Evening"}
//                     </option>
//                   </select>
//                 </div>
//               )}
//             </div>

//             {(formik.values.selectedPlanType === "fullday" ||
//               (formik.values.selectedPlanType === "halfday" &&
//                 formik.values.selectedHalfDayTiming)) && (
//               <div>
//                 <label className="block text-gray-700 text-sm mb-1 font-semibold">
//                   Select Duration
//                 </label>
//                 <select
//                   name="selectedDuration"
//                   value={formik.values.selectedDuration}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
//                 >
//                   <option value="">Select Duration</option>
//                   {durationOptions.map((opt) => {
//                     const dur = getDurationMonths(opt.pass.passType.name);
//                     const discount =
//                       dur && formik.values.selectedPlanType === "fullday"
//                         ? opt.plan.discounts.find(
//                             (d) => d.duration === dur.toString()
//                           )
//                         : null;
//                     const discountText = discount
//                       ? ` (${discount.discountPercent}% off)`
//                       : "";
//                     return (
//                       <option key={opt.pass._id} value={opt.pass._id}>
//                         {opt.pass.passType.name} - ₹{opt.pass.passType.price}
//                         {discountText}
//                       </option>
//                     );
//                   })}
//                 </select>
//                 {formik.touched.selectedDuration &&
//                   formik.errors.selectedDuration && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {formik.errors.selectedDuration}
//                     </p>
//                   )}
//               </div>
//             )}

//             {discountInfo && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
//                 <p className="text-green-800 font-medium">
//                   Discount Applied: <strong>{discountInfo.percent}%</strong> (₹
//                   {discountInfo.amount} saved)
//                 </p>
//                 <p className="text-gray-600">
//                   Original: <del>₹{originalPrice}</del> → Final:{" "}
//                   <strong>₹{planPrice}</strong>
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Aadhaar Upload */}
//           <div className="bg-gray-100 rounded-xl p-4 sm:p-5 space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {["front", "back"].map((type) => {
//                 const label =
//                   type === "front" ? "Aadhaar front" : "Aadhaar back";
//                 const preview =
//                   type === "front" ? aadhaarFrontPreview : aadhaarBackPreview;
//                 const fieldName =
//                   type === "front" ? "aadhaarFront" : "aadhaarBack";

//                 return (
//                   <div key={type} className="space-y-2">
//                     <label className="block text-gray-700 text-sm mb-1 font-semibold">
//                       Upload {label}
//                     </label>

//                     <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleFileChange(e, type)}
//                         className="hidden"
//                       />

//                       {preview ? (
//                         <img
//                           src={preview}
//                           alt={label}
//                           className="w-full h-full object-cover rounded-lg"
//                         />
//                       ) : (
//                         <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                           <Upload className="w-8 h-8 mb-2 text-gray-400" />
//                           <p className="text-xs text-gray-500">
//                             Click to upload
//                           </p>
//                         </div>
//                       )}
//                     </label>

//                     {formik.touched[fieldName] && formik.errors[fieldName] && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {formik.errors[fieldName]}
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Addon */}
//           <div>
//             <label className="block text-gray-700 text-sm mb-1 font-semibold">
//               Add On Service (Optional)
//             </label>
//             <select
//               name="selectedAddonId"
//               value={formik.values.selectedAddonId}
//               onChange={handleAddonChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             >
//               <option value="">Select Service</option>
//               {addons &&
//                 addons.map((a) => (
//                   <option key={a._id} value={a._id}>
//                     {a.serviceName}{" "}
//                     {a.availability !== undefined &&
//                       `(Avail: ${a.availability})`}
//                   </option>
//                 ))}
//             </select>

//             {formik.values.selectedAddonId && (
//               <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-1 font-semibold">
//                     Quantity
//                   </label>
//                   <input
//                     type="number"
//                     name="addonQuantity"
//                     min={1}
//                     value={formik.values.addonQuantity}
//                     onChange={formik.handleChange}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-1 font-semibold">
//                     Amount
//                   </label>
//                   <input
//                     type="number"
//                     value={totalAddonAmount}
//                     readOnly
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-sm"
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-between items-center mt-5">
//               <p className="text-gray-700 font-semibold">Total Price :</p>
//               <p className="text-green-700 text-lg font-bold">₹{totalPrice}</p>
//             </div>
//           </div>
//         </div>

//         {/* SUBMIT BUTTON */}
//         <div className="text-center mt-6">
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="bg-[#059500] text-white font-semibold rounded-md px-8 py-3 hover:bg-green-700 transition disabled:opacity-50 text-base"
//           >
//             {isLoading ? "Booking..." : "Confirm Booking"}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default SeatManagement;

import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import ChairIcon from "/seat.svg";
import EditSeatPopup from "../components/EditSitPopup";
import AddSeatPopup from "../components/AddSeatPopup";
import { useNavigate } from "react-router-dom";
import { useGetAvailableSeatsOfAdminCodeQuery } from "../redux/Api/SeatApi";
import { useGetServiceQuery } from "../redux/Api/ServiceAPI";
import { useGetAllPlansQuery } from "../redux/Api/PlansAPI";
import { useGetAllStudentsQuery } from "../redux/Api/StudentAPI";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateBookingMutation } from "../redux/Api/SeatApi";
import { decryptData } from "../Utils/Encryption";
import { IoClose } from "react-icons/io5";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";


const SeatManagement = () => {
  const navigate = useNavigate();
  const [activeFloor, setActiveFloor] = useState("Floor 1");
  const [activeTime, setActiveTime] = useState("Morning");
  const [seats, setSeats] = useState([]);
  const [editSeatPopupOpen, setEditSeatPopupOpen] = useState(false);
  const [addSeatPopupOpen, setAddSeatPopupOpen] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);



  const [management, setManagement] = useState(() => {
    const encryptedManagement = localStorage.getItem("Management");
    try {
      return encryptedManagement ? decryptData(encryptedManagement) : {};
    } catch (error) {
      console.log("Can't decrypt the management data", error);
      return {};
    }
  });



  // API Calls
  const {
    data: seatsResponse,
    isLoading,
    isError,
    error,
  } = useGetAvailableSeatsOfAdminCodeQuery();

  // Update seats when API data is received
  useEffect(() => {
    setSeats(seatsResponse?.data || []);
  }, [seatsResponse]);

  const filteredSeats = seats.filter(
    (seat) => seat.floor === (activeFloor === "Floor 1" ? "1" : "2")
  );

  const rows = {};
  filteredSeats.forEach((seat) => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });

  const sortedRows = Object.keys(rows)
    .sort((a, b) => Number(a) - Number(b))
    .map((rowNum) => ({
      rowNum,
      seats: rows[rowNum].sort(
        (a, b) => Number(a.seatNumber) - Number(b.seatNumber)
      ),
    }));

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setIsBookingFormOpen(true);
  };

  const handleBookingSuccess = (bookingData) => {
    setSuccessBooking(bookingData);
    setSuccessModalOpen(true);     // POPUP OPEN
    setIsBookingFormOpen(false);
    setSelectedSeat(null);
  };


  // SEAT BOX COMPONENT WITH SPLIT COLORS
  const SeatBox = ({ seat }) => {
    const { bookedForMorning, bookedForEvening, bookedForFullDay } = seat;

    const isFullDayBooked = bookedForFullDay;
    const isMorningBooked = bookedForMorning && !bookedForFullDay;
    const isEveningBooked = bookedForEvening && !bookedForFullDay;
    const isBothBooked =
      bookedForMorning && bookedForEvening && !bookedForFullDay;
    const isVacant =
      !bookedForMorning && !bookedForEvening && !bookedForFullDay;

    const isHighlighted =
      (activeTime === "Morning" && bookedForMorning) ||
      (activeTime === "Evening" && bookedForEvening) ||
      (activeTime === "Full Day" && bookedForFullDay);

    return (
      <div
        className="relative w-14 h-14 rounded-md shadow overflow-hidden cursor-pointer hover:opacity-80 transition"
        onClick={() => handleSeatClick(seat)}
      >
        {isFullDayBooked && (
          <div className="w-full h-full bg-red-600 flex items-center justify-center">
            <img src={ChairIcon} alt="Chair" className="w-9 h-9" />
          </div>
        )}

        {isBothBooked && (
          <div className="w-full h-full bg-red-600 flex items-center justify-center">
            <img src={ChairIcon} alt="Chair" className="w-9 h-9" />
          </div>
        )}

        {isMorningBooked && !bookedForEvening && (
          <div className="w-full h-full flex flex-col">
            <div className="w-full h-1/2 bg-red-600"></div>
            <div className="w-full h-1/2 bg-white flex items-start justify-center">
              <div className="-translate-y-1/2">
                <img src={ChairIcon} alt="Chair" className="w-9 h-9" />
              </div>
            </div>
          </div>
        )}

        {isEveningBooked && !bookedForMorning && (
          <div className="w-full h-full flex flex-col">
            <div className="w-full h-1/2 bg-white flex items-end justify-center">
              <div className="translate-y-1/2">
                <img src={ChairIcon} alt="Chair" className="w-9 h-9" />
              </div>
            </div>
            <div className="w-full h-1/2 bg-red-600"></div>
          </div>
        )}

        {isVacant && (
          <div className="w-full h-full bg-gray-200 text-gray-700 flex items-center justify-center">
            <img src={ChairIcon} alt="Chair" className="w-9 h-9" />
          </div>
        )}

        {isHighlighted && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded-md pointer-events-none"></div>
        )}


      </div>


    );
  };

  if (isLoading) return <p>Loading seats...</p>;
  if (isError) return <p>Error fetching seats: {JSON.stringify(error)}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4 mb-4 px-4 sm:px-6 relative w-full">
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <div className="flex gap-2 flex-wrap bg-[#0073FF0F] p-3 rounded-lg -ml-4">
            {["Floor 1", "Floor 2"].map((floor) => (
              <button
                key={floor}
                className={`px-4 py-1.5 rounded-lg font-semibold whitespace-nowrap ${activeFloor === floor
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                  }`}
                onClick={() => setActiveFloor(floor)}
              >
                {floor}
              </button>
            ))}
          </div>

          <div className="flex gap-4 flex-wrap text-sm">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 bg-red-600 rounded"></span>Full Day
              Booked
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded overflow-hidden flex flex-col">
                <div className="h-1/2 bg-red-600"></div>
                <div className="h-1/2 bg-white"></div>
              </div>
              Morning Booked
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded overflow-hidden flex flex-col">
                <div className="h-1/2 bg-white"></div>
                <div className="h-1/2 bg-red-600"></div>
              </div>
              Evening Booked
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 bg-gray-200 rounded"></span>Vacant
            </div>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <button
            onClick={() => setEditSeatPopupOpen(true)}
            className="bg-[#059500] text-white px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            + Edit Seat
          </button>
          <button
            onClick={() => setAddSeatPopupOpen(true)}
            className="bg-[#059500] text-white px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            + Add Seat
          </button>

          <button
            onClick={() => navigate("/bookingdetails")}
            className="text-black font-medium flex items-center gap-2 px-3 py-1 whitespace-nowrap"
          >
            View Bookings Info <span className="text-lg">›</span>
          </button>
        </div>
      </div>

      {/* Time Buttons */}
      <div className="overflow-x-auto scrollbar-hide mb-6 max-w-full">
        <div className="bg-gray-100 text-[#797878] rounded py-2 px-2 flex gap-4 whitespace-nowrap">
          {["Morning", "Evening", "Full Day"].map((time) => (
            <button
              key={time}
              onClick={() => setActiveTime(time)}
              className={`px-4 py-1.5 rounded-lg font-semibold ${activeTime === time
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Seats Grid */}
      <div className="w-full flex flex-col gap-4 mt-4">
        {sortedRows.map(({ rowNum, seats }) => (
          <div key={rowNum} className="flex items-center gap-4 ml-7">
            <div className="w-10 text-sm font-semibold text-blue-600 flex-shrink-0">
              R {rowNum}
            </div>

            <div className="flex gap-11 flex-wrap">
              {seats.map((seat) => (
                <div key={seat._id} className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold">
                    {seat.seatNumber}
                  </span>
                  <SeatBox seat={seat} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Popup */}
      {isBookingFormOpen && selectedSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="relative">
            <button
              onClick={() => {
                setIsBookingFormOpen(false);
                setSelectedSeat(null);
              }}
              className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <ConfirmBooking
              seatId={selectedSeat._id}
              seatData={selectedSeat}
              seatNumber={selectedSeat.seatNumber}
              onConfirm={handleBookingSuccess}
              management={management}
            />
          </div>
        </div>
      )}

      {/* Other Popups */}
      <EditSeatPopup
        isOpen={editSeatPopupOpen}
        onClose={() => setEditSeatPopupOpen(false)}
      />
      <AddSeatPopup
        isOpen={addSeatPopupOpen}
        onClose={() => setAddSeatPopupOpen(false)}
      />
      {successModalOpen && successBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SuccessPage
            booking={successBooking}
            onClose={() => setSuccessModalOpen(false)}
          />
        </div>
      )}

    </div>
  );
};

const ConfirmBooking = ({
  seatId,
  seatData,
  seatNumber,
  onConfirm,
  management,
}) => {
  const { data: addons } = useGetServiceQuery();
  const { data: users2, isLoading: isLoadindGetAllStudents } =
    useGetAllStudentsQuery();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (users2?.students) {
      // FIX: Filter students locally by management ID
      const filteredStudents = users2.students.filter(
        (user) => user.managementId === management?._id
      );
      setUsers(filteredStudents);
    }
  }, [users2, management?._id]); // Add management._id as dependency

  const { data } = useGetAllPlansQuery();
  const plans = Array.isArray(data?.message) ? data.message : [];

  const [durationOptions, setDurationOptions] = useState([]);
  const [addonPrice, setAddonPrice] = useState(0);
  const [planPrice, setPlanPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState(null);
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);


  const [bookSeat, { isLoading }] = useCreateBookingMutation();

  // Validation Schema
  const validationSchema = Yup.object({
    selectedUser: Yup.object().nullable().required("Please select a student"),
    selectedPlanOptionId: Yup.string().required("Please select a plan"),
    selectedDuration: Yup.string().required("Please select duration"),
    aadhaarFront: Yup.mixed().required("Aadhaar front is required"),
    aadhaarBack: Yup.mixed().required("Aadhaar back is required"),
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      selectedUser: null,
      selectedPlanOptionId: "",
      selectedPlanType: "",
      selectedPlanId: "",
      selectedTime: "",
      selectedHalfDayTiming: "",
      selectedAddonId: "",
      selectedDuration: "",
      addonQuantity: 1,
      aadhaarFront: null,
      aadhaarBack: null,
    },

    validationSchema,
    onSubmit: async (values) => {
      try {
        // console.log(values);

        const selectedOption = durationOptions.find(
          (o) => o.pass._id === values.selectedDuration
        );
        if (!selectedOption) {
          alert("Please select a valid duration!");
          return;
        }

        const fd = new FormData();

        // Required fields as per API spec
        fd.append("user[_id]", values.selectedUser._id);
        fd.append("seatNo", seatData?.seatNumber || seatNumber);
        fd.append("planId", values.selectedPlanId);
        fd.append("amount", originalPrice);
        fd.append("discountedAmount", planPrice + totalAddonAmount);
        fd.append("duration", selectedOption.pass.passType.name);
        fd.append("timings", values.selectedTime);
        fd.append("addOnServiceId", values.selectedAddonId)
        fd.append("addOnServiceQuantity", values.addonQuantity)

        // Aadhaar files
        if (values.aadhaarFront) fd.append("adharF", values.aadhaarFront);
        if (values.aadhaarBack) fd.append("adharB", values.aadhaarBack);


        // Log FormData for debugging
        console.log("FormData being sent:");
        for (let [key, value] of fd.entries()) {
          console.log(key, value);
        }

        console.log("FD => ", fd);
        const response = await bookSeat({ seatId, fd }).unwrap();
        console.log(response);
        // onConfirm({
        //   seatNumber: seatData?.seatNumber,
        //   bookingType: values.selectedPlanType,
        //   duration: selectedOption.pass.passType.name,
        //   paidAmount: {
        //     admission: planPrice,
        //     addon: totalAddonAmount,
        //     total: totalPrice,
        //   },
        //   timings: values.selectedTime,
        // });

        onConfirm(response.booking || response.data || response);


        alert("Seat Booked Successfully!");
        formik.resetForm();
        resetAll();
      } catch (err) {
        console.error("Booking error:", err);
        alert(err?.data?.message || "Booking Failed");
      }
    },
  });

  const totalAddonAmount = addonPrice * formik.values.addonQuantity;
  const totalPrice = totalAddonAmount + planPrice;

  const getDurationMonths = (name) => {
    if (name.endsWith("months")) return parseInt(name.slice(0, -6), 10);
    if (name.endsWith("month")) return 1;
    return null;
  };

  useEffect(() => {
    if (users && Array.isArray(users)) {
      if (searchQuery.trim() === "") {
        setFilteredUsers([]);
      } else {
        const filtered = users.filter(
          (user) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone?.includes(searchQuery) ||
            user.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    }
  }, [searchQuery, users]);

  useEffect(() => {
    if (formik.values.selectedDuration) {
      const option = durationOptions.find(
        (o) => o.pass._id === formik.values.selectedDuration
      );
      if (option) {
        formik.setFieldValue("selectedPlanId", option.plan._id);
        const base = option.pass.passType.price;
        setOriginalPrice(base);

        const dur = getDurationMonths(option.pass.passType.name);
        let finalPrice = base;
        let discount = null;

        if (dur !== null && formik.values.selectedPlanType === "fullday") {
          discount = option.plan.discounts.find(
            (d) => d.duration === dur.toString()
          );
          if (discount) {
            const saved = Math.round(base * (discount.discountPercent / 100));
            finalPrice = base - saved;
            setDiscountInfo({
              percent: discount.discountPercent,
              amount: saved,
            });
          } else {
            setDiscountInfo(null);
          }
        } else {
          setDiscountInfo(null);
        }
        setPlanPrice(finalPrice);
      }
    } else {
      setPlanPrice(0);
      setOriginalPrice(0);
      setDiscountInfo(null);
    }
  }, [
    formik.values.selectedDuration,
    durationOptions,
    formik.values.selectedPlanType,
  ]);

  const handleAddonChange = (e) => {
    const addonId = e.target.value;
    formik.setFieldValue("selectedAddonId", addonId);
    const addon = addons?.find((a) => a._id === addonId);
    if (addon) {
      setAddonPrice(Number(addon.price));
      formik.setFieldValue("addonQuantity", 1);
    } else {
      setAddonPrice(0);
      formik.setFieldValue("addonQuantity", 1);
    }
  };

  const handleTimeChange = (e) => {
    const selectedId = e.target.value;
    const selectedPlan = plans.find((p) => p._id === selectedId);

    if (!selectedPlan) {
      formik.setFieldValue("selectedPlanId", "");
      formik.setFieldValue("selectedPlanType", "");
      setDurationOptions([]);
      return;
    }

    formik.setFieldValue("selectedPlanId", selectedPlan._id);
    formik.setFieldValue("selectedPlanType", selectedPlan.planType);

    formik.setFieldValue("selectedTime", "");
    formik.setFieldValue("selectedHalfDayTiming", "");
    setDurationOptions([]);
    setPlanPrice(0);
    setOriginalPrice(0);
    setDiscountInfo(null);
    formik.setFieldValue("selectedDuration", "");

    if (selectedPlan.planType === "fullday") {
      formik.setFieldValue("selectedTime", "fullday");
      const opts = plans
        .filter((p) => p.planType === "fullday")
        .flatMap((p) => p.pass.map((pass) => ({ plan: p, pass })));
      setDurationOptions(opts);
      if (opts.length === 1)
        formik.setFieldValue("selectedDuration", opts[0].pass._id);
    }

    if (selectedPlan.planType === "halfday") {
      const timing = selectedPlan.morningTime ? "morning" : "evening";
      formik.setFieldValue("selectedHalfDayTiming", timing);
      formik.setFieldValue("selectedTime", timing);
      const opts = plans
        .filter(
          (p) =>
            p.planType === "halfday" &&
            ((timing === "morning" && p.morningTime) ||
              (timing === "evening" && p.eveningTime))
        )
        .flatMap((p) => p.pass.map((pass) => ({ plan: p, pass })));
      setDurationOptions(opts);
      if (opts.length === 1)
        formik.setFieldValue("selectedDuration", opts[0].pass._id);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "front") {
        formik.setFieldValue("aadhaarFront", file);
        const reader = new FileReader();
        reader.onloadend = () => setAadhaarFrontPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        formik.setFieldValue("aadhaarBack", file);
        const reader = new FileReader();
        reader.onloadend = () => setAadhaarBackPreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const resetAll = () => {
    setDurationOptions([]);
    setAddonPrice(0);
    setPlanPrice(0);
    setOriginalPrice(0);
    setDiscountInfo(null);
    setAadhaarFrontPreview(null);
    setAadhaarBackPreview(null);
    setSearchQuery("");
    setFilteredUsers([]);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="w-full max-w-[600px]">
      <div className="bg-white shadow-md rounded-2xl w-full mx-auto p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="text-center mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Confirm Your Seat Booking
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Fill the details below to complete your booking
          </p>
        </div>

        <div className="space-y-5 flex-1">
          {/* Selected Seat */}
          <div>
            <label className="block text-gray-700 text-sm mb-1 font-semibold">
              Selected Seat
            </label>
            <div className="bg-blue-600 text-white rounded-md px-3 py-2 text-sm">
              {seatData ? `Seat No ${seatData.seatNumber}` : "No seat selected"}
            </div>
          </div>

          {/* User Search Section */}
          <div>
            <label className="block text-gray-700 text-sm mb-1 font-semibold">
              Search Student
            </label>

            {isLoadindGetAllStudents ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading students...</span>
              </div>
            ) : (
              <>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, phone, or student ID"
                    className="w-full rounded-md px-3 py-2 border border-gray-300 text-sm pr-10"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setFilteredUsers([]);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {formik.values.selectedUser && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div className="text-sm">
                        <p className="font-semibold text-blue-900">
                          {formik.values.selectedUser.name}
                        </p>
                        <p className="text-gray-600">
                          {formik.values.selectedUser.email}
                        </p>
                        {formik.values.selectedUser.phone && (
                          <p className="text-gray-600">
                            Phone: {formik.values.selectedUser.phone}
                          </p>
                        )}
                        {formik.values.selectedUser.studentId && (
                          <p className="text-gray-600">
                            ID: {formik.values.selectedUser.studentId}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          formik.setFieldValue("selectedUser", null)
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                {searchQuery &&
                  !formik.values.selectedUser &&
                  filteredUsers.length > 0 && (
                    <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-lg">
                      {filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => {
                            formik.setFieldValue("selectedUser", user);
                            setSearchQuery("");
                            setFilteredUsers([]);
                          }}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <p className="font-medium text-sm text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                          {user.phone && (
                            <p className="text-xs text-gray-500">
                              Phone: {user.phone}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                {searchQuery &&
                  !formik.values.selectedUser &&
                  filteredUsers.length === 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      No students found
                    </p>
                  )}

                {formik.touched.selectedUser && formik.errors.selectedUser && (
                  <p className="text-red-500 text-sm mt-1 font-bold">
                    {formik.errors.selectedUser}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Plan Selection */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1 font-semibold">
                  Select Plan Type
                </label>
                <select
                  name="selectedPlanOptionId"
                  className="w-full rounded-md px-3 py-2 border border-gray-300 text-sm"
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleTimeChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.selectedPlanOptionId}
                >
                  <option value="">Select Plan</option>
                  {plans.map((plan) => {
                    let label =
                      plan.planType === "fullday"
                        ? "Full Day"
                        : plan.morningTime
                          ? `Half Day (Morning - ${plan.morningTime})`
                          : `Half Day (Evening - ${plan.eveningTime})`;
                    return (
                      <option key={plan._id} value={plan._id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
                {formik.touched.selectedPlanOptionId &&
                  formik.errors.selectedPlanOptionId && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.selectedPlanOptionId}
                    </p>
                  )}
              </div>

              {formik.values.selectedPlanType === "halfday" && (
                <div>
                  <label className="block text-gray-700 text-sm mb-1 font-semibold">
                    Timing (Auto-selected)
                  </label>
                  <select
                    value={formik.values.selectedHalfDayTiming}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                  >
                    <option>
                      {formik.values.selectedHalfDayTiming === "morning"
                        ? "Morning"
                        : "Evening"}
                    </option>
                  </select>
                </div>
              )}
            </div>

            {(formik.values.selectedPlanType === "fullday" ||
              (formik.values.selectedPlanType === "halfday" &&
                formik.values.selectedHalfDayTiming)) && (
                <div>
                  <label className="block text-gray-700 text-sm mb-1 font-semibold">
                    Select Duration
                  </label>
                  <select
                    name="selectedDuration"
                    value={formik.values.selectedDuration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                  >
                    <option value="">Select Duration</option>
                    {durationOptions.map((opt) => {
                      const dur = getDurationMonths(opt.pass.passType.name);
                      const discount =
                        dur && formik.values.selectedPlanType === "fullday"
                          ? opt.plan.discounts.find(
                            (d) => d.duration === dur.toString()
                          )
                          : null;
                      const discountText = discount
                        ? ` (${discount.discountPercent}% off)`
                        : "";
                      return (
                        <option key={opt.pass._id} value={opt.pass._id}>
                          {opt.pass.passType.name} - ₹{opt.pass.passType.price}
                          {discountText}
                        </option>
                      );
                    })}
                  </select>
                  {formik.touched.selectedDuration &&
                    formik.errors.selectedDuration && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.selectedDuration}
                      </p>
                    )}
                </div>
              )}

            {discountInfo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                <p className="text-green-800 font-medium">
                  Discount Applied: <strong>{discountInfo.percent}%</strong> (₹
                  {discountInfo.amount} saved)
                </p>
                <p className="text-gray-600">
                  Original: <del>₹{originalPrice}</del> → Final:{" "}
                  <strong>₹{planPrice}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Aadhaar Upload */}
          <div className="bg-gray-100 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["front", "back"].map((type) => {
                const label =
                  type === "front" ? "Aadhaar front" : "Aadhaar back";
                const preview =
                  type === "front" ? aadhaarFrontPreview : aadhaarBackPreview;
                const fieldName =
                  type === "front" ? "aadhaarFront" : "aadhaarBack";

                return (
                  <div key={type} className="space-y-2">
                    <label className="block text-gray-700 text-sm mb-1 font-semibold">
                      Upload {label}
                    </label>

                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, type)}
                        className="hidden"
                      />

                      {preview ? (
                        <img
                          src={preview}
                          alt={label}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            Click to upload
                          </p>
                        </div>
                      )}
                    </label>

                    {formik.touched[fieldName] && formik.errors[fieldName] && (
                      <p className="text-red-500 text-xs mt-1">
                        {formik.errors[fieldName]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Addon */}
          <div>
            <label className="block text-gray-700 text-sm mb-1 font-semibold">
              Add On Service (Optional)
            </label>
            <select
              name="selectedAddonId"
              value={formik.values.selectedAddonId}
              onChange={handleAddonChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Select Service</option>
              {addons &&
                addons.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.serviceName}{" "}
                    {a.availability !== undefined &&
                      `(Avail: ${a.availability})`}
                  </option>
                ))}
            </select>

            {formik.values.selectedAddonId && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-1 font-semibold">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="addonQuantity"
                    min={1}
                    value={formik.values.addonQuantity}
                    onChange={formik.handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1 font-semibold">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={totalAddonAmount}
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-5">
              <p className="text-gray-700 font-semibold">Total Price :</p>
              <p className="text-green-700 text-lg font-bold">₹{totalPrice}</p>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#059500] text-white font-semibold rounded-md px-8 py-3 hover:bg-green-700 transition disabled:opacity-50 text-base"
          >
            {isLoading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SeatManagement;

export function SuccessPage({ booking, onClose }) {

  console.log(booking);
  
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(34, 139, 34);
    doc.text("Booking Confirmed!", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Your seat is successfully booked", 105, 28, { align: "center" });

    // Logo
    doc.setFillColor(34, 139, 34);
    doc.rect(14, 14, 20, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("StudyLab", 18, 26);

    autoTable(doc, {
      startY: 40,
      head: [["Field", "Details"]],
      body: [
        ["Seat Number", booking?.seatNo || "N/A"],
        ["User Name", booking?.seatNo || "N/A"],
        ["Plan", booking?.timings || "N/A"],
        ["Duration", booking?.duration || "N/A"],
        ["Admission Fee", booking?.amount || 0],
        ["Addon Services", booking?.addOnServiceQuantity || 0],
        ["Total Paid", booking?.discountedAmount || 0],
        ["Booking Date", new Date(booking?.bookingDate).toLocaleDateString()],
        ["Expiry Date", new Date(booking?.expiryDate).toLocaleDateString()],
      ],
      theme: "grid",
    });

    const finalY = doc.lastAutoTable.finalY || 100;
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Thank you for choosing us!", 105, finalY + 20, { align: "center" });

    doc.save(`Receipt_Seat_${booking?.seatNo}.pdf`);
  };

  return (
    <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 font-Outfit text-center relative border border-green-100">

      <button onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
        <IoClose size={28} />
      </button>

      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-green-700 mb-2">Booking Successful!</h3>
      <p className="text-gray-600 mb-6 text-sm">Your seat is confirmed. Download receipt below.</p>

      {/* Updated Details UI */}
      <div className="bg-gray-50 rounded-lg p-5 text-left space-y-3 mb-8 border">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Seat Number</span>
          <span className="font-bold text-green-700">{booking?.seatNo}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Plan</span>
          <span className="font-bold text-green-700">{booking?.timings}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Duration</span>
          <span>{booking?.duration}</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between text-sm">
            <span>Admission</span>
            <span>₹{booking?.amount}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Addon</span>
            <span>{booking?.addOnServiceQuantity}</span>
          </div>

          <div className="flex justify-between font-bold text-lg text-green-700 mt-2 pt-2 border-t">
            <span>Total</span>
            <span>₹{booking?.discountedAmount}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button onClick={generatePDF}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg shadow-md">
          Download Receipt
        </button>

        <Link to="/dash"
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-lg">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}