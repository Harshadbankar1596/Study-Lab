import React, { useState } from "react";

const StaffPopup = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name || !contact || !role) {
      alert("Please fill all fields!");
      return;
    }
    onAdd({ name, contact, role });
    setName("");
    setContact("");
    setRole("");
    onClose(); // close popup after adding
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
        {/* Title */}
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Add Staff</h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 border rounded bg-gray-100 focus:outline-none"
        />

        {/* Contact No */}
        <input
          type="text"
          placeholder="Contact No"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full p-2 mb-3 border rounded bg-gray-100 focus:outline-none"
        />

        {/* Role */}
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-5 border rounded bg-gray-100 focus:outline-none"
        />

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >
            + Add Staff
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default StaffPopup;
