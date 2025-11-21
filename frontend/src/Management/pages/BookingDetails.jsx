import React, { useState, useEffect } from "react";
import { useGetAllBookingsQuery } from "../redux/Api/BookingsAPI";

const BookingInformation = () => {
  const [activeFloor, setActiveFloor] = useState("Floor 1");
  const [activeTime, setActiveTime] = useState("all");
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [enrichedBookings, setEnrichedBookings] = useState([]);

  const { data, isLoading, isError } = useGetAllBookingsQuery();

  const bookings = Array.isArray(data?.bookings) ? data.bookings : [];

  // Enrich bookings with floor data based on seatNo
  useEffect(() => {
    const enriched = bookings.map((booking) => {
      // Determine floor based on seat number
      // Adjust this logic based on your seat numbering system
      const seatNo = parseInt(booking.seatNo) || 0;
      const floor = seatNo > 0 && seatNo <= 5 ? "1" : "2";

      return {
        ...booking,
        floor: floor,
      };
    });
    setEnrichedBookings(enriched);
  }, [bookings]);

  const selectedFloor = activeFloor.replace("Floor ", "").trim();

  // Filter by floor first
  let filteredBookings = enrichedBookings.filter(
    (b) => b.floor.toString() === selectedFloor
  );

  // Then filter by timing if not "all"
  if (activeTime !== "all") {
    filteredBookings = filteredBookings.filter(
      (b) => b.timings?.toLowerCase() === activeTime
    );
  }

  // Sort by booking date (newest first)
  filteredBookings.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleNotifyClick = (booking) => {
    setSelectedBooking(booking);
    setIsNotifyOpen(true);
  };

  const handleSendNotification = (message) => {
    console.log(`Notification sent to ${selectedBooking?.name}:`, message);
    setIsNotifyOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "booked":
        return "bg-green-100 text-green-700";
      case "expired":
        return "bg-red-100 text-red-700";
      case "vacant":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-500">Loading bookings...</div>
    );

  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load booking data.
      </div>
    );

  return (
    <div className="flex-1 p-6 bg-white rounded-lg shadow-md relative">
      {/* Floor Tabs */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {["Floor 1", "Floor 2"].map((floor) => (
          <button
            key={floor}
            onClick={() => setActiveFloor(floor)}
            className={`px-6 py-2 rounded-lg font-medium transition ${activeFloor === floor
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {floor}
          </button>
        ))}
      </div>

      {/* Time Filters */}
      <div className="flex gap-3 mb-5 bg-gray-100 rounded-lg p-2 w-fit">
        {[
          { label: "All", value: "all" },
          { label: "Morning", value: "morning" },
          { label: "Evening", value: "evening" },
          { label: "Full Day", value: "fullday" },
        ].map((slot) => (
          <button
            key={slot.value}
            onClick={() => setActiveTime(slot.value)}
            className={`px-4 py-1.5 rounded-lg font-medium transition ${activeTime === slot.value
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {slot.label}
          </button>
        ))}
      </div>

      {/* Booking Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse rounded-lg overflow-hidden text-center">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th className="p-3 text-center">Booking ID</th>
              <th className="p-3 text-center">Seat No</th>
              <th className="p-3 text-center">Customer Name</th>
              <th className="p-3 text-center">Timings</th>
              <th className="p-3 text-center">Booking Date</th>
              <th className="p-3 text-center">Vacant Date</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Registration Amount</th>
              <th className="p-3 text-center">Booking Amount</th>

              {/* <th className="p-3 text-center">Actions</th>   */}
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={`border-b text-sm ${booking.status === "booked"
                    ? "bg-green-50"
                    : booking.status === "expired"
                      ? "bg-red-50"
                      : "hover:bg-gray-50"
                    }`}
                >
                  <td className="p-3 whitespace-nowrap font-medium text-center">
                    #{booking._id.slice(-6).toUpperCase()}
                  </td>

                  <td className="p-3 text-center">{booking.seatNo}</td>
                  <td className="p-3 text-center">{booking?.userId?.name || "N/A"}</td>
                  <td className="p-3 text-center capitalize">{booking.timings || "N/A"}</td>
                  <td className="p-3 text-center">
                    {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-3 text-center">
                    {booking.expiryDate ? new Date(booking.expiryDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "N/A"}
                    </span>
                  </td>
                  <td className="p-3 text-center">{booking.userId.regiterationAmount || "N/A"}</td>
                  <td className="p-3 text-center">{booking.discountedAmount || "N/A"}</td>

                  {/* <td className="p-3 flex gap-2 justify-center whitespace-nowrap">
                    <button
                      onClick={() => handleNotifyClick(booking)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition"
                    >
                      Notify
                    </button>
                    <button className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700 transition">
                      Release
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition">
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center text-gray-500 py-6 font-medium"
                >
                  No {activeTime === "all" ? "" : activeTime} bookings found for{" "}
                  {activeFloor}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Notify Modal */}
      {isNotifyOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Send Notification</h2>
            <p className="text-sm text-gray-600 mb-4">
              To: <span className="font-semibold">{selectedBooking?.name}</span>
            </p>
            <textarea
              className="w-full border border-gray-300 rounded p-2 text-sm mb-4"
              placeholder="Type your message..."
              rows="4"
              defaultValue={`Hello ${selectedBooking?.name}, `}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsNotifyOpen(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendNotification()}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingInformation;
