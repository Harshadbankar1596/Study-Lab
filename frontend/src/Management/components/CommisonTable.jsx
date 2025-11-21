import React from "react";

const CommissionTable = () => {
  return (
    <table className="min-w-full border rounded-lg">
      <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
        <tr>
          <th className="p-3">Commission ID</th>
          <th className="p-3">Source</th>
          <th className="p-3">Amount</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        <tr className="border-t">
          <td className="p-3">C001</td>
          <td className="p-3">Student Fees</td>
          <td className="p-3 text-blue-600 font-semibold">₹5000</td>
        </tr>
      </tbody>
    </table>
  );
};

export default CommissionTable;
