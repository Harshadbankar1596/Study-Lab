// import React, { useState } from "react";
// import { FaUsers, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
// import { useGetAllStaffQuery } from "../redux/Api/StaffAPI";

// const StaffAttendance = () => {
//   const [staffData] = useState([
//     {
//       id: "staff12",
//       name: "John Doe",
//       contact: "8585858585",
//       role: "Library Manager",
//       attendance: [
//         { date: "20/08/2025", status: "Absent" },
//         { date: "21/08/2025", status: "Present" },
//         { date: "22/08/2025", status: "Absent" },
//         { date: "23/08/2025", status: "Absent" },
//       ],
//     },
//   ]);

//   const [selectedStaff, setSelectedStaff] = useState(null);
//   const [attendance, setAttendance] = useState([]);

//   const { data } = useGetAllStaffQuery();
//   console.log(data);

//   {
//     /**
//   {
//     "staff": [
//         {
//             "_id": "690051bfcfeeb4e32d717158",
//             "name": "PALLAVI",
//             "contact": "7558645864",
//             "role": "ghfhgf",
//             "__v": 0
//         },
//         {
//             "_id": "6901e359246ffe655db09547",
//             "name": "shivani",
//             "contact": "9876543332",
//             "role": "cmnb",
//             "__v": 0
//         }
//     ]
// }

//   */
//   }

//   const currentDate = "10/08/2025";

//   const handleStatusChange = (index, newStatus) => {
//     setAttendance((prev) =>
//       prev.map((row, i) => (i === index ? { ...row, status: newStatus } : row))
//     );
//   };

//   const openModal = (staff) => {
//     setSelectedStaff(staff);
//     setAttendance(staff.attendance); // load staff’s attendance
//   };

//   return (
//     <div className="p-6 min-h-screen font-sans">
//       {/* Header Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//         <div className="bg-blue-100 p-4 rounded-lg flex items-center justify-between">
//           <div className="bg-blue-600 w-12 h-12 flex items-center justify-center rounded-md">
//             <FaUsers className="text-white text-2xl" />
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Total Staff</p>
//             <h2 className="text-2xl font-bold text-blue-800">10</h2>
//           </div>
//         </div>
//         <div className="bg-yellow-100 p-4 rounded-lg flex items-center justify-between">
//           <div className="bg-yellow-500 w-12 h-12 flex items-center justify-center rounded-md">
//             <FaCalendarAlt className="text-white text-2xl" />
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Date</p>
//             <h2 className="text-2xl font-bold text-yellow-800">
//               {currentDate}
//             </h2>
//           </div>
//         </div>
//         <div className="bg-green-100 p-4 rounded-lg flex items-center justify-between">
//           <div className="bg-green-600 w-12 h-12 flex items-center justify-center rounded-md">
//             <FaCheckCircle className="text-white text-2xl" />
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Total Present</p>
//             <h2 className="text-2xl font-bold text-green-800">10</h2>
//           </div>
//         </div>
//       </div>

//       {/* Staff Table */}
//       <div className="bg-white rounded-lg overflow-x-auto">
//         <table className="min-w-full border border-gray-200 text-sm">
//           <thead className="bg-blue-50 text-gray-700 font-medium">
//             <tr>
//               <th className="px-4 py-3 border-b">Staff ID</th>
//               <th className="px-4 py-3 border-b">Name</th>
//               <th className="px-4 py-3 border-b">Contact No</th>
//               <th className="px-4 py-3 border-b">Role</th>
//               <th className="px-4 py-3 border-b">Status</th>
//               <th className="px-4 py-3 border-b">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {staffData.map((staff, idx) => (
//               <tr key={idx} className="hover:bg-gray-50">
//                 <td className="px-4 py-3 border-b">{staff.id}</td>
//                 <td className="px-4 py-3 border-b">{staff.name}</td>
//                 <td className="px-4 py-3 border-b">{staff.contact}</td>
//                 <td className="px-4 py-3 border-b">{staff.role}</td>
//                 <td className="px-4 py-3 border-b">
//                   <div className="flex gap-4">
//                     <label className="inline-flex items-center gap-1">
//                       <input type="checkbox" className="form-checkbox" />
//                       <span>Present</span>
//                     </label>
//                     <label className="inline-flex items-center gap-1">
//                       <input type="checkbox" className="form-checkbox" />
//                       <span>Absent</span>
//                     </label>
//                     <label className="inline-flex items-center gap-1">
//                       <input type="checkbox" className="form-checkbox" />
//                       <span>On Leave</span>
//                     </label>
//                   </div>
//                 </td>
//                 <td className="px-4 py-3 border-b">
//                   <button
//                     onClick={() => openModal(staff)}
//                     className="text-blue-600 hover:underline hover:text-blue-800"
//                   >
//                     View Detail
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {selectedStaff && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white w-[600px] rounded-xl shadow-lg">
//             {/* Header */}
//             <div className="flex justify-between items-center p-4 border-b bg-gray-100 rounded-t-xl">
//               <div>
//                 <h2 className="font-semibold text-gray-800">
//                   {selectedStaff.name}
//                 </h2>
//               </div>
//               <div className="text-sm text-gray-600">
//                 Staff ID: {selectedStaff.id}
//               </div>
//               <div className="text-sm font-medium text-gray-700">
//                 Role – {selectedStaff.role}
//               </div>
//             </div>

//             {/* Table */}
//             <div className="p-4">
//               <table className="w-full border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-blue-50 text-gray-700 text-left">
//                     <th className="py-2 px-3">Date</th>
//                     <th className="py-2 px-3">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {attendance.map((row, index) => (
//                     <tr key={index} className="border-b">
//                       <td className="py-2 px-3">{row.date}</td>
//                       <td className="py-2 px-3 flex gap-6 items-center">
//                         <label className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             checked={row.status === "Present"}
//                             onChange={() =>
//                               handleStatusChange(index, "Present")
//                             }
//                             className="w-4 h-4 accent-green-600"
//                           />
//                           Present
//                         </label>

//                         <label className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             checked={row.status === "Absent"}
//                             onChange={() => handleStatusChange(index, "Absent")}
//                             className="w-4 h-4 accent-green-600"
//                           />
//                           Absent
//                         </label>

//                         <label className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             checked={row.status === "On Leave"}
//                             onChange={() =>
//                               handleStatusChange(index, "On Leave")
//                             }
//                             className="w-4 h-4 accent-gray-400"
//                           />
//                           On Leave
//                         </label>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Footer */}
//             <div className="flex justify-end gap-3 p-4 border-t">
//               <button
//                 onClick={() => setSelectedStaff(null)}
//                 className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
//               >
//                 Close
//               </button>
//               <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StaffAttendance;

import React, { useState } from "react";
import { FaUsers, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { useGetAllStaffQuery } from "../redux/Api/StaffAPI";

const StaffAttendance = () => {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [attendance, setAttendance] = useState([]);

  const { data, isLoading, isError } = useGetAllStaffQuery();

  const currentDate = new Date()
    .toLocaleDateString("en-GB")
    .replace(/\//g, "/");

  const handleStatusChange = (index, newStatus) => {
    setAttendance((prev) =>
      prev.map((row, i) => (i === index ? { ...row, status: newStatus } : row))
    );
  };

  const openModal = (staff) => {
    setSelectedStaff(staff);
    // Initialize attendance array if it doesn't exist
    setAttendance(staff.attendance || []);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-6 min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="p-6 min-h-screen font-sans flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading staff data. Please try again.</p>
        </div>
      </div>
    );
  }

  // Get staff array from API response
  const staffData = data?.staff || [];
  const totalStaff = staffData.length;

  return (
    <div className="p-6 min-h-screen font-sans">
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg flex items-center justify-between">
          <div className="bg-blue-600 w-12 h-12 flex items-center justify-center rounded-md">
            <FaUsers className="text-white text-2xl" />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Staff</p>
            <h2 className="text-2xl font-bold text-blue-800">{totalStaff}</h2>
          </div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg flex items-center justify-between">
          <div className="bg-yellow-500 w-12 h-12 flex items-center justify-center rounded-md">
            <FaCalendarAlt className="text-white text-2xl" />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Date</p>
            <h2 className="text-2xl font-bold text-yellow-800">
              {currentDate}
            </h2>
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg flex items-center justify-between">
          <div className="bg-green-600 w-12 h-12 flex items-center justify-center rounded-md">
            <FaCheckCircle className="text-white text-2xl" />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Present</p>
            <h2 className="text-2xl font-bold text-green-800">0</h2>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg overflow-x-auto">
        {staffData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No staff members found
          </div>
        ) : (
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-blue-50 text-gray-700 font-medium">
              <tr>
                <th className="px-4 py-3 border-b">Staff ID</th>
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">Contact No</th>
                <th className="px-4 py-3 border-b">Role</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {staffData.map((staff, idx) => (
                <tr key={staff._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{staff._id}</td>
                  <td className="px-4 py-3 border-b">{staff.name}</td>
                  <td className="px-4 py-3 border-b">{staff.contact}</td>
                  <td className="px-4 py-3 border-b">{staff.role}</td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex gap-4">
                      <label className="inline-flex items-center gap-1">
                        <input type="checkbox" className="form-checkbox" />
                        <span>Present</span>
                      </label>
                      <label className="inline-flex items-center gap-1">
                        <input type="checkbox" className="form-checkbox" />
                        <span>Absent</span>
                      </label>
                      <label className="inline-flex items-center gap-1">
                        <input type="checkbox" className="form-checkbox" />
                        <span>On Leave</span>
                      </label>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b">
                    <button
                      onClick={() => openModal(staff)}
                      className="text-blue-600 hover:underline hover:text-blue-800"
                    >
                      View Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-100 rounded-t-xl">
              <div>
                <h2 className="font-semibold text-gray-800">
                  {selectedStaff.name}
                </h2>
              </div>
              <div className="text-sm text-gray-600">
                Staff ID: {selectedStaff._id}
              </div>
              <div className="text-sm font-medium text-gray-700">
                Role – {selectedStaff.role}
              </div>
            </div>

            {/* Table */}
            <div className="p-4">
              {attendance.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No attendance records found for this staff member
                </div>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-blue-50 text-gray-700 text-left">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-3">{row.date}</td>
                        <td className="py-2 px-3 flex gap-6 items-center">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={row.status === "Present"}
                              onChange={() =>
                                handleStatusChange(index, "Present")
                              }
                              className="w-4 h-4 accent-green-600"
                            />
                            Present
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={row.status === "Absent"}
                              onChange={() =>
                                handleStatusChange(index, "Absent")
                              }
                              className="w-4 h-4 accent-green-600"
                            />
                            Absent
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={row.status === "On Leave"}
                              onChange={() =>
                                handleStatusChange(index, "On Leave")
                              }
                              className="w-4 h-4 accent-gray-400"
                            />
                            On Leave
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Close
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAttendance;
