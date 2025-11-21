import React from "react";

export default function RemainingAmount() {
  const students = [
    {
      id: "stud213",
      name: "John Doe",
      contact: "8585858585",
      total: 7000,
      paid: 2000,
      remaining: 5000,
    },
    {
      id: "stud214",
      name: "Amit Verma",
      contact: "9876543210",
      total: 10000,
      paid: 8000,
      remaining: 2000,
    },
    {
      id: "stud215",
      name: "Sneha Patil",
      contact: "9988776655",
      total: 6000,
      paid: 6000,
      remaining: 0,
    },
  ];

  return (
    <div className="p-6">
      {/* ✅ Desktop Table */}
      <div className="hidden md:block rounded-lg overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-blue-50 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3 text-black">Student ID</th>
              <th className="px-4 py-3 text-black">Name</th>
              <th className="px-4 py-3 text-black">Contact No</th>
              <th className="px-4 py-3 text-right text-black">Total Amount</th>
              <th className="px-4 py-3 text-right text-black">Paid Amount</th>
              <th className="px-4 py-3 text-right text-black">Remaining Amount</th>
              <th className="px-4 py-3 text-center text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 text-black">{s.id}</td>
                <td className="px-4 py-2 text-black">{s.name}</td>
                <td className="px-4 py-2 text-black">{s.contact}</td>
                <td className="px-4 py-2 text-black text-right font-medium">₹{s.total}</td>
                <td className="px-4 py-2  text-black text-right text-green-600 font-medium">
                  ₹{s.paid}
                </td>
                <td
                  className={`px-4 py-2 text-right font-medium ${
                    s.remaining > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  ₹{s.remaining}
                </td>
                <td className="px-4 py-2 text-center">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md shadow hover:bg-blue-600 transition">
                    Notify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card View */}
      <div className="md:hidden space-y-4">
        {students.map((s, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Student ID:</span>
              <span>{s.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Name:</span>
              <span>{s.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Contact:</span>
              <span>{s.contact}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Total:</span>
              <span>₹{s.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Paid:</span>
              <span className="text-green-600 font-semibold">₹{s.paid}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Remaining:</span>
              <span
                className={s.remaining > 0 ? "text-red-600" : "text-green-600"}
              >
                ₹{s.remaining}
              </span>
            </div>
            <div className="mt-3 text-right">
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md shadow hover:bg-blue-600 transition">
                Notify
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
