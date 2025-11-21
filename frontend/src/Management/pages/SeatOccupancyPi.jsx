import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useGetAvailableSeatsOfAdminCodeQuery } from "../redux/Api/SeatApi";

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight="bold"
    >
      {`${(percent ? percent * 100 : 0).toFixed(0)}%`}
    </text>
  );
};

export default function SeatOccupancyStatistics() {
  const { data: seatData, isLoading } = useGetAvailableSeatsOfAdminCodeQuery();
  const [seats, setSeats] = useState([]);
  console.log(seatData?.data);

  useEffect(() => {
    console.log("Seat API response:", seatData);
    if (seatData) {
      setSeats(seatData?.data?.data || seatData?.data || []);
    }
  }, [seatData]);

  console.log(seats);

  const bookedSeatss = seats?.filter(
    (seat) =>
      seat?.bookedForMorning || seat?.bookedForEvening || seat?.bookedForFullDay
  );

  console.log(bookedSeatss);

  const vacantSeatss = seats?.filter(
    (seat) =>
      !seat?.bookedForMorning ||
      !seat?.bookedForEvening ||
      !seat?.bookedForFullDay
  );

  console.log(vacantSeatss);

  console.log(seats);

  const MorningBooks = seats?.filter((seat) => seat?.bookedForMorning === true);
  const EveBooks = seats?.filter((seat) => seat?.bookedForEvening === true);
  const FullDayBooks = seats?.filter((seat) => seat?.bookedForFullday === true);

  const VacantSeatsMorning = seats?.filter(
    (seat) =>
      seat?.bookedForMorning === false || seat?.bookedForMorning === null
  );
  const VacantSeatsEve = seats?.filter(
    (seat) =>
      seat?.bookedForEvening === false || seat?.bookedForEvening === null
  );
  const VacantSeatsFullDay = seats?.filter(
    (seat) =>
      (seat?.bookedForEvening === false || seat?.bookedForEvening === null) &&
      (seat?.bookedForMorning === false || seat?.bookedForMorning === null)
  );

  console.log(VacantSeatsFullDay);

  console.log(MorningBooks);

  const booked = Array.isArray(seats)
    ? seats.filter((s) => s?.status?.toLowerCase() === "booked")
    : [];
  const pending = Array.isArray(seats)
    ? seats.filter((s) => s?.status?.toLowerCase() === "pending")
    : [];
  const expiring = Array.isArray(seats)
    ? seats.filter((s) => s?.status?.toLowerCase() === "expired")
    : [];

  const data = [
    {
      name: "Booked Seats (Morning)",
      value: MorningBooks.length || 0,
      color: "#4caf50",
    }, // Green
    {
      name: "Booked Seats (Evening)",
      value: EveBooks.length || 0,
      color: "#084271ff",
    }, // Blue
    {
      name: "Booked Seats (Full Day)",
      value: FullDayBooks.length || 0,
      color: "#9c27b0",
    }, // Purple
    {
      name: "Vacant Seats (Morning)",
      value: VacantSeatsMorning.length || 0,
      color: "#ff9800",
    }, // Orange
    {
      name: "Vacant Seats (Evening)",
      value: VacantSeatsEve.length || 0,
      color: "#00bcd4",
    }, // Cyan
    {
      name: "Vacant Seats (Full Day)",
      value: VacantSeatsFullDay.length || 0,
      color: "#f44336",
    }, // Red
    // { name: "Expiring Soon", value: expiring.length || 0, color: "#e91e63" }, // Pink
  ];

  const totalSeats = data.reduce((sum, d) => sum + d.value, 0);

  if (isLoading) {
    return <p className="p-5 text-center">Loading seat statistics...</p>;
  }

  if (totalSeats === 0) {
    return (
      <div className="p-5 bg-white rounded-2xl text-center">
        <p className="text-gray-600 font-medium">No seat data available</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white flex flex-col md:flex-row items-center h-auto md:h-96">
      {/* Pie Chart Section */}
      <div className="flex flex-col items-center w-full md:w-1/2 mb-6 md:mb-0">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 font-semibold text-sm text-black text-center">
          Seat Occupancy <br /> Statistics
        </p>
      </div>

      {/* Legend Section */}
      <div className="w-full md:w-1/2 flex flex-col gap-3 md:pl-6 md:border-l h-full">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-6 h-6 rounded-md"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-gray-700 text-sm">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
