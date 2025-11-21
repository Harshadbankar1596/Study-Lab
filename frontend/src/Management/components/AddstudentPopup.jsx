import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";

const StudentPopup = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    parentsNo: "",
    address: "",
    dob: "",
    email: "",
    photo: null,
    amount: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = () => {
    const { name, contact, parentsNo, address, dob, email, photo, amount } =
      formData;
    if (!name || !contact || !parentsNo || !address || !dob || !email || !photo || !amount) {
      alert("Please fill all fields!");
      return;
    }
    onAdd(formData);
    setFormData({
      name: "",
      contact: "",
      parentsNo: "",
      address: "",
      dob: "",
      email: "",
      photo: null,
      amount: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[650px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-xl"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="w-28" />
        </div>

        <h2 className="text-lg font-semibold mb-2 text-center text-black">
          Fill Admission Form Below
        </h2>
        <hr className="mb-4" />

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-black">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded bg-white text-black"
            />
          </div>

          {/* Contact */}
          <div className="flex flex-col">
            <label className="mb-1 text-black">Contact No</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded bg-white text-black"
            />
          </div>

          {/* Parents No */}
          <div className="flex flex-col">
            <label className="mb-1 text-black">Parents No</label>
            <input
              type="text"
              name="parentsNo"
              value={formData.parentsNo}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded bg-white text-black"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="mb-1 text-black">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded bg-white text-black"
            />
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col">
            <label className="mb-1 text-black">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded bg-white text-black"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-black">Email Id</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded bg-white text-black"
            />
          </div>

          {/* Upload Photo */}
          <div className="flex flex-col">
            <label className="mb-1 text-black">Upload Profile Photo</label>
            <label className="flex items-center justify-center gap-2 border border-gray-300 rounded bg-white text-black p-2 cursor-pointer hover:bg-gray-50">
              <FiUpload />
              <span className="text-sm">
                {formData.photo ? formData.photo.name : "Choose File"}
              </span>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Admission Amount */}
          <div className="flex flex-col">
            <label className="mb-1 text-black">Admission Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded bg-white text-black"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="px-8 py-2 bg-blue-600 text-white font-semibold rounded-md"
          >
            Proceed To Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPopup;