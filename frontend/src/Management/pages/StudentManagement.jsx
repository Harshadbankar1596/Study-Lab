import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import StudentPopup from "../components/StudentManagementPopup";
import NotifyPopup from "../components/NotifyPopup";
import { useGetAllStudentsQuery } from "../redux/Api/StudentAPI";

const StudentsManagement = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const { data, isLoading, isError } = useGetAllStudentsQuery();

  // Process API data
  const studentData = data?.students || [];

  // Calculate statistics
  const totalStudents = studentData.length;
  const activeStudents = studentData.filter((s) => s.isApproved).length;
  const inactiveStudents = studentData.filter((s) => !s.isApproved).length;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading students data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error loading students data</p>
      </div>
    );
  }

  return (
    <div className="p-6 px-0 min-h-screen">
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0073FF1A] p-4 rounded-xl flex items-center gap-4">
          <div className="bg-[#0073FF] w-12 h-12 flex items-center justify-center rounded-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Total Students</p>
            <p className="text-2xl font-bold">{totalStudents}</p>
          </div>
        </div>

        <div className="bg-[#0073FF1A] p-4 rounded-xl flex items-center gap-4">
          <div className="bg-green-500 w-12 h-12 flex items-center justify-center rounded-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Active Students</p>
            <p className="text-2xl font-bold">{activeStudents}</p>
          </div>
        </div>

        <div className="bg-[#C9010A14] p-4 rounded-xl flex items-center gap-4 font-outfit">
          <div className="bg-red-500 w-12 h-12 flex items-center justify-center rounded-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Inactive Students</p>
            <p className="text-2xl font-bold">{inactiveStudents}</p>
          </div>
        </div>
      </div>

      {/* ✅ Desktop Table */}
      <div className="bg-white p-6 rounded-xl overflow-x-auto hidden sm:block">
        <table className="w-full border-collapse font-outfit">
          <thead>
            <tr className="bg-gray-100 text-left text-black font-medium">
              <th className="p-3">Student ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Contact No</th>
              <th className="p-3">Status</th>
              <th className="p-3">Registered On</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment Status</th>
              {/* <th className="p-3">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {studentData.map((student, index) => (
              <tr
                key={student._id}
                className="border-b hover:bg-gray-50 text-black"
              >
                <td
                  className="p-3 text-blue-600 underline cursor-pointer"
                  // onClick={() => setSelectedStudent(student)}
                >
                  {student._id.slice(-6).toUpperCase()}
                </td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.email}</td>
                <td className="p-3">{student.contact}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {student.isApproved ? "Active" : "Pending"}
                  </span>
                </td>
                <td className="p-3">{formatDate(student.createdAt)}</td>
                <td className="p-3">₹{student.regiterationAmount || "0"}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.paymentStatus === "Done"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.paymentStatus || "Pending"}
                  </span>
                </td>
                <td className="p-3 hidden items-center gap-2 ">
                  <button
                    onClick={() => setNotifyOpen(true)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-3xl hover:bg-blue-600"
                  >
                    Notify
                  </button>
                  <button className="text-red-600 px-2 py-1 rounded hover:bg-red-100 flex items-center gap-1">
                    <RiDeleteBin6Line />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Cards */}
      <div className="block sm:hidden space-y-4">
        {studentData.map((student) => (
          <div
            key={student._id}
            className="bg-white p-4 rounded-xl shadow border border-gray-100"
          >
            <p
              className="text-blue-600 font-semibold cursor-pointer underline"
              onClick={() => setSelectedStudent(student)}
            >
              {student._id.slice(-6).toUpperCase()} - {student.name}
            </p>
            <p className="text-sm text-gray-600">Email: {student.email}</p>
            <p className="text-sm text-gray-600">Contact: {student.contact}</p>
            <p className="text-sm text-gray-600">
              Status:{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  student.isApproved
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {student.isApproved ? "Active" : "Pending"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Registered: {formatDate(student.createdAt)}
            </p>
            <p className="text-sm text-gray-800 font-medium">
              Amount: ₹{student.regiterationAmount || "0"}
            </p>
            <p className="text-sm text-gray-600">
              Payment:{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  student.paymentStatus === "Done"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {student.paymentStatus || "Pending"}
              </span>
            </p>

            <div className=" gap-3 mt-3 hidden">
              <button
                onClick={() => setNotifyOpen(true)}
                className="bg-blue-500 text-white px-4 py-1 rounded-3xl hover:bg-blue-600"
              >
                Notify
              </button>
              <button className="text-red-600 px-3 py-1 rounded hover:bg-red-100 flex items-center gap-1">
                <RiDeleteBin6Line />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Student Popup */}
      {selectedStudent && (
        <StudentPopup
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          student={selectedStudent}
        />
      )}

      {/* Notify Popup */}
      <NotifyPopup
        isOpen={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        onSend={(msg) => console.log("Message Sent:", msg)}
      />
    </div>
  );
};

export default StudentsManagement;
