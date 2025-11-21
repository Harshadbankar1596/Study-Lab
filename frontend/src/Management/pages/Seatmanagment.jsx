import React, { useMemo } from "react";
import { Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PiOfficeChairFill } from "react-icons/pi";
import SeatOccupancyStatistics from "../pages/SeatOccupancyPi";
// import { useGetAvailableSeatsQuery } from "../../Redux/Api/SeatApi";
import { useGetAvailableSeatsOfAdminCodeQuery } from "../redux/Api/SeatApi";
import { useGetTimeSlotsOfAdminCodeQuery } from "../redux/Api/TimeSlotAPI";
// import { useGetTimeSlotsQuery } from "../../Redux/Api/TimeSlotAoi";

export default function SeatManagement1() {
  const navigate = useNavigate();

  const {
    data: seatsData,
    isLoading,
    isError,
  } = useGetAvailableSeatsOfAdminCodeQuery();
  console.log(seatsData);
  // const [setats]
  const Morning = seatsData?.data.filter((seat) => seat?.bookedForMorning);
  const Evening = seatsData?.data.filter((seat) => seat?.bookedForEvening);
  const FullDay = seatsData?.data.filter((seat) => seat?.bookedForFullDay);
  // console.log(bookedSeatss);

  const vacantSeatss = seatsData?.data.filter(
    (seat) =>
      !seat?.bookedForMorning &&
      !seat?.bookedForEvening &&
      !seat?.bookedForFullDay
  );

  // console.log(vacantSeatss);

  const { data: timeSlotsData, isLoading: isLoadingSlots } =
    useGetTimeSlotsOfAdminCodeQuery();

  const { totalSeats, bookedSeats, vacantSeats, expiringSeats, floorSeats } =
    useMemo(() => {
      if (!seatsData?.data)
        return {
          totalSeats: 0,
          bookedSeats: 0,
          vacantSeats: 0,
          expiringSeats: 0,
          floorSeats: [],
        };

      const totalSeats = seatsData.data.length;
      const bookedSeats = seatsData.data.filter(
        (s) => s.status === "booked"
      ).length;
      const vacantSeats = seatsData.data.filter(
        (s) => s.status === "pending"
      ).length;

      const expiringSeats = seatsData.data.filter((s) => {
        if (!s.expiryDate) return false;
        const expiry = new Date(s.expiryDate);
        const now = new Date();
        const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }).length;

      const floorMap = {};
      seatsData.data.forEach((s) => {
        if (!floorMap[s.floor]) floorMap[s.floor] = 0;
        floorMap[s.floor] += 1;
      });
      const floorSeats = Object.entries(floorMap).map(([floor, seats]) => ({
        floor,
        seats,
      }));

      return {
        totalSeats,
        bookedSeats,
        vacantSeats,
        expiringSeats,
        floorSeats,
      };
    }, [seatsData]);

  const totalTimeSlots = timeSlotsData?.data?.length || 0;

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading seats...
      </div>
    );
  if (isError)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Failed to load seats.
      </div>
    );

  return (
    <div className="p-6 grid gap-10  px-0 -mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 ">
        <div className="p-6 h-28 rounded-xl bg-[#E8F0FE] flex items-center gap-4">
          <div className="p-4 bg-[#1A73E8] rounded-md">
            <Calendar className="text-white" size={28} />
          </div>
          <div>
            <p className="text-black text-sm font-outfit font-medium">
              Total Seats
            </p>
            <p className="text-2xl font-bold text-gray-900">{totalSeats}</p>
          </div>
        </div>
        <div className="p-6 h-28 rounded-xl bg-[#FCEA2B26] flex items-center gap-4">
          <div className="p-4 bg-[#FBC02D] rounded-md">
            <Calendar className="text-white" size={28} />
          </div>
          <div>
            <p className="text-black font-outfit text-sm font-medium">
              Vacant Seats
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {vacantSeatss?.length}
            </p>
          </div>
        </div>

        <div className="p-6 h-28 rounded-xl bg-[#E8F5E9] flex items-center gap-4">
          <div className="p-4 bg-[#43A047] rounded-md">
            <Calendar className="text-white" size={28} />
          </div>
          <div>
            <p className="text-black font-outfit font-medium text-sm">
              Booked (Morning)
            </p>
            <p className="text-2xl font-bold text-black">{Morning?.length}</p>
          </div>
        </div>

        <div className="p-6 h-28 rounded-xl bg-[#E8F5E9] flex items-center gap-4">
          <div className="p-4 bg-[#43A047] rounded-md">
            <Calendar className="text-white" size={28} />
          </div>
          <div>
            <p className="text-black font-outfit font-medium text-sm">
              Booked (Evening)
            </p>
            <p className="text-2xl font-bold text-black">{Evening?.length}</p>
          </div>
        </div>

        <div className="p-6 h-28 rounded-xl bg-[#FFEBEE] flex items-center gap-4">
          <div className="p-4 bg-[#E53935] rounded-md">
            <Calendar className="text-white" size={28} />
          </div>
          <div>
            <p className="text-black text-sm font-outfit font-medium">
              Full Day Bookings
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {FullDay?.length}
            </p>
          </div>
        </div>

        {/* New Card for On Waiting */}

        {/* <div
          onClick={() => navigate("/onwait")}
          className="p-6 h-28 rounded-xl bg-[#FFF8E1] flex items-center gap-4 cursor-pointer hover:shadow-md transition"
        >
          <div className="p-4 bg-[#FBC02D] rounded-md">
            <Calendar className="text-white" size={28} />
          </div>
          <div>
            <p className="text-black text-sm font-outfit font-medium">
              On Waiting
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {seatsData?.data?.filter((s) => s.status === "waiting")?.length ||
                0}
            </p>
          </div>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seat Occupancy Chart */}
        <div className="p-6 -mt-12">
          <SeatOccupancyStatistics />
        </div>

        <div className="flex flex-col gap-5 mt-">
          {/* Floor-wise seats */}
          {floorSeats.map((floor) => (
            <div
              key={floor.floor}
              className="flex items-center justify-between p-6 bg-[#E3F2FD] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-4 bg-[#1A73E8] rounded-md">
                  <PiOfficeChairFill className="text-white" size={22} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Floor {floor.floor}</p>
                  <p
                    onClick={() => navigate("/booking")}
                    className="text-lg font-bold cursor-pointer text-gray-900"
                  >
                    {floor.seats} Seats
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Time Slots */}
          {/*  */}

          <div className="flex justify-end">
            <button
              onClick={() => navigate("/booking")}
              className="text-gray-700 font-medium"
            >
              View Seating Arrangement →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
