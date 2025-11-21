import React, { useState } from "react";
import { X } from "lucide-react";
import studentImage from "/student.png";
import AttendanceTab from "./AttendanceTab";
import FeesTab from "../components/FeesTab";

const StudentPopup = ({ isOpen, onClose, student }) => {
  const [activeTab, setActiveTab] = useState("personal");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-xl w-[850px] h-[550px] p-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>

        {/* ===== Header Section ===== */}
        <div className="grid grid-cols-3 items-center border-b pb-3">
          {/* Left: Student Info */}
          <div className="flex gap-3 items-center">
            <img
              src={studentImage}
              alt="student"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-base font-outfit">
                {student?.name || "Rahul Sharma"}
              </h2>
              <p className="text-gray-500 text-xs">
                {student?.contact || "8585858585"}
              </p>
            </div>
          </div>

          {/* Middle: Time Slot */}
          <div className="text-center">
            <p className="text-blue-500 font-medium text-sm">
              {student?.timeSlot || "11:00 AM - 12:00 PM"}
            </p>
          </div>

          {/* Right: Seat ID */}
          <div className="text-right">
            <p className="text-gray-700 text-sm">
              Seat ID{" "}
              <span className="font-bold">{student?.seatId || "F1-R1-S10"}</span>
            </p>
          </div>
        </div>

        {/* ===== Status Cards Row ===== */}
        <div className="grid grid-cols-5 gap-3 mt-4">
          <div className="bg-green-100 rounded-lg p-3 text-center">
            <p className="text-gray-600 text-xs">Check In Time</p>
            <p className="text-lg font-semibold text-green-700">
              {student?.checkIn || "11:00 AM"}
            </p>
          </div>
          <div className="bg-red-100 rounded-lg p-3 text-center">
            <p className="text-gray-600 text-xs">Check Out Time</p>
            <p className="text-lg font-semibold text-red-700">
              {student?.checkOut || "11:20 AM"}
            </p>
          </div>
          <div className="bg-yellow-100 rounded-lg p-3 text-center">
            <p className="text-gray-600 text-xs mb-1">Attendance</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: student?.attendance || "80%" }}
              ></div>
            </div>
            <p className="text-sm font-semibold text-yellow-700 mt-1">
              {student?.attendance || "80%"}
            </p>
          </div>
          <div className="bg-green-100 rounded-lg p-3 text-center">
            <p className="text-gray-600 text-xs">Paid Amount</p>
            <p className="text-lg font-semibold text-green-700">
              {student?.paidAmount || "₹2000"}
            </p>
          </div>
          <div className="bg-red-100 rounded-lg p-3 text-center">
            <p className="text-gray-600 text-xs">Remaining Amount</p>
            <p className="text-lg font-semibold text-red-700">
              {student?.remainingAmount || "₹2000"}
            </p>
          </div>
        </div>

        {/* ===== Tabs ===== */}
        <div className="grid grid-cols-3 text-center mt-5 border-b">
          <button
            onClick={() => setActiveTab("personal")}
            className={`pb-1 text-sm font-medium ${
              activeTab === "personal"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`pb-1 text-sm font-medium ${
              activeTab === "attendance"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab("fees")}
            className={`pb-1 text-sm font-medium ${
              activeTab === "fees"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            Fees & Payouts
          </button>
        </div>

        {/* ===== Tab Content ===== */}
        <div className="mt-4 h-[250px] overflow-y-auto">
          {activeTab === "personal" && (
            <div className="grid grid-cols-3 gap-3 text-sm">
              {[
                { label: "Name", value: student?.name || "Rahul Sharma" },
                { label: "Contact No", value: student?.contact || "8485858585" },
                { label: "Parents No", value: student?.parentsNo || "9885858585" },
                { label: "Address", value: student?.address || "Golden City Center" },
                { label: "Registered Date", value: student?.registered || "20-08-2025" },
                { label: "Booking Date", value: student?.booking || "20-08-2025" },
                { label: "Duration", value: student?.duration || "4 Months" },
                { label: "Vacant Date", value: student?.vacant || "20-08-2025" },
                { label: "Amount", value: student?.amount || "₹2000" },
                { label: "DOB", value: student?.dob || "15-2-2002" },
                { label: "Email", value: student?.email || "rahul@gmail.com" },
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="text-gray-600 text-xs">{field.label}</label>
                  <input
                    className="w-full p-1.5 border border-gray-300 rounded-lg text-sm bg-white text-black"
                    value={field.value}
                    readOnly
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "attendance" && <AttendanceTab student={student} />}

        {activeTab === "fees" && <FeesTab student={student} />}

        </div>

        {/* ===== Action Buttons ===== */}
        <div className="flex justify-end gap-2 mt-5">
          <button className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm">
            Notify
          </button>
          <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm">
            Delete
          </button>
          <button className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm">
            Block
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPopup;
