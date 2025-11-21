import React, { useState } from "react";
import { X, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useAddTimeSlotMutation } from "../redux/Api/TimeSlotAPI";

const TimeSlotPopup = ({ isOpen, onClose }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [addTimeSlot, { isLoading }] = useAddTimeSlotMutation();

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!from || !to) {
      toast.error("Please select both 'From' and 'To' times");
      return;
    }

    try {
      // Convert to ISO format with today's date and timezone (+05:30)
      const today = new Date().toISOString().split("T")[0]; // e.g. 2025-09-29
      const fromTime = `${today}T${from}:00+05:30`;
      const toTime = `${today}T${to}:00+05:30`;

      const res = await addTimeSlot({ fromTime, toTime }).unwrap();

      toast.success(res?.message || "Time slot added successfully!");
      setFrom("");
      setTo("");
      onClose();
    } catch (error) {
      console.error("Add TimeSlot Error:", error);
      toast.error(error?.data?.message || "Failed to add time slot");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-xl w-[350px] p-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-sm font-medium mb-3 text-black">Select Time</h2>

        {/* Time Inputs */}
        <div className="grid grid-cols-2 gap-3 border p-3 rounded-lg">
          {/* From */}
          <div className="relative">
            <label className="text-xs text-black">From</label>
            <input
              type="time"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-2 pr-8 border rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            />
            <Clock
              size={18}
              className="absolute right-2 bottom-2 text-black pointer-events-none"
            />
          </div>

          {/* To */}
          <div className="relative">
            <label className="text-xs text-black">To</label>
            <input
              type="time"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-2 pr-8 border rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            />
            <Clock
              size={18}
              className="absolute right-2 bottom-2 text-black pointer-events-none"
            />
          </div>
        </div>

        {/* Add Slot Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className={`${
              isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-5 py-2 rounded-lg transition-colors`}
          >
            {isLoading ? "Adding..." : "+ Add Slot"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPopup;
