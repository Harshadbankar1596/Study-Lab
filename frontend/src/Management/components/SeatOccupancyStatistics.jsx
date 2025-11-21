import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Booked Seats", value: 100, color: "#059500" }, // Green
  { name: "Vacant Seats", value: 40, color: "#FFCC00" }, // Yellow
  { name: "Expiring Soon", value: 60, color: "#CC0000" }, // Red
];

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
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SeatOccupancyStatistics() {
  return (
    <div className="p-6 rounded-2xl bg-white shadow flex flex-col md:flex-row items-center h-auto md:h-96">
      {/* Pie Chart */}
      <div className="flex flex-col items-center w-full md:w-1/2 mb-6 md:mb-0">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <p className="mt-3 font-semibold text-sm text-black text-center">
          Seat Occupancy <br /> Statistics
        </p>
      </div>

      {/* Legend */}
      <div className="w-full md:w-1/2 flex flex-col gap-3 md:pl-6 md:border-l h-full">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded-sm"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-gray-700 text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
