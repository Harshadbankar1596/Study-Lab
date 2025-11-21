import React from "react";

const AddCategoryModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal content */}
      <div className="bg-white rounded-2xl w-[400px] h-[300px] p-6 shadow-xl relative">
        {/* Category Name */}
        <div className="space-y-2 mb-6">
          <label className="text-black font-medium">Category Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            className="w-full border bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add Category Button */}
        <div className="flex justify-center">
          <button
            onClick={onAdd}
            className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700"
          >
            +Add Category
          </button>
        </div>

        {/* Optional close (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 "
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AddCategoryModal;
