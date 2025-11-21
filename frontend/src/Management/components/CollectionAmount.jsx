import React from "react";

export default function CollectedAmount() {
  const students = [
    {
      id: "stud101",
      name: "Alice Smith",
      contact: "9999999999",
      date: "25/09/2025",
      method: "UPI",
      collected: 5000,
    },
    {
      id: "stud102",
      name: "Bob Johnson",
      contact: "8888888888",
      date: "26/09/2025",
      method: "Cash",
      collected: 9000,
    },
  ];

  return (
    <div className="p-6">
      {/* ✅ Desktop Table */}
      <div className="rounded-lg overflow-x-auto hidden sm:block">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-blue-50 text-gray-700 text-left">
            <tr>
              <th className="px-3 py-2">Student ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Contact No</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Payment Method</th>
              <th className="px-3 py-2 ">Collected Amount</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-3 py-2 text-black">{s.id}</td>
                <td className="px-3 py-2 text-black">{s.name}</td>
                <td className="px-3 py-2 text-black">{s.contact}</td>
                <td className="px-3 py-2 text-black">{s.date}</td>
                <td className="px-3 py-2 text-black">{s.method}</td>
                <td className="px-3 py-2  font-semibold text-green-600">
                  ₹{s.collected}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Cards */}
      <div className="block sm:hidden space-y-3">
        {students.map((s, i) => (
          <div
            key={i}
            className="bg-white p-3 rounded-lg shadow border border-gray-100"
          >
            <p className="text-blue-600 font-semibold">{s.id}</p>
            <p className="text-gray-800 font-medium">{s.name}</p>
            <p className="text-xs text-gray-600">Contact: {s.contact}</p>
            <p className="text-xs">Date: {s.date}</p>
            <p className="text-xs">Method: {s.method}</p>
            <p className="text-xs font-semibold text-green-600 ">
              Collected: ₹{s.collected}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
