import React from "react";
import { Users, Filter } from "lucide-react";

export default function AttendanceManagement() {
  const attendanceData = [
    {
      studentId: "Stud123",
      name: "John Doe",
      seatId: "F1-R1-S1",
      date: "20/08/2025",
      checkIn: "11:00 Am",
      checkOut: "12:00 pm",
      hours: "2 h",
      remark: "Present",
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {/* Present */}
        <div className="flex items-center justify-between bg-[#05950017] rounded-xl p-4 sm:p-6 w-full md:w-96">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600 text-white rounded-md">
              <Users size={28} />
            </div>
            <div>
              <p className="text-gray-600 text-sm sm:text-base">
                Total Present Today
              </p>
              <p className="text-xl sm:text-2xl font-bold text-green-700">10</p>
            </div>
          </div>
        </div>

        {/* Absent */}
        <div className="flex items-center justify-between bg-[#CC00000F] rounded-xl p-4 sm:p-6 w-full md:w-96 md:-ml-56">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 text-white rounded-md">
              <Users size={28} />
            </div>
            <div>
              <p className="text-gray-600 text-sm sm:text-base">
                Total Absent Today
              </p>
              <p className="text-xl sm:text-2xl font-bold text-red-700">10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table + Mobile Cards */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">
            Attendance Records
          </h2>
          <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm sm:text-base">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* ✅ Desktop Table */}
        <div className="hidden sm:block w-full overflow-x-auto">
          <table className="min-w-[650px] w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Seat ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Check In</th>
                <th className="px-4 py-3">Check Out</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Remark</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors text-black"
                >
                  <td className="px-4 py-3">{record.studentId}</td>
                  <td className="px-4 py-3">{record.name}</td>
                  <td className="px-4 py-3">{record.seatId}</td>
                  <td className="px-4 py-3">{record.date}</td>
                  <td className="px-4 py-3">{record.checkIn}</td>
                  <td className="px-4 py-3">{record.checkOut}</td>
                  <td className="px-4 py-3">{record.hours}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      record.remark === "Present"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {record.remark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile Card View */}
        <div className="block sm:hidden p-4 space-y-4">
          {attendanceData.map((record, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm bg-gray-50 text-sm"
            >
              <p>
                <span className="font-semibold">Student ID:</span>{" "}
                {record.studentId}
              </p>
              <p>
                <span className="font-semibold">Name:</span> {record.name}
              </p>
              <p>
                <span className="font-semibold">Seat ID:</span> {record.seatId}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {record.date}
              </p>
              <p>
                <span className="font-semibold">Check In:</span> {record.checkIn}
              </p>
              <p>
                <span className="font-semibold">Check Out:</span>{" "}
                {record.checkOut}
              </p>
              <p>
                <span className="font-semibold">Hours:</span> {record.hours}
              </p>
              <p
                className={`font-semibold ${
                  record.remark === "Present"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Remark: {record.remark}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
