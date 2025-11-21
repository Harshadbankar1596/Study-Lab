// import React from "react";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// const SeatOccupancyChart = () => {
//   const seatData = [
//     { name: "Occupied Seats", value: 180 },
//     { name: "Vacant Seats", value: 20 },
//   ];

//   const COLORS = ["#3B82F6", "#FACC15"]; // blue, yellow

//   return (
//     <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center text-black">
//       <h2 className="text-lg font-semibold mb-4">Seat Occupancy Pie Chart</h2>
//       <div className="w-48 h-48 relative">
//         <ResponsiveContainer>
//           <PieChart>
//             <Pie
//               data={seatData}
//               innerRadius={60}
//               outerRadius={80}
//               paddingAngle={5}
//               dataKey="value"
//             >
//               {seatData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index]} />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//         <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
//           70%
//         </div>
//       </div>

//       <div className="mt-4 space-y-2 text-sm">
//         <p className="flex items-center gap-2">
//           <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
//           Blue slice = Occupied Seats (180)
//         </p>
//         <p className="flex items-center gap-2">
//           <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
//           Yellow slice = Vacant Seats (20)
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SeatOccupancyChart;

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useGetAllSeatsQuery } from "../redux/Api/SeatApi";

const SeatOccupancyChart = () => {
  const { data: seatsData, isLoading } = useGetAllSeatsQuery();

  // Calculate seat statistics from the API data
  const seats = seatsData?.seats || [];

  const bookedMorning = seats.filter(
    (seat) => seat.bookedForMorning && !seat.bookedForFullDay
  ).length;
  const bookedEvening = seats.filter(
    (seat) => seat.bookedForEvening && !seat.bookedForFullDay
  ).length;
  const bookedFullDay = seats.filter((seat) => seat.bookedForFullDay).length;
  const available = seats.filter(
    (seat) =>
      !seat.bookedForMorning && !seat.bookedForEvening && !seat.bookedForFullDay
  ).length;

  const data = [
    { name: "Available", value: available, color: "#10b981" },
    { name: "Morning", value: bookedMorning, color: "#f59e0b" },
    { name: "Evening", value: bookedEvening, color: "#8b5cf6" },
    { name: "Full Day", value: bookedFullDay, color: "#ef4444" },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    if (percent === 0) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white p-2 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Seat Occupancy Status
        </h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Seat Occupancy Status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} seats`, name]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => `${value}: ${entry.payload.value}`}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-center items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 text-center"></div>
          <span className="text-gray-600">
            Available: <strong>{available}</strong>
          </span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 text-center"></div>
          <span className="text-gray-600">
            Morning: <strong>{bookedMorning}</strong>
          </span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500 text-center"></div>
          <span className="text-gray-600">
            Evening: <strong>{bookedEvening}</strong>
          </span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 text-center"></div>
          <span className="text-gray-600">
            Full Day: <strong>{bookedFullDay}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeatOccupancyChart;
