import React from "react";

const FeesTab = ({ student }) => {
  const totalAmount = student?.totalAmount || 5000;
  const paidAmount = student?.paidAmount || 2000;
  const remainingAmount = student?.remainingAmount || 2000;

  const paymentHistory = student?.paymentHistory || [
    { date: "12-08-2025", amount: 5000 },
    { date: "12-08-2025", amount: 5000 },
    { date: "12-08-2025", amount: 5000 },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Left Section: Amount Cards */}
      <div className="col-span-2 grid grid-cols-2 gap-4">
        {/* Total Amount */}
        <div className="bg-white border rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Amount</p>
            <p className="text-green-600 font-bold text-xl">₹{totalAmount}</p>
          </div>
          <div className="bg-green-600 text-white p-2 rounded-lg">
            💰
          </div>
        </div>

        {/* Paid Amount */}
        <div className="bg-green-50 border rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Paid Amount</p>
            <p className="text-green-600 font-bold text-xl">₹{paidAmount}</p>
          </div>
          <div className="bg-green-600 text-white p-2 rounded-lg">
            💵
          </div>
        </div>

        {/* Remaining Amount */}
        <div className="bg-red-50 border rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Remaining Amount</p>
            <p className="text-red-600 font-bold text-xl">₹{remainingAmount}</p>
          </div>
          <div className="bg-red-600 text-white p-2 rounded-lg">
            🧾
          </div>
        </div>
      </div>

      {/* Right Section: Payment History */}
      <div className="bg-yellow-50 border rounded-lg shadow p-4">
        <h3 className="text-gray-800 font-medium mb-3">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-gray-700 text-left">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((p, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-2 px-3">{p.date}</td>
                  <td className="py-2 px-3 text-green-600 font-medium">
                    ₹{p.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeesTab;
