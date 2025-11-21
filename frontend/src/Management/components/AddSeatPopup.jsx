// import React, { useState } from "react";
// import { X } from "lucide-react";
// import toast from "react-hot-toast";
// import { useAddSeatsMutation } from "../redux/Api/SeatApi"; // ✅ Import the API hook

// const AddSeatPopup = ({ isOpen, onClose }) => {
//   const [floor, setFloor] = useState("");
//   const [row, setRow] = useState("");
//   const [seatNumber, setSeatNumber] = useState("");
//   const [addSeats, { isLoading }] = useAddSeatsMutation(); // ✅ RTK Query mutation hook

//   if (!isOpen) return null;

//   const handleAdd = async () => {
//     if (!floor || !row || !seatNumber) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       // ✅ Format request body correctly as array of objects
//       const newSeat = [
//         {
//           floor: floor.replace("Floor ", ""), // Remove label text like "Floor "
//           row: row.replace("Row ", ""), // Remove "Row " text
//           seatNumber: seatNumber.trim(),
//         },
//       ];

//       const res = await addSeats(newSeat).unwrap();
//       toast.success(res?.message || "Seat added successfully!");

//       // Reset fields and close popup
//       setFloor("");
//       setRow("");
//       setSeatNumber("");
//       onClose();
//     } catch (error) {
//       console.error("Add Seat Error:", error);
//       toast.error(error?.data?.message || "Failed to add seat");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//       <div className="bg-white rounded-2xl shadow-xl w-[350px] p-5 relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-black"
//         >
//           <X size={20} />
//         </button>

//         {/* Title */}
//         <h2 className="text-sm font-medium mb-4 text-black">Add New Seat</h2>

//         {/* Floor Select */}
//         <div className="mb-3">
//           <label className="block text-xs text-gray-600 mb-1">
//             Select Floor
//           </label>
//           <select
//             value={floor}
//             onChange={(e) => setFloor(e.target.value)}
//             className="w-full p-2 border rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
//           >
//             <option value="">Select Floor</option>
//             <option value="Floor 1">Floor 1</option>
//             <option value="Floor 2">Floor 2</option>
//           </select>
//         </div>

//         {/* Row Select */}
//         <div className="mb-3">
//           <label className="block text-xs text-gray-600 mb-1">Select Row</label>
//           <select
//             value={row}
//             onChange={(e) => setRow(e.target.value)}
//             className="w-full p-2 border rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
//           >
//             <option value="">Select Row</option>
//             {Array.from({ length: 10 }).map((_, i) => (
//               <option key={i} value={`Row ${i + 1}`}>
//                 Row {i + 1}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Seat Number Input */}
//         <div className="mb-4">
//           <label className="block text-xs text-gray-600 mb-1">
//             Enter Seat Number
//           </label>
//           <input
//             type="text"
//             value={seatNumber}
//             onChange={(e) => setSeatNumber(e.target.value)}
//             placeholder="Enter Seat Number"
//             className="w-full p-2 border rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
//           />
//         </div>

//         {/* Add Button */}
//         <div className="flex justify-center">
//           <button
//             onClick={handleAdd}
//             disabled={isLoading}
//             className={`${
//               isLoading
//                 ? "bg-green-400 cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700"
//             } text-white px-6 py-2 rounded-lg font-semibold transition-all`}
//           >
//             {isLoading ? "Adding..." : "+ Add Seat"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddSeatPopup;

import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddSeatsMutation } from "../redux/Api/SeatApi";

const AddSeatPopup = ({ isOpen, onClose }) => {
  const [addSeats, { isLoading }] = useAddSeatsMutation();

  // Formik validation schema
  const validationSchema = Yup.object({
    floor: Yup.string().required("Floor is required"),
    row: Yup.string().required("Row is required"),
    seatNumber: Yup.number()
      .typeError("Seat number must be a number")
      .required("Seat number is required")
      .positive("Seat number must be positive")
      .integer("Seat number must be a whole number")
      .min(1, "Seat number must be at least 1")
      .max(10, "Seat number cannot exceed 10"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      floor: "",
      row: "",
      seatNumber: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const newSeat = [
          {
            floor: values.floor.replace("Floor ", ""),
            row: values.row.replace("Row ", ""),
            seatNumber: values.seatNumber.toString(),
          },
        ];

        const res = await addSeats(newSeat).unwrap();
        toast.success(res?.message || "Seat added successfully!");
        resetForm();
        onClose();
      } catch (error) {
        console.error("Add Seat Error:", error);
        toast.error(error?.data?.message || "Failed to add seat");
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[350px] p-5 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            formik.resetForm();
            onClose();
          }}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-sm font-medium mb-4 text-black">Add New Seat</h2>

        <form onSubmit={formik.handleSubmit}>
          {/* Floor Select */}
          <div className="mb-3">
            <label className="block text-xs text-gray-600 mb-1">
              Select Floor
            </label>
            <select
              name="floor"
              value={formik.values.floor}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 ${
                formik.touched.floor && formik.errors.floor
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-green-500"
              }`}
            >
              <option value="">Select Floor</option>
              <option value="Floor 1">Floor 1</option>
              <option value="Floor 2">Floor 2</option>
            </select>
            {formik.touched.floor && formik.errors.floor && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.floor}</p>
            )}
          </div>

          {/* Row Select */}
          <div className="mb-3">
            <label className="block text-xs text-gray-600 mb-1">
              Select Row
            </label>
            <select
              name="row"
              value={formik.values.row}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 ${
                formik.touched.row && formik.errors.row
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-green-500"
              }`}
            >
              <option value="">Select Row</option>
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i} value={`Row ${i + 1}`}>
                  Row {i + 1}
                </option>
              ))}
            </select>
            {formik.touched.row && formik.errors.row && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.row}</p>
            )}
          </div>

          {/* Seat Number Input */}
          <div className="mb-4">
            <label className="block text-xs text-gray-600 mb-1">
              Enter Seat Number (1-10)
            </label>
            <input
              type="number"
              name="seatNumber"
              value={formik.values.seatNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Seat Number"
              min="1"
              max="10"
              className={`w-full p-2 border rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 ${
                formik.touched.seatNumber && formik.errors.seatNumber
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-green-500"
              }`}
            />
            {formik.touched.seatNumber && formik.errors.seatNumber && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.seatNumber}
              </p>
            )}
          </div>

          {/* Add Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !formik.isValid}
              className={`${
                isLoading || !formik.isValid
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white px-6 py-2 rounded-lg font-semibold transition-all`}
            >
              {isLoading ? "Adding..." : "+ Add Seat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSeatPopup;
