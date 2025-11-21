import { Calendar, Clock, X } from "lucide-react";
import React, { useState } from "react";

const NotificationPopup = ({ onClose }) => {
  const [audienceType, setAudienceType] = useState("");
  const [sendType, setSendType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Format date nicely (YYYY-MM-DD -> DD MMM YYYY)
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-xl shadow-lg p-6 w-96">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <input
          type="text"
          placeholder="Enter Title"
          className="w-full mb-3 px-3 py-2 border rounded-md focus:outline-none focus:ring-black bg-white"
        />

        {/* Message */}
        <input
          type="text"
          placeholder="Enter Message"
          className="w-full mb-3 px-3 py-2 border rounded-md focus:outline-none focus:ring-black bg-white"
        />

        {/* Category */}
        <input
          type="text"
          placeholder="Enter Category e.g Fees reminder"
         className="w-full mb-3 px-3 py-2 border rounded-md focus:outline-none focus:ring-black bg-white"
        />

        {/* Audience Type */}
        <select
        className="w-full mb-3 px-3 py-2 border rounded-md focus:outline-none focus:ring-black bg-white"
          value={audienceType}
          onChange={(e) => setAudienceType(e.target.value)}
        >
          <option value="">Select Audience Type</option>
          <option value="all">All Students</option>
          <option value="target">Target Audience</option>
          <option value="admin">Admin</option>
        </select>

        {/* Show only if Target Audience */}
        {audienceType === "target" && (
          <select className="w-full mb-3 px-3 py-2 border rounded-md focus:outline-none bg-white focus:ring-2 focus:ring-black">
            <option value="">Select Students</option>
            <option value="student1">Student 1</option>
            <option value="student2">Student 2</option>
          </select>
        )}

        {/* Send Options */}
        <div className="flex items-center space-x-4 mb-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendType === "immediate"}
              onChange={() =>
                setSendType(sendType === "immediate" ? "" : "immediate")
              }
              className="appearance-none w-5 h-5 border border-gray-400 rounded bg-white checked:bg-[#059500] checked:border-[#059500] cursor-pointer"
            />
            <span>Send Immediately</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendType === "scheduled"}
              onChange={() =>
                setSendType(sendType === "scheduled" ? "" : "scheduled")
              }
              className="appearance-none w-5 h-5 border border-gray-400 rounded bg-white checked:bg-[#059500] checked:border-[#059500] cursor-pointer"
            />
            <span>Scheduled</span>
          </label>
        </div>

      
      {/* Show date + time only if scheduled */}
{sendType === "scheduled" && (
  <div className="flex space-x-4 mb-3">
    {/* Date Box */}
    <div
      className="relative flex items-center w-full bg-gray-100 rounded-lg px-4 py-3 cursor-pointer"
      onClick={() =>
        document.getElementById("dateInput").showPicker?.()
      }
    >
      <Calendar className="text-black mr-2" size={18} />
      <span className="text-black">
        {selectedDate ? formatDate(selectedDate) : "Date"}
      </span>
      <input
        id="dateInput"
        type="date"
        value={selectedDate}
        onChange={(e) => {
          setSelectedDate(e.target.value);
          e.target.blur(); // ✅ closes calendar after selection
        }}
        className="absolute opacity-0 w-full h-full left-0 top-0 cursor-pointer"
      />
    </div>

    {/* Time Box */}
    <div
      className="relative flex items-center w-full bg-gray-100 rounded-lg px-4 py-3 cursor-pointer"
      onClick={() =>
        document.getElementById("timeInput").showPicker?.()
      }
    >
      <Clock className="text-black mr-2" size={18} />
      <span className="text-black">
        {selectedTime ? selectedTime : "00 : 00"}
      </span>
      <input
        id="timeInput"
        type="time"
        value={selectedTime}
        onChange={(e) => {
          setSelectedTime(e.target.value);
          e.target.blur(); // ✅ closes time picker after selection
        }}
        className="absolute opacity-0 w-full h-full left-0 top-0 cursor-pointer"
      />
    </div>
  </div>
)}


        {/* Add Button */}
        <button className="w-full bg-[#059500] text-white py-2 rounded-md hover:bg-green-700 transition">
          + Add
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;
