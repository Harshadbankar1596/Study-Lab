import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FeesCollectionChart = () => {
  const barData = [
    { name: "Jan", fees: 5000 },
    { name: "Feb", fees: 32000 },
    { name: "Mar", fees: 25000 },
    { name: "Apr", fees: 24000 },
    { name: "May", fees: 18000 },
    { name: "Jun", fees: 12000 },
    { name: "Jul", fees: 15000 },
    { name: "Aug", fees: 22000 },
    { name: "Sep", fees: 18000 },
    { name: "Oct", fees: 39000 },
    { name: "Nov", fees: 23000 },
    { name: "Dec", fees: 32000 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center justify-center flex-col h-full">
      <h2 className="text-lg text-start font-semibold mb-4 text-black">
        Fees Collection Statistics
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <CartesianGrid vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip cursor={false} />
          <Bar dataKey="fees" fill="#D8E9FF" barSize={40} activeShape={null} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeesCollectionChart;
