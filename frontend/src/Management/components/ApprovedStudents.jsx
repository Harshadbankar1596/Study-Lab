// import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const ApprovedStudents = () => {
  const students = [
    {
      id: "stud123",
      name: "Rahul Sharma",
      contact: "8452695256",
      email: "rahul@gmail.com",
      address: "Golden city center, chhatrapati sambhajinagar, 431001",
      dob: "20/08/2005",
      date: "20/08/2025",
      status: "pending",
    },


     {
      id: "stud123",
      name: "Rahul Sharma",
      contact: "8452695256",
      email: "rahul@gmail.com",
      address: "Golden city center, chhatrapati sambhajinagar, 431001",
      dob: "20/08/2005",
      date: "20/08/2025",
      status: "pending",
    },

     {
      id: "stud123",
      name: "Rahul Sharma",
      contact: "8452695256",
      email: "rahul@gmail.com",
      address: "Golden city center, chhatrapati sambhajinagar, 431001",
      dob: "20/08/2005",
      date: "20/08/2025",
      status: "pending",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">ApproveStudents Students</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse border border-gray-200 text-black">
          <thead className="bg-[#0073FF0F]">
            <tr>
              <th className="px-4 py-2 border">Student ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Contact No</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Date of Birth</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="text-center">
                <td className="px-4 py-2 border">{student.id}</td>
                <td className="px-4 py-2 border">{student.name}</td>
                <td className="px-4 py-2 border">{student.contact}</td>
                <td className="px-4 py-2 border">{student.email}</td>
                <td className="px-4 py-2 border">{student.address}</td>
                <td className="px-4 py-2 border">{student.dob}</td>
                <td className="px-4 py-2 border">{student.date}</td>
                <td className="px-4 py-2 border flex justify-center gap-2">
                  <button className="text-green-600 hover:scale-110">
                    <CheckCircle size={20} />
                  </button>
                  <button className="text-red-600 hover:scale-110">
                    <XCircle size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedStudents;
