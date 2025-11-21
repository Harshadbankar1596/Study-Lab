import React from "react";

const AttendanceTab = ({ student }) => {
  // Dummy data agar student prop me attendance na ho
  const attendanceData = student?.attendanceData || [
    {
      day: "17 Sept 2025",
      checkIn: "1:20 PM",
      checkOut: "2:20 PM",
      hours: "1 h",
      remark: "Present",
    },
    {
      day: "18 Sept 2025",
      checkIn: "00:00 PM",
      checkOut: "00:00 PM",
      hours: "0 h",
      remark: "Absent",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-left">
            <th className="py-2 px-3">Day</th>
            <th className="py-2 px-3">Check In</th>
            <th className="py-2 px-3">Check Out</th>
            <th className="py-2 px-3">Hours</th>
            <th className="py-2 px-3">Remark</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((row, index) => (
            <tr
              key={index}
              className="border-b last:border-0 hover:bg-gray-50"
            >
              <td className="py-2 px-3">{row.day}</td>
              <td className="py-2 px-3">{row.checkIn}</td>
              <td className="py-2 px-3">{row.checkOut}</td>
              <td className="py-2 px-3">{row.hours}</td>
              <td
                className={`py-2 px-3 font-medium ${
                  row.remark === "Present" ? "text-green-600" : "text-red-600"
                }`}
              >
                {row.remark}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTab;
