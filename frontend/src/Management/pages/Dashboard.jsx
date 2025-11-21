// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUserGraduate } from "react-icons/fa";
// import { MdPeopleAlt, MdEventBusy } from "react-icons/md";
// import { IoIosCheckmarkCircle } from "react-icons/io";
// import { TbMoneybag } from "react-icons/tb";

// import SeatOccupancyChart from "../components/SeatOccupancyChart";
// import FeesCollectionChart from "../components/FeesCollectionchart";
// import { useGetAllStudentsQuery } from "../redux/Api/StudentAPI";
// import { useGetAllStaffQuery } from "../redux/Api/StaffAPI";
// import { useGetAllSeatsQuery } from "../redux/Api/SeatApi";
// import { useGetAllBookingsQuery } from "../redux/Api/BookingsAPI";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const { data: studentsData, isLoading: isLoadingstudentsData } =
//     useGetAllStudentsQuery();
//   const { data: staffData, isLoading: isLoadingstaffData } =
//     useGetAllStaffQuery();
//   const { data: seatsData, isLoading: isLoadingseatsData } =
//     useGetAllSeatsQuery();
//   const { data: bookingsData, isLoading: isLoadingbookingsData } =
//     useGetAllBookingsQuery();

//   console.log({
//     studentsData: studentsData,
//     staffData: staffData,
//     seatsData: seatsData,
//     bookingsData: bookingsData,
//   });

//   const students = studentsData?.students?.length;
//   // const students = 4;
//   // const staff = 15;
//   const staff = staffData?.staff?.length;
//   const seatsMorning = 50;
//   const seatsEvening = 50;
//   const seatsForFullDay = 50;
//   const bookings = 8;
//   const revenue = 5000;

//   if (
//     isLoadingstudentsData ||
//     isLoadingstaffData ||
//     isLoadingseatsData ||
//     isLoadingbookingsData
//   ) {
//     <p>Loading...</p>;
//   }

//   return (
//     <div className="p-6 min-h-screen font-outfit px-0">
//       {/* Top Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//         {/* Students */}
//         <div
//           onClick={() => navigate("/students")}
//           className="cursor-pointer bg-blue-100 p-5 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-blue-500 p-3 text-white rounded-none">
//             <FaUserGraduate size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">Students</p>
//             <p className="text-xl font-bold text-black">{students}</p>
//           </div>
//         </div>

//         {/* Staff */}
//         <div
//           onClick={() => navigate("/staff")}
//           className="cursor-pointer bg-yellow-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-yellow-500 p-3 text-white rounded-none">
//             <MdPeopleAlt size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">Staff</p>
//             <p className="text-xl font-bold text-black">{staff}</p>
//           </div>
//         </div>

//         {/* Available Seats */}
//         <div
//           onClick={() => navigate("/seat")}
//           className="cursor-pointer bg-orange-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-orange-500 p-3 text-white rounded-none">
//             <IoIosCheckmarkCircle size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">
//               Available Seats For Full-Day
//             </p>
//             <p className="text-xl font-bold text-black">{seatsForFullDay}</p>
//           </div>
//         </div>
//         {/* Available Seats for morning */}
//         <div
//           onClick={() => navigate("/seat")}
//           className="cursor-pointer bg-orange-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-orange-500 p-3 text-white rounded-none">
//             <IoIosCheckmarkCircle size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">
//               Available Seats For Morning
//             </p>
//             <p className="text-xl font-bold text-black">{seatsMorning}</p>
//           </div>
//         </div>
//         {/* Available Seats for evening */}
//         <div
//           onClick={() => navigate("/seat")}
//           className="cursor-pointer bg-orange-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-orange-500 p-3 text-white rounded-none">
//             <IoIosCheckmarkCircle size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">
//               Available Seats For Evening
//             </p>
//             <p className="text-xl font-bold text-black">{seatsEvening}</p>
//           </div>
//         </div>

//         {/* Overall Revenue */}
//         <div
//           onClick={() => navigate("/fees")}
//           className="cursor-pointer bg-green-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-green-500 p-3 text-white rounded-none">
//             <TbMoneybag size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">Overall Revenue</p>
//             <p className="text-xl font-bold text-black">₹{revenue}</p>
//           </div>
//         </div>

//         {/* Seats Expiring / Bookings */}
//         <div
//           onClick={() => navigate("/seat")}
//           className="cursor-pointer bg-red-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-red-500 p-3 text-white rounded-none">
//             <MdEventBusy size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">Seats Expiring</p>
//             <p className="text-xl font-bold text-black">{bookings}</p>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <SeatOccupancyChart />
//         <div className="lg:col-span-2">
//           <FeesCollectionChart />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUserGraduate } from "react-icons/fa";
// import { MdPeopleAlt, MdEventBusy } from "react-icons/md";
// import { IoIosCheckmarkCircle } from "react-icons/io";
// import { TbMoneybag } from "react-icons/tb";

// import SeatOccupancyChart from "../components/SeatOccupancyChart";
// import FeesCollectionChart from "../components/FeesCollectionchart";
// import { useGetAllStudentsQuery } from "../redux/Api/StudentAPI";
// import { useGetAllStaffQuery } from "../redux/Api/StaffAPI";
// import { useGetAllSeatsQuery } from "../redux/Api/SeatApi";
// import { useGetAllBookingsQuery } from "../redux/Api/BookingsAPI";
// import { ScaleLoader } from "react-spinners";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const { data: studentsData, isLoading: isLoadingstudentsData } =
//     useGetAllStudentsQuery();
//   const { data: staffData, isLoading: isLoadingstaffData } =
//     useGetAllStaffQuery();
//   const { data: seatsData, isLoading: isLoadingseatsData } =
//     useGetAllSeatsQuery();
//   const { data: bookingsData, isLoading: isLoadingbookingsData } =
//     useGetAllBookingsQuery();

//   console.log({
//     studentsData: studentsData,
//     staffData: staffData,
//     seatsData: seatsData,
//     bookingsData: bookingsData,
//   });

//   const students = studentsData?.students?.length || 0;
//   const staff = staffData?.staff?.length || 0;

//   // Filter available seats based on booking status
//   const seats = seatsData?.seats || [];

//   const seatsMorning = seats.filter(
//     (seat) => !seat.bookedForMorning && !seat.bookedForFullDay
//   ).length;

//   const seatsEvening = seats.filter(
//     (seat) => !seat.bookedForEvening && !seat.bookedForFullDay
//   ).length;

//   const seatsForFullDay = seats.filter((seat) => !seat.bookedForFullDay).length;

//   // Count seats expiring (seats that are currently booked)
//   const bookings = seats.filter(
//     (seat) =>
//       seat.bookedForMorning || seat.bookedForEvening || seat.bookedForFullDay
//   ).length;

//   const revenue = 5000;

//   if (
//     isLoadingstudentsData ||
//     isLoadingstaffData ||
//     isLoadingseatsData ||
//     isLoadingbookingsData
//   ) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
//         {/* Loader */}
//         <ScaleLoader
//           color="#2563eb" // Tailwind blue-600
//           height={35}
//           width={6}
//           // radius={3}
//           // margin={2}
//           speedMultiplier={2}
//         />

//         {/* Text */}
//         <p className="mt-6 text-lg font-semibold text-blue-700 animate-pulse tracking-wide">
//           Loading dashboard data...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 min-h-screen font-outfit px-0">
//       {/* Top Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//         {/* Students */}
//         <div
//           onClick={() => navigate("/students")}
//           className="cursor-pointer bg-blue-100 p-5 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-blue-500 p-3 text-white rounded-none">
//             <FaUserGraduate size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">Students</p>
//             <p className="text-xl font-bold text-black">{students}</p>
//           </div>
//         </div>

//         {/* Staff */}
//         <div
//           onClick={() => navigate("/staff")}
//           className="cursor-pointer bg-yellow-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-yellow-500 p-3 text-white rounded-none">
//             <MdPeopleAlt size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">Staff</p>
//             <p className="text-xl font-bold text-black">{staff}</p>
//           </div>
//         </div>

//         {/* Available Seats */}
//         <div
//           onClick={() => navigate("/seat")}
//           className="cursor-pointer bg-orange-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-orange-500 p-3 text-white rounded-none">
//             <IoIosCheckmarkCircle size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">
//               Available Seats For Full-Day
//             </p>
//             <p className="text-xl font-bold text-black">{seatsForFullDay}</p>
//           </div>
//         </div>
//         {/* Available Seats for morning */}
//         <div
//           onClick={() => navigate("/seat")}
//           className="cursor-pointer bg-orange-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-orange-500 p-3 text-white rounded-none">
//             <IoIosCheckmarkCircle size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">
//               Available Seats For Morning
//             </p>
//             <p className="text-xl font-bold text-black">{seatsMorning}</p>
//           </div>
//         </div>
//         {/* Available Seats for evening */}
//         <div
//           onClick={() => navigate("/seat")}
//           className="cursor-pointer bg-orange-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-orange-500 p-3 text-white rounded-none">
//             <IoIosCheckmarkCircle size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">
//               Available Seats For Evening
//             </p>
//             <p className="text-xl font-bold text-black">{seatsEvening}</p>
//           </div>
//         </div>

//         {/* Overall Revenue */}
//         <div
//           onClick={() => navigate("/fees")}
//           className="cursor-pointer bg-green-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-green-500 p-3 text-white rounded-none">
//             <TbMoneybag size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">Overall Revenue</p>
//             <p className="text-xl font-bold text-black">₹{revenue}</p>
//           </div>
//         </div>

//         {/* Seats Expiring / Bookings */}
//         <div
//           onClick={() => navigate("/seat")}
//           className="cursor-pointer bg-red-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
//         >
//           <div className="bg-red-500 p-3 text-white rounded-none">
//             <MdEventBusy size={24} />
//           </div>
//           <div>
//             <p className="text-black font-medium">Seats Expiring</p>
//             <p className="text-xl font-bold text-black">{bookings}</p>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <SeatOccupancyChart />
//         <div className="lg:col-span-2">
//           <FeesCollectionChart />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";
import { MdPeopleAlt, MdEventBusy } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { TbMoneybag } from "react-icons/tb";

import SeatOccupancyChart from "../components/SeatOccupancyChart";
import FeesCollectionChart from "../components/FeesCollectionchart";
import { useGetAllStudentsQuery } from "../redux/Api/StudentAPI";
import { useGetAllStaffQuery } from "../redux/Api/StaffAPI";
import { useGetAllSeatsQuery } from "../redux/Api/SeatApi";
import { useGetAllBookingsQuery } from "../redux/Api/BookingsAPI";
import { ScaleLoader } from "react-spinners";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: studentsData, isLoading: isLoadingstudentsData } =
    useGetAllStudentsQuery();
  const { data: staffData, isLoading: isLoadingstaffData } =
    useGetAllStaffQuery();
  const { data: seatsData, isLoading: isLoadingseatsData } =
    useGetAllSeatsQuery();
  const { data: bookingsData, isLoading: isLoadingbookingsData } =
    useGetAllBookingsQuery();

  console.log({
    studentsData: studentsData,
    staffData: staffData,
    seatsData: seatsData,
    bookingsData: bookingsData,
  });

  const students = studentsData?.students?.length || 0;
  const staff = staffData?.staff?.length || 0;

  // Filter available seats based on booking status
  const seats = seatsData?.seats || [];

  const seatsMorning = seats.filter(
    (seat) => !seat.bookedForMorning && !seat.bookedForFullDay
  ).length;

  const seatsEvening = seats.filter(
    (seat) => !seat.bookedForEvening && !seat.bookedForFullDay
  ).length;

  const seatsForFullDay = seats.filter(
    (seat) =>
      !seat.bookedForEvening && !seat.bookedForFullDay && !seat.bookedForMorning
  ).length;

  // Calculate seats expiring within 7 days
  const bookings = bookingsData?.bookings || [];
  const today = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const seatsExpiring = bookings.filter((booking) => {
    if (booking.status !== "booked") return false;

    const expiryDate = new Date(booking.expiryDate);
    return expiryDate >= today && expiryDate <= sevenDaysFromNow;
  }).length;

  const revenue = 5000;

  if (
    isLoadingstudentsData ||
    isLoadingstaffData ||
    isLoadingseatsData ||
    isLoadingbookingsData
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Loader */}
        <ScaleLoader
          color="#2563eb" // Tailwind blue-600
          height={35}
          width={6}
          // radius={3}
          // margin={2}
          speedMultiplier={2}
        />

        {/* Text */}
        <p className="mt-6 text-lg font-semibold text-blue-700 animate-pulse tracking-wide">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen font-outfit px-0">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {/* Students */}
        <div
          onClick={() => navigate("/students")}
          className="cursor-pointer bg-blue-100 p-5 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
        >
          <div className="bg-blue-500 p-3 text-white rounded-none">
            <FaUserGraduate size={24} />
          </div>
          <div>
            <p className="text-black font-medium">Students</p>
            <p className="text-xl font-bold text-black">{students}</p>
          </div>
        </div>

        {/* Staff */}
        <div
          onClick={() => navigate("/staff")}
          className="cursor-pointer bg-yellow-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
        >
          <div className="bg-yellow-500 p-3 text-white rounded-none">
            <MdPeopleAlt size={24} />
          </div>
          <div>
            <p className="text-black font-medium">Staff</p>
            <p className="text-xl font-bold text-black">{staff}</p>
          </div>
        </div>

        {/* Available Seats */}
        <div
          onClick={() => navigate("/seat")}
          className="cursor-pointer bg-orange-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
        >
          <div className="bg-orange-500 p-3 text-white rounded-none">
            <IoIosCheckmarkCircle size={24} />
          </div>
          <div>
            <p className="text-black font-medium">
              Available Seats For Full-Day
            </p>
            <p className="text-xl font-bold text-black">{seatsForFullDay}</p>
          </div>
        </div>
        {/* Available Seats for morning */}
        <div
          onClick={() => navigate("/seat")}
          className="cursor-pointer bg-orange-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
        >
          <div className="bg-orange-500 p-3 text-white rounded-none">
            <IoIosCheckmarkCircle size={24} />
          </div>
          <div>
            <p className="text-black font-medium">
              Available Seats For Morning
            </p>
            <p className="text-xl font-bold text-black">{seatsMorning}</p>
          </div>
        </div>
        {/* Available Seats for evening */}
        <div
          onClick={() => navigate("/seat")}
          className="cursor-pointer bg-orange-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
        >
          <div className="bg-orange-500 p-3 text-white rounded-none">
            <IoIosCheckmarkCircle size={24} />
          </div>
          <div>
            <p className="text-black font-medium">
              Available Seats For Evening
            </p>
            <p className="text-xl font-bold text-black">{seatsEvening}</p>
          </div>
        </div>

        {/* Overall Revenue */}
        {/* <div
          onClick={() => navigate("/fees")}
          className="cursor-pointer bg-green-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
        >
          <div className="bg-green-500 p-3 text-white rounded-none">
            <TbMoneybag size={24} />
          </div>
          <div>
            <p className="text-black font-medium">Overall Revenue</p>
            <p className="text-xl font-bold text-black">₹{revenue}</p>
          </div>
        </div> */}

        {/* Seats Expiring / Bookings */}
        <div
          onClick={() => navigate("/seat")}
          className="cursor-pointer bg-red-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition"
        >
          <div className="bg-red-500 p-3 text-white rounded-none">
            <MdEventBusy size={24} />
          </div>
          <div>
            <p className="text-black font-medium">Seats Expiring (7 Days)</p>
            <p className="text-xl font-bold text-black">{seatsExpiring}</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SeatOccupancyChart />
        <div className="lg:col-span-2">
          <FeesCollectionChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
