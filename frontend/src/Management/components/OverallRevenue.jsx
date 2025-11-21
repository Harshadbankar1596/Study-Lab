import React from "react";

export default function OverallRevenue() {
  const students = [
    {
      id: "stud301",
      name: "Rahul Kumar",
      contact: "7878787878",
      date: "20/09/2025",
      method: "UPI",
      amount: 10000,
    },
    {
      id: "stud302",
      name: "Sneha Patil",
      contact: "9876543210",
      date: "22/09/2025",
      method: "Cash",
      amount: 5000,
    },
  ];

  return (
    <div className="p-6">
      {/* ✅ Desktop Table */}
      <div className="hidden md:block rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-black">Student ID</th>
              <th className="px-4 py-2 text-black">Name</th>
              <th className="px-4 py-2 text-black">Contact No</th>
              <th className="px-4 py-2 text-black">Date</th>
              <th className="px-4 py-2 text-black">Payment Method</th>
              <th className="px-4 py-2 text-black">Amount</th>
              {/* <th className="px-4 py-2">Action</th>  */}
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="text-center">
                <td className="px-4 py-2 text-black">{s.id}</td>
                <td className="px-4 py-2 text-black">{s.name}</td>
                <td className="px-4 py-2 text-black">{s.contact}</td>
                <td className="px-4 py-2 text-black">{s.date}</td>
                <td className="px-4 py-2 text-black">{s.method}</td>
                <td className="px-4 py-2 font-semibold text-black">₹{s.amount}</td>
                <td className="px-4 py-2">
                  {/* <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">
                    View
                  </button> */}
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
              <span className="font-medium text-gray-600">Date:</span>
              <span>{s.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Method:</span>
              <span>{s.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Amount:</span>
              <span className="font-semibold">₹{s.amount}</span>
            </div>
            <div className="mt-3 text-right">
              {/* <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">
                View
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
