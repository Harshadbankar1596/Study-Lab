// import React, { useState } from "react";
// import ChairIcon from "/chair.svg";
// import TimeSlotPopup from "../components/TimeSlotPopup";
// import EditSeatPopup from "../components/EditSitPopup";
// import AddSeatPopup from "../components/AddSeatPopup";
// import { useNavigate } from "react-router-dom";
// import { useGetAllSeatsQuery } from "../redux/Api/SeatApi";

// const SeatManagement = () => {
//   const navigate = useNavigate();
//   const rows = 10;
//   const cols = 10;
//   const [activeFloor, setActiveFloor] = useState("Floor 1");

//   const { data } = useGetAllSeatsQuery();
//   console.log(data);

//   const [slotPopupOpen, setSlotPopupOpen] = useState(false);
//   const [slots, setSlots] = useState([]);

//   const [editSeatPopupOpen, setEditSeatPopupOpen] = useState(false);

//   const [addSeatPopupOpen, setAddSeatPopupOpen] = useState(false);

//   // ✅ Track Selected Seats
//   const [selectedSeats, setSelectedSeats] = useState([]);

//   // Sample seat status data
//   const seatStatus = {
//     booked: ["5-4", "3-3", "9-3"],
//     vacant: ["5-1"],
//     expiring: ["4-5", "9-5"],
//   };

//   const getSeatStatus = (row, col) => {
//     const key = `${row}-${col}`;
//     if (seatStatus.booked.includes(key)) return "booked";
//     if (seatStatus.vacant.includes(key)) return "vacant";
//     if (seatStatus.expiring.includes(key)) return "expiring";
//     return "available";
//   };

//   // ✅ Handle Add Slot
//   const handleAddSlot = (slot) => {
//     setSlots([...slots, slot]);
//   };

//   // ✅ Handle Add Seat
//   const handleAddSeat = (seat) => {
//     console.log("Seat added:", seat);
//     setAddSeatPopupOpen(false);
//   };

//   const toggleSeatSelection = (row, col) => {
//     const key = `${row}-${col}`;
//     const status = getSeatStatus(row, col);

//     if (status !== "available") return;

//     if (selectedSeats.includes(key)) {
//       setSelectedSeats(selectedSeats.filter((s) => s !== key));
//     } else {
//       setSelectedSeats([...selectedSeats, key]);
//     }
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       {/* 🔹 Top Bar */}
//       <div className="flex flex-wrap items-center justify-between bg-white p-3 rounded-lg shadow mb-6">
//         {/* Floor Tabs */}
//         <div className="flex space-x-2 mb-2 md:mb-0">
//           {["Floor 1", "Floor 2"].map((floor) => (
//             <button
//               key={floor}
//               className={`px-4 py-1.5 rounded-lg font-semibold ${
//                 activeFloor === floor
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-100 text-gray-700"
//               }`}
//               onClick={() => setActiveFloor(floor)}
//             >
//               {floor}
//             </button>
//           ))}
//         </div>

//         {/* Legend */}
//         <div className="flex items-center space-x-4 text-sm mb-2 md:mb-0">
//           <div className="flex items-center space-x-1">
//             <span className="w-4 h-4 bg-green-600 rounded"></span>
//             <span>Booked Seats</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <span className="w-4 h-4 bg-yellow-500 rounded"></span>
//             <span>Vacant Seats</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <span className="w-4 h-4 bg-red-600 rounded"></span>
//             <span>Expiring Soon</span>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center space-x-2 mb-2 md:mb-0">
//           <button
//             onClick={() => setSlotPopupOpen(true)}
//             className="px-4 py-1.5 bg-green-600 text-white rounded-lg shadow text-sm font-semibold"
//           >
//             + Add Time Slot
//           </button>

//           <button
//             onClick={() => setEditSeatPopupOpen(true)}
//             className="px-4 py-1.5 bg-green-600 text-white rounded-lg shadow text-sm font-semibold"
//           >
//             + Edit Seat
//           </button>

//           <button
//             onClick={() => setAddSeatPopupOpen(true)}
//             className="px-4 py-1.5 bg-green-600 text-white rounded shadow text-sm font-semibold"
//           >
//             + Add Seat
//           </button>
//         </div>

//         <button
//           onClick={() => navigate("/booking")}
//           className="text-black font-medium flex items-center space-x-1"
//         >
//           <span>View Bookings Info</span>
//           <span className="text-lg">›</span>
//         </button>
//       </div>

//       {/* Time Slots */}
//       <div className="grid grid-cols-7 gap-2 mb-4 text-center font-semibold text-gray-600 p-4 bg-[#D9D9D92E;] rounded-lg font-outfit text-sm">
//         {slots.length > 0
//           ? slots.map((slot, i) => (
//               <div key={i} className="col-span-1">
//                 {slot.from} - {slot.to}
//               </div>
//             ))
//           : Array.from({ length: 7 }).map((_, i) => (
//               <div key={i} className="col-span-1">
//                 10:00 AM - 12:00 PM
//               </div>
//             ))}
//       </div>

//       {/* Seat Grid */}
//       <div className="grid grid-cols-10 gap-4 px-11">
//         {Array.from({ length: rows }).map((_, rowIndex) =>
//           Array.from({ length: cols }).map((_, colIndex) => {
//             const status = getSeatStatus(rowIndex + 1, colIndex + 1);
//             const key = `${rowIndex + 1}-${colIndex + 1}`;

//             let bgColor = "bg-gray-100";
//             if (status === "booked") bgColor = "bg-green-600 text-white";
//             if (status === "vacant") bgColor = "bg-yellow-500 text-white";
//             if (status === "expiring") bgColor = "bg-red-600 text-white";

//             if (status === "available" && selectedSeats.includes(key)) {
//               bgColor = "bg-green-600 text-white";
//             }

//             return (
//               <div
//                 key={key}
//                 className={`flex items-center space-x-3 ${
//                   status === "available"
//                     ? "cursor-pointer"
//                     : "cursor-not-allowed"
//                 }`}
//                 onClick={() => toggleSeatSelection(rowIndex + 1, colIndex + 1)}
//               >
//                 {/* Seat Number */}
//                 <span className="text-xs font-semibold">
//                   {rowIndex + 1}
//                   {colIndex + 1 < 10 ? `0${colIndex + 1}` : colIndex + 1}
//                 </span>

//                 {/* Seat Box */}
//                 <div
//                   className={`w-12 h-12 flex items-center justify-center rounded-md shadow ${bgColor}`}
//                 >
//                   <img src={ChairIcon} alt="Chair" className="w-8 h-8" />
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* ✅ Popups */}
//       <TimeSlotPopup
//         isOpen={slotPopupOpen}
//         onClose={() => setSlotPopupOpen(false)}
//         onAdd={handleAddSlot}
//       />

//       <EditSeatPopup
//         isOpen={editSeatPopupOpen}
//         onClose={() => setEditSeatPopupOpen(false)}
//         onSave={(data) => {
//           console.log("Seat saved:", data);
//           setEditSeatPopupOpen(false);
//         }}
//         onDelete={() => {
//           console.log("Seat deleted");
//           setEditSeatPopupOpen(false);
//         }}
//       />

//       <AddSeatPopup
//         isOpen={addSeatPopupOpen}
//         onClose={() => setAddSeatPopupOpen(false)}
//         onAdd={handleAddSeat}
//       />
//     </div>
//   );
// };

// export default SeatManagement;

import React, { useState, useMemo } from "react";
import ChairIcon from "/chair.svg";
import TimeSlotPopup from "../components/TimeSlotPopup";
import EditSeatPopup from "../components/EditSitPopup";
import AddSeatPopup from "../components/AddSeatPopup";
import { useNavigate } from "react-router-dom";
import { useGetAllSeatsQuery } from "../redux/Api/SeatApi";
import { useGetTimeSlotsQuery } from "../redux/Api/TimeSlotAPI";

const SeatManagement = () => {
  const navigate = useNavigate();
  const rows = 10;
  const cols = 10;
  const [activeFloor, setActiveFloor] = useState("1");

  const { data, isLoading } = useGetAllSeatsQuery();
  const { data: timeSlots } = useGetTimeSlotsQuery();
  console.log(timeSlots);

  const [slotPopupOpen, setSlotPopupOpen] = useState(false);
  const [slots, setSlots] = useState([]);

  // Format time slots from API
  const formatTimeSlots = useMemo(() => {
    if (!timeSlots || timeSlots.length === 0) return [];

    return timeSlots.map((slot) => {
      const fromDate = new Date(slot.fromTime);
      const toDate = new Date(slot.toTime);

      const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const minutesStr =
          minutes === 0 ? "" : `:${minutes.toString().padStart(2, "0")}`;
        return `${hours}${minutesStr} ${ampm}`;
      };

      return {
        from: formatTime(fromDate),
        to: formatTime(toDate),
      };
    });
  }, [timeSlots]);

  const [editSeatPopupOpen, setEditSeatPopupOpen] = useState(false);
  const [addSeatPopupOpen, setAddSeatPopupOpen] = useState(false);

  const [selectedSeats, setSelectedSeats] = useState([]);

  // Filter seats by active floor and create a lookup map
  const seatMap = useMemo(() => {
    if (!data?.seats) return {};

    const map = {};
    data.seats
      .filter((seat) => seat.floor === activeFloor)
      .forEach((seat) => {
        const key = `${seat.row}-${seat.seatNumber}`;
        map[key] = seat;
      });

    return map;
  }, [data, activeFloor]);

  // Get seat status based on API data
  const getSeatStatus = (row, col) => {
    const key = `${row}-${col}`;
    const seat = seatMap[key];

    if (!seat) return "available";

    // Map API status to display status
    if (seat.status === "booked") return "booked";
    if (seat.status === "pending") return "vacant";
    if (seat.status === "expiring") return "expiring";

    return "available";
  };

  // Get seat data
  const getSeatData = (row, col) => {
    const key = `${row}-${col}`;
    return seatMap[key] || null;
  };

  const handleAddSlot = (slot) => {
    setSlots([...slots, slot]);
  };

  const handleAddSeat = (seat) => {
    console.log("Seat added:", seat);
    setAddSeatPopupOpen(false);
  };

  const toggleSeatSelection = (row, col) => {
    const key = `${row}-${col}`;
    const status = getSeatStatus(row, col);

    if (status !== "available") return;

    if (selectedSeats.includes(key)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== key));
    } else {
      setSelectedSeats([...selectedSeats, key]);
    }
  };

  // Count seats by status for current floor
  const seatCounts = useMemo(() => {
    if (!data?.seats) return { booked: 0, vacant: 0, expiring: 0 };

    const counts = { booked: 0, vacant: 0, expiring: 0 };
    data.seats
      .filter((seat) => seat.floor === activeFloor)
      .forEach((seat) => {
        if (seat.status === "booked") counts.booked++;
        else if (seat.status === "pending") counts.vacant++;
        else if (seat.status === "expired") counts.expiring++;
      });

    return counts;
  }, [data, activeFloor]);

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600">Loading seats...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between bg-white p-3 rounded-lg shadow mb-6">
        {/* Floor Tabs */}
        <div className="flex space-x-2 mb-2 md:mb-0">
          {["1", "2"].map((floor) => (
            <button
              key={floor}
              className={`px-4 py-1.5 rounded-lg font-semibold ${
                activeFloor === floor
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveFloor(floor)}
            >
              Floor {floor}
            </button>
          ))}
        </div>

        {/* Legend with counts */}
        <div className="flex items-center space-x-4 text-sm mb-2 md:mb-0">
          <div className="flex items-center space-x-1">
            <span className="w-4 h-4 bg-green-600 rounded"></span>
            <span>Booked ({seatCounts.booked})</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-4 h-4 bg-yellow-500 rounded"></span>
            <span>Pending ({seatCounts.vacant})</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-4 h-4 bg-red-600 rounded"></span>
            <span>Expiring ({seatCounts.expiring})</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          {/* <button
            onClick={() => setSlotPopupOpen(true)}
            className="px-4 py-1.5 bg-green-600 text-white rounded-lg shadow text-sm font-semibold"
          >
            + Add Time Slot
          </button> */}

          <button
            onClick={() => setEditSeatPopupOpen(true)}
            className="px-4 py-1.5 bg-green-600 text-white rounded-lg shadow text-sm font-semibold"
          >
            + Edit Seat
          </button>

          <button
            onClick={() => setAddSeatPopupOpen(true)}
            className="px-4 py-1.5 bg-green-600 text-white rounded shadow text-sm font-semibold"
          >
            + Add Seat
          </button>
        </div>

        <button
          onClick={() => navigate("/booking")}
          className="text-black font-medium flex items-center space-x-1"
        >
          <span>View Bookings Info</span>
          <span className="text-lg">›</span>
        </button>
      </div>

      {/* Time Slots */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center font-semibold text-gray-600 p-4 bg-[#D9D9D92E;] rounded-lg font-outfit text-sm">
        <div className="col-span-1">Morning</div>
        <div className="col-span-1">Evening</div>
        <div className="col-span-1">Full Day</div>
        {/* ))} */}
      </div>

      {/* Seat Grid */}
      <div className="grid grid-cols-10 gap-4 px-11">
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => {
            const status = getSeatStatus(rowIndex + 1, colIndex + 1);
            const seatData = getSeatData(rowIndex + 1, colIndex + 1);
            const key = `${rowIndex + 1}-${colIndex + 1}`;

            let bgColor = "bg-gray-100";
            if (status === "booked") bgColor = "bg-green-600 text-white";
            if (status === "vacant") bgColor = "bg-yellow-500 text-white";
            if (status === "expiring") bgColor = "bg-red-600 text-white";

            if (status === "available" && selectedSeats.includes(key)) {
              bgColor = "bg-green-600 text-white";
            }

            return (
              <div
                key={key}
                className={`flex items-center space-x-3 ${
                  status === "available"
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
                // onClick={() => toggleSeatSelection(rowIndex + 1, colIndex + 1)}
                title={
                  seatData
                    ? `Floor ${seatData.floor}, Row ${seatData.row}, Seat ${seatData.seatNumber} - ${seatData.status}`
                    : `Available seat ${rowIndex + 1}-${colIndex + 1}`
                }
              >
                {/* Seat Number - Show API seat number if exists */}
                <span className="text-xs font-semibold">
                  {seatData
                    ? seatData.seatNumber.toString().padStart(3, "0")
                    : `${rowIndex + 1}${(colIndex + 1)
                        .toString()
                        .padStart(2, "0")}`}
                </span>

                {/* Seat Box */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-md shadow ${bgColor}`}
                >
                  <img src={ChairIcon} alt="Chair" className="w-8 h-8" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Popups */}
      <TimeSlotPopup
        isOpen={slotPopupOpen}
        onClose={() => setSlotPopupOpen(false)}
        onAdd={handleAddSlot}
      />

      <EditSeatPopup
        isOpen={editSeatPopupOpen}
        onClose={() => setEditSeatPopupOpen(false)}
        onSave={(data) => {
          console.log("Seat saved:", data);
          setEditSeatPopupOpen(false);
        }}
        onDelete={() => {
          console.log("Seat deleted");
          setEditSeatPopupOpen(false);
        }}
      />

      <AddSeatPopup
        isOpen={addSeatPopupOpen}
        onClose={() => setAddSeatPopupOpen(false)}
        onAdd={handleAddSeat}
      />
    </div>
  );
};

export default SeatManagement;
