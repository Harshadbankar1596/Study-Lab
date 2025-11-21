import React, { useState } from "react";
import { MdEventSeat, MdPayment } from "react-icons/md";

const NotificationPopup = ({ isOpen }) => {
  const [activeTab, setActiveTab] = useState("all");

  if (!isOpen) return null; // Only show when opened

  return (
    <div className="absolute right-4 top-14 w-96 bg-white shadow-xl rounded-xl overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <button className="text-blue-600 text-sm hover:underline">
          ✓ Mark as all read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "all"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Notifications
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "unread"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("unread")}
        >
          Unread
        </button>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {/* Notification 1 */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
            <MdEventSeat className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 text-sm">
              Seat Booking Reminder
            </p>
            <p className="text-xs text-gray-500">
              Your booking for Seat A12 (Floor 1) will expire in 3 days. Please
              renew to avoid cancellation.
            </p>
          </div>
          <span className="text-xs text-gray-400">12 Aug 2025</span>
        </div>

        {/* Notification 2 */}
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
          <div className="p-2 bg-blue-600 rounded-full text-white">
            <MdPayment className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 text-sm">
              Payment Successful
            </p>
            <p className="text-xs text-gray-500">
              ₹700 has been successfully paid for your September booking.
              Receipt available in Payments section.
            </p>
          </div>
          <span className="text-xs text-gray-400">12 Aug 2025</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
