import React from "react";

export default function YourCommision() {
  const students = [
    {
      id: "stud301",
      name: "Rahul Kumar",
      contact: "7878787878",
      total: 10000,
      paid: 7000,
      remaining: 3000,
    },
    {
      id: "stud302",
      name: "Anjali Verma",
      contact: "9090909090",
      total: 12000,
      paid: 8000,
      remaining: 4000,
    },
  ];

  return (
    <div className="p-6">
      {/* ✅ Desktop Table */}
      <div className="hidden md:block rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="px-4 py-2">Student ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Contact No</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Paid Amount</th>
              <th className="px-4 py-2">Remaining Amount</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="text-center">
                <td className="px-4 py-2 text-black">{s.id}</td>
                <td className="px-4 py-2 text-black">{s.name}</td>
                <td className="px-4 py-2 text-black">{s.contact}</td>
                <td className="px-4 py-2 text-black">₹{s.total}</td>
                <td className="px-4 py-2 text-green-600 font-semibold">
                  ₹{s.paid}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      s.remaining > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"
                    }
                  >
                    ₹{s.remaining}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">
                    View
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
              <span className={s.remaining > 0 ? "text-red-600" : "text-green-600"}>
                ₹{s.remaining}
              </span>
            </div>
            <div className="mt-3 text-right">
              <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
