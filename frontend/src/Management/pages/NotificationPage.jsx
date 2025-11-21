import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import NotificationPopup from "../components/CreateNotificationPopup";

const NotificationPage = () => {
  const [tab, setTab] = useState("recent");
  const [showPopup, setShowPopup] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Fee Payment Due Reminder",
      message:
        "Dear Student, your monthly library fee of 150.00 is due on 25th Sept 2025. Kindly make the payment to avoid late charges.",
      category: "Fees Reminder",
      audience: "Target Audience",
      date: "12/08/2025 10:00 AM",
      status: "Scheduled",
    },
    {
      id: 2,
      title: "Exam Reminder",
      message:
        "Dear Student, your semester exams will start on 1st Oct 2025. Kindly check the timetable and be prepared.",
      category: "Exam Reminder",
      audience: "All Students",
      date: "20/09/2025 09:00 AM",
      status: "Scheduled",
    },
    {
      id: 3,
      title: "Holiday Announcement",
      message:
        "Dear Student, the institute will remain closed on 21st Sept 2025 due to a public holiday.",
      category: "General Announcement",
      audience: "All Students",
      date: "17/09/2025 10:00 AM",
      status: "Sent",
    },
  ];

  const filteredNotifications =
    tab === "all"
      ? notifications
      : notifications.filter((n) =>
          tab === "recent" ? n.status === "Sent" : n.status === "Scheduled"
        );

  return (
    <div className="p-6  min-h-screen">
      {/* Tabs + Create Notification */}
      <div className="flex justify-between items-center mb-6">
        {/* Tabs */}
        <div className="flex bg-blue-50 p-1 rounded-lg space-x-2">
          <button
            onClick={() => setTab("recent")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              tab === "recent"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            Recent Notifications
          </button>
          <button
            onClick={() => setTab("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              tab === "all"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setTab("scheduled")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              tab === "scheduled"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            Scheduled
          </button>
        </div>

        {/* Create Notification Button */}
        <button
          onClick={() => setShowPopup(true)}
          className="text-green-600 font-medium hover:underline"
        >
          + Create Notification
        </button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden text-black">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Audience</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3 max-w-xs">{item.message}</td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">{item.audience}</td>
                  <td className="px-4 py-3">{item.date}</td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      item.status === "Scheduled"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {item.status}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-red-600 hover:scale-110">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No notifications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {showPopup && <NotificationPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default NotificationPage;
