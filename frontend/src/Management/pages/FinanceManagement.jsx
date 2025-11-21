import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FinanceDashboard = () => {
  const revenueData = [
    { name: "Jan", revenue: 5000 },
    { name: "Feb", revenue: 25000 },
    { name: "Mar", revenue: 22000 },
    { name: "Apr", revenue: 15000 },
    { name: "May", revenue: 30000 },
    { name: "Jun", revenue: 12000 },
    { name: "Jul", revenue: 25000 },
    { name: "Aug", revenue: 18000 },
    { name: "Sep", revenue: 22000 },
    { name: "Oct", revenue: 40000 },
    { name: "Nov", revenue: 28000 },
    { name: "Dec", revenue: 32000 },
  ];

  const transactions = [
    { id: 1, name: "Payment Received", amount: 12000 },
    { id: 2, name: "Office Rent", amount: -8000 },
    { id: 3, name: "Client Invoice", amount: 25000 },
    { id: 4, name: "Utility Bills", amount: -3000 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Cards + Chart */}
        <div className="lg:col-span-2 rounded-lg  p-4">
          {/* Top Small Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-100 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Overall Revenue</p>
                <h2 className="text-lg font-bold text-blue-700">₹75,000</h2>
              </div>
              <div className="bg-blue-500 text-white rounded-full p-2 text-sm">💰</div>
            </div>

            <div className="bg-green-100 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Your Remuneration</p>
                <h2 className="text-lg font-bold text-green-700">₹25,000</h2>
              </div>
              <div className="bg-green-500 text-white rounded-full p-2 text-sm">🪙</div>
            </div>
          </div>

          {/* Chart */}
          <div>
          {/* Chart Section */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-800">
      Total Revenue Statistics
    </h3>
    <select className="bg-gray-50 border  rounded-md px-3 py-1 text-sm focus:outline-none ">
      <option>Yearly</option>
      <option>Monthly</option>
      <option>Weekly</option>
    </select>
  </div>

  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={revenueData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="revenue" fill="#93C5FD" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>

   
          </div>
        </div>

        {/* Right Section: Transactions */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Recent Transactions</h3>
            <button className="text-blue-600 text-sm hover:underline">
              View All
            </button>
          </div>
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex justify-between text-sm border-b pb-2 last:border-0"
              >
                <span>{tx.name}</span>
                <span
                  className={`font-medium ${
                    tx.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
