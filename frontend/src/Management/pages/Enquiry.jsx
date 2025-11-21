import React, { useState } from "react";
import { useGetAllEnquiriesQuery } from "../redux/Api/EnquiryAPI";

const Enquiries = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null); // For modal
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch enquiries
  const { data, isLoading, isError } = useGetAllEnquiriesQuery();

  // ✅ Extract array safely
  const enquiries = Array.isArray(data)
    ? data
    : data?.data || data?.enquiries || [];

  // ✅ Filter by tab
  const filteredData = enquiries.filter((item) => {
    const hasAnswer = item.answer && item.answer.trim() !== "";
    if (activeTab === "answered") return hasAnswer;
    if (activeTab === "pending") return !hasAnswer;
    return true;
  });

  // ✅ Helper: truncate long text
  const truncate = (text, max = 50) => {
    if (!text) return "—";
    return text.length > max ? text.slice(0, max) + "..." : text;
  };

  // ✅ Handle modal
  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // ✅ Loading & Error
  if (isLoading)
    return (
      <p className="text-center py-10 text-gray-500">Loading enquiries...</p>
    );
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load enquiries.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full mx-auto bg-white p-4 rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="flex gap-6 border-b pb-2 mb-4 overflow-x-auto text-sm md:text-base">
          {["all", "answered", "pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 whitespace-nowrap capitalize ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 font-medium text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab === "all"
                ? "All Enquiries"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Table View (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                <th className="py-3 px-4 w-1/6">Name</th>
                <th className="py-3 px-4 w-1/6">Contact / Email</th>
                <th className="py-3 px-4 w-1/4">Query</th>
                <th className="py-3 px-4 w-1/3">Answer</th>
                <th className="py-3 px-4 w-[100px] text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b last:border-none text-sm text-gray-800"
                  >
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">
                      {item.contact}
                      <br />
                      <span className="text-xs text-gray-500">
                        {item.email || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{truncate(item.query, 50)}</td>
                    <td className="py-3 px-4">
                      {item.answer && item.answer.trim() !== ""
                        ? truncate(item.answer, 50)
                        : "— Pending —"}
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <span
                        onClick={() => handleView(item)}
                        className="text-blue-600 cursor-pointer font-medium"
                      >
                        View
                      </span>
                      {item.answer && item.answer.trim() !== "" ? (
                        <span className="text-green-600 cursor-pointer font-medium">
                          Edit
                        </span>
                      ) : (
                        <span className="text-blue-600 cursor-pointer font-medium">
                          Reply
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-500 italic"
                  >
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="space-y-4 md:hidden">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50 text-sm"
              >
                <p>
                  <span className="font-medium">Name:</span> {item.name}
                </p>
                <p>
                  <span className="font-medium">Contact:</span> {item.contact}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {item.email || "-"}
                </p>
                <p>
                  <span className="font-medium">Query:</span>{" "}
                  {truncate(item.query, 50)}
                </p>
                <p className="mt-2">
                  <span className="font-medium">Answer:</span>{" "}
                  {item.answer && item.answer.trim() !== ""
                    ? truncate(item.answer, 50)
                    : "Pending reply"}
                </p>
                <div className="mt-3 flex gap-3">
                  <span
                    onClick={() => handleView(item)}
                    className="text-blue-600 cursor-pointer font-medium"
                  >
                    View
                  </span>
                  {item.answer && item.answer.trim() !== "" ? (
                    <span className="text-green-600 cursor-pointer font-medium">
                      Edit
                    </span>
                  ) : (
                    <span className="text-blue-600 cursor-pointer font-medium">
                      Reply
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 italic">
              No enquiries found.
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[500px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Enquiry Details
            </h2>
            <p className="mb-2">
              <span className="font-medium">Name:</span> {selectedItem.name}
            </p>
            <p className="mb-2">
              <span className="font-medium">Contact:</span>{" "}
              {selectedItem.contact}
            </p>
            <p className="mb-2">
              <span className="font-medium">Email:</span>{" "}
              {selectedItem.email || "-"}
            </p>
            <p className="mt-4">
              <span className="font-medium">Query:</span>{" "}
              {selectedItem.query || "-"}
            </p>
            <p className="mt-2">
              <span className="font-medium">Answer:</span>{" "}
              {selectedItem.answer && selectedItem.answer.trim() !== ""
                ? selectedItem.answer
                : "No answer yet."}
            </p>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
