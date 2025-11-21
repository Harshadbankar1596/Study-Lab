import React, { useState } from "react";
import MoneyIcon from "/moneybag.svg";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetCommisionTicketsQuery,
  useManagementPaymentMutation,
} from "../redux/Api/feesAndPaymentsAPI";
import { decryptData } from "../Utils/Encryption";

const FeesManagement = () => {
  const [activeTable, setActiveTable] = useState("Your Commission");
  const [selectedMonth, setSelectedMonth] = useState("November");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [paymentStatusFrom, setPaymentStatusFrom] = useState("paid");
  const [paymentStatusTo, setPaymentStatusTo] = useState("received");

  let management = null;
  try {
    const storedManagement = localStorage.getItem("Management");
    if (storedManagement) {
      management = decryptData(storedManagement);
    }
  } catch (error) {
    console.error("Failed to decrypt management data:", error);
  }

  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCommisionTicketsQuery({
    managementId: management?._id,
    month: selectedMonth || undefined,
    year: selectedYear || undefined,
    paymentStatus: paymentStatusFrom || undefined,
  });

  const [managementRequestPayment, { isLoading: isLoadingRequestPayment }] =
    useManagementPaymentMutation();

  const summary = [
    {
      title: "Your Commission",
      amount: "₹5000",
      color: "bg-[#0073FF0F]",
      text: "text-blue-600",
      iconBg: "bg-[#0073FF]",
    },
    {
      title: "Overall Revenue",
      amount: "₹5000",
      color: "bg-[#FCEA2B26]",
      text: "text-yellow-600",
      iconBg: "bg-[#FFCC00]",
    },
    {
      title: "Collected Amount",
      amount: "₹5000",
      color: "bg-[#0095031A]",
      text: "text-green-600",
      iconBg: "bg-[#059500]",
    },
    {
      title: "Remaining Amount",
      amount: "₹5000",
      color: "bg-[#CC00000F]",
      text: "text-red-600",
      iconBg: "bg-[#CC0000]",
    },
  ];

  const months = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const years = ["2025", "2024", "2023", "2022", "2021"];

  const paymentStatuses = ["paid", "unpaid", "received", "pending"];

  const handleRequestPayment = async () => {
    // Validation
    if (!management?._id) {
      toast.error("Management ID not found. Please log in again.");
      return;
    }

    if (!selectedMonth || !selectedYear) {
      toast.error("Please select both month and year.");
      return;
    }

    if (!paymentStatusFrom || !paymentStatusTo) {
      toast.error("Please select both payment status from and to.");
      return;
    }

    // Validate status transitions
    const validTransitions = {
      unpaid: "pending",
      paid: "received",
    };

    if (validTransitions[paymentStatusFrom] !== paymentStatusTo) {
      toast.error(
        `Invalid status transition! Only allowed transitions:\n• Unpaid → Pending\n• Paid → Received`,
        {
          duration: 4000,
        }
      );
      return;
    }

    const requestData = {
      managementId: management._id,
      month: selectedMonth,
      year: selectedYear,
      paymentStatusFrom: paymentStatusFrom,
      paymentStatusTo: paymentStatusTo,
    };

    console.log("Request Payment clicked with data:", requestData);

    // Show loading toast
    const loadingToast = toast.loading("Processing payment request...");

    try {
      const response = await managementRequestPayment(requestData).unwrap();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Success handling
      console.log("Payment request successful:", response);
      toast.success(
        `Payment request submitted successfully!\nMonth: ${selectedMonth}\nYear: ${selectedYear}\nStatus: ${paymentStatusFrom} → ${paymentStatusTo}`,
        {
          duration: 4000,
        }
      );

      // Refetch data to update the table
      refetch();
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Error handling
      console.error("Payment request failed:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to submit payment request. Please try again.";
      toast.error(errorMessage, {
        duration: 4000,
      });
    }
  };

  // Shimmer Component for Table Rows
  const ShimmerRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
      </td>
    </tr>
  );

  // Shimmer Component for Total Commission Card
  const ShimmerTotalCard = () => (
    <div className="mb-6 p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border border-gray-300 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-40"></div>
        </div>
        <div className="text-right">
          <div className="h-4 bg-gray-300 rounded w-24 mb-2 ml-auto"></div>
          <div className="h-6 bg-gray-300 rounded w-16 ml-auto"></div>
        </div>
      </div>
    </div>
  );

  // Show loader when fetching (includes filter changes)
  const showLoader = isLoading || isFetching;

  return (
    <div className="p-6 rounded-lg px-0 font-outfit">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summary.map((card, index) => (
          <div
            key={index}
            onClick={() => setActiveTable(card.title)}
            className={`p-4 rounded-lg ${card.color} flex items-center space-x-4 cursor-pointer h-24 transition-all hover:shadow-md`}
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg ${card.iconBg} shadow`}
            >
              <img src={MoneyIcon} alt="icon" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-black">{card.title}</p>
              <p className="text-xl text-black font-semibold">{card.amount}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Left Side - Month, Year, Status From Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Dropdown */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            disabled={isFetching}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={isFetching}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Payment Status From Dropdown */}
          <select
            value={paymentStatusFrom}
            onChange={(e) => setPaymentStatusFrom(e.target.value)}
            disabled={isFetching}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Status From</option>
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Right Side - Status To and Request Payment Button */}
        <div className="flex items-center gap-3">
          {/* Payment Status To Dropdown */}
          <select
            value={paymentStatusTo}
            onChange={(e) => setPaymentStatusTo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
          >
            <option value="">Status To</option>
            {["pending", "recieved"].map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          {/* Request Payment Button */}
          <button
            onClick={handleRequestPayment}
            disabled={isLoadingRequestPayment}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap ${
              isLoadingRequestPayment ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoadingRequestPayment ? "Processing..." : "Request Payment"}
          </button>
        </div>
      </div>

      {/* Total Commission Display - Show shimmer when loading */}
      {showLoader ? (
        <ShimmerTotalCard />
      ) : (
        !isError &&
        responseData && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Commission</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{responseData.totalCommission?.toLocaleString("en-IN") || 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-xl font-semibold text-gray-700">
                  {responseData.data?.length || 0}
                </p>
              </div>
            </div>
          </div>
        )
      )}

      {/* Error State */}
      {isError && !showLoader && (
        <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600">Error loading data. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Commission List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Show shimmer rows when loading */}
              {showLoader ? (
                <>
                  <ShimmerRow />
                  <ShimmerRow />
                  <ShimmerRow />
                </>
              ) : isError ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-red-500"
                  >
                    Failed to load data
                  </td>
                </tr>
              ) : responseData &&
                responseData.data &&
                responseData.data.length > 0 ? (
                responseData.data.map((item) => {
                  console.log(item);
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {item.userId._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {item.type === "commissionForNextMonth"
                            ? "Next Month"
                            : "This Month"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.commission.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.commission.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.commission.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : item.commission.paymentStatus === "received"
                              ? "bg-blue-100 text-blue-700"
                              : item.commission.paymentStatus === "unpaid"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.commission.paymentStatus
                            .charAt(0)
                            .toUpperCase() +
                            item.commission.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No commission data found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeesManagement;
