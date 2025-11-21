import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useGetCouoponsQuery,
  useDeleteCouponMutation,
  useEditCouponMutation,
  useAddCouponMutation,
  useAllocateToStudentMutation,
} from "../redux/Api/CouponAPI";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useGetAllBookingsQuery } from "../redux/Api/BookingsAPI";
import { X, Search, Check, Calendar } from "lucide-react";

// Custom Loader Component
const ThemeLoader = ({ size = 20, className = "" }) => (
  <ClipLoader color="#059500" size={size} className={className} />
);

const CouponPage = () => {
  const { data } = useGetCouoponsQuery();
  console.log(data);
  const [deleteCouponMutation, { isLoading: isLoadingDeleteCoupon }] =
    useDeleteCouponMutation();
  const [updateCoupon, { isLoading: isLoadingUpdateCoupon }] =
    useEditCouponMutation();
  const [addCoupon, { isLoading: isLoadingAddCoupon }] = useAddCouponMutation();
  const { data: students } = useGetAllBookingsQuery();
  console.log(students);
  const [allocateCoupon, { isLoading: isLoadingAllocate }] =
    useAllocateToStudentMutation();

  const bookedStudents =
    students?.bookings?.filter(
      (stud) => stud.status == "booked" || stud.status == "pending"
    ) || [];

  console.log(bookedStudents);

  const [showModal, setShowModal] = useState(false);
  const [isShowDeleteWarning, setIsShowDeleteWarning] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [showAllocateModel, setShowAllocateModel] = useState(false);
  const [selectedCoupon, setSelectedCouopn] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [validTill, setValidTill] = useState("");

  // Validation schema
  const validationSchema = Yup.object({
    description: Yup.string()
      .required("Description is required")
      .min(3, "Description must be at least 3 characters"),
    code: Yup.string()
      .required("Coupon code is required")
      .min(3, "Code must be at least 3 characters")
      .matches(
        /^[A-Z0-9]+$/,
        "Code must be uppercase letters and numbers only"
      ),
    discount: Yup.number()
      .required("Discount is required")
      .positive("Discount must be positive")
      .max(100, "Discount cannot exceed 100%"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      description: "",
      code: "",
      discount: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (editMode) {
        await handleUpdateCoupon(values);
      } else {
        await handleAddCoupon(values);
      }
      resetForm();
    },
  });

  // FIX: Safe filtering with null/undefined check
  const filteredStudents = bookedStudents.filter((student) => {
    console.log(student);
    if (!student?.userId?.name) return false;
    return student?.userId?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  console.log(filteredStudents);

  const toggleSelectStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s._id));
    }
  };

  const handleAllocateStudent = (coupon) => {
    setSelectedCouopn(coupon);
    setShowAllocateModel(true);
    setSearchTerm("");
    setSelectedStudents([]);
    setValidTill("");
  };

  const handleAllocate = async () => {
    if (!validTill) {
      toast.error("Please select a valid till date");
      return;
    }

    const allocatedStudentIds = bookedStudents
      .filter((s) => selectedStudents.includes(s._id))
      .map((s) => s.userId);

    console.log("Allocated Students id:", allocatedStudentIds);
    console.log("To Coupon ID:", selectedCoupon?._id);
    console.log("Valid Till:", validTill);

    try {
      const res = await allocateCoupon({
        students: allocatedStudentIds,
        validTill: validTill,
        couponId: selectedCoupon?._id,
      }).unwrap();

      toast.success(
        `Coupon allocated to ${allocatedStudentIds.length} student(s)!`
      );
      console.log("Allocation response:", res);

      setSelectedStudents([]);
      setValidTill("");
      setShowAllocateModel(false);
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || "Failed to allocate coupon"
      );
      console.log("Allocation error:", error);
    }
  };

  const handleAddCoupon = async (values) => {
    try {
      console.log("Adding coupon:", values);

      const res = await addCoupon({
        description: values.description,
        code: values.code,
        discount: values.discount,
      }).unwrap();

      toast.success("✅ Coupon added successfully!");
      console.log(res);
      setShowModal(false);
    } catch (error) {
      console.error("❌ Add coupon error:", error);

      const message =
        error?.data?.message ||
        error?.error ||
        error?.data?.error ||
        "Failed to add coupon! Please try again.";

      toast.error(message);
    }
  };

  const handleUpdateCoupon = async (values) => {
    console.log("Updating coupon:", editingCouponId, values);
    try {
      const res = await updateCoupon({
        id: editingCouponId,
        data: {
          description: values.description,
          code: values.code,
          discount: values.discount,
        },
      }).unwrap();
      console.log(res);
      toast.success("Coupon updated successfully!");
      setShowModal(false);
      setEditMode(false);
      setEditingCouponId(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update coupon!");
    }
  };

  const openEditModal = (coupon) => {
    setEditMode(true);
    setEditingCouponId(coupon._id);
    formik.setValues({
      description: coupon.description,
      code: coupon.code,
      discount: coupon.discount,
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setEditingCouponId(null);
    formik.resetForm();
    setShowModal(true);
  };

  const deleteCoupon = async (id) => {
    return await deleteCouponMutation(id).unwrap();
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteCoupon(selectedCouponId);
      console.log(res);
      toast.success("Deleted Successfully!");
      setIsShowDeleteWarning(false);
      setSelectedCouponId(null);
    } catch (error) {
      console.log("Error deleting coupon:", error);
      toast.error("Failed to delete!");
    }
  };

  const showDeleteWarning = (id) => {
    setSelectedCouponId(id);
    setIsShowDeleteWarning(true);
  };

  const cancelDelete = () => {
    setIsShowDeleteWarning(false);
    setSelectedCouponId(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
    setEditingCouponId(null);
    formik.resetForm();
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Add Coupon Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-lg text-white font-medium bg-[#059500] hover:bg-[#048200] transition"
        >
          + Add Coupon
        </button>
      </div>

      {/* Table */}
      <div className="bg-base-100 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Coupons</h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Description</th>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.coupens.map((coupon, i) => (
                  <tr key={i}>
                    <td>{coupon.description}</td>
                    <td className="font-medium">{coupon.code}</td>
                    <td>{coupon.discount}%</td>
                    <td className="flex justify-center gap-4">
                      <button
                        className="btn btn-ghost btn-xs text-red-500"
                        onClick={() => showDeleteWarning(coupon._id)}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs text-gray-600"
                        onClick={() => openEditModal(coupon)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-white btn btn-xs bg-[#059500] hover:bg-[#048200] rounded-lg transition"
                        onClick={() => handleAllocateStudent(coupon)}
                      >
                        Allocate
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocate Students Modal */}
      {showAllocateModel && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAllocateModel(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Allocate Coupon:{" "}
                <span className="text-[#059500]">{selectedCoupon?.code}</span>
              </h2>
              <button
                onClick={() => setShowAllocateModel(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Valid Till Date Selector */}
            <div className="px-6 py-4 border-b bg-[#e8f9e8]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#059500]" />
                  Valid Till Date
                </div>
              </label>
              <input
                type="date"
                value={validTill}
                onChange={(e) => setValidTill(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-[#059500] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059500]"
              />
              {!validTill && (
                <p className="text-xs text-red-500 mt-1">
                  Please select a valid till date
                </p>
              )}
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search students by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059500]"
                />
              </div>
            </div>

            {/* Select All Option */}
            <div className="px-6 py-3 border-b bg-gray-50 flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  selectedStudents.length === filteredStudents.length &&
                  filteredStudents.length > 0
                }
                onChange={selectAll}
                className="w-5 h-5 cursor-pointer accent-[#059500] rounded"
              />
              <label className="text-sm font-medium text-gray-700 cursor-pointer">
                Select All ({filteredStudents.length})
              </label>
            </div>

            {/* Students Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredStudents.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {filteredStudents.map((student) => (
                    <div
                      key={student._id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedStudents.includes(student._id)
                          ? "border-[#059500] bg-[#e8f9e8]"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      onClick={() => toggleSelectStudent(student._id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">
                          {student.userId?.name || "Unknown Student"}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            selectedStudents.includes(student._id)
                              ? "bg-[#059500] border-[#059500]"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedStudents.includes(student._id) && (
                            <Check size={16} className="text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  No students found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between rounded-b-xl">
              <p className="text-sm text-gray-600">
                {selectedStudents.length} student
                {selectedStudents.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAllocateModel(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAllocate}
                  disabled={
                    selectedStudents.length === 0 ||
                    !validTill ||
                    isLoadingAllocate
                  }
                  className="px-6 py-2 bg-[#059500] text-white rounded-lg font-medium hover:bg-[#048200] transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
                >
                  {isLoadingAllocate ? (
                    <>
                      <ThemeLoader size={16} />
                      Allocating...
                    </>
                  ) : (
                    "Allocate"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl rounded-xl">
            <h2 className="font-bold text-lg mb-4">
              {editMode ? "Edit Coupon" : "Add New Coupon"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Coupon Description</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter description"
                  className={`input input-bordered rounded-lg ${
                    formik.touched.description && formik.errors.description
                      ? "input-error border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.description && formik.errors.description && (
                  <span className="text-red-500 text-sm mt-1">
                    {formik.errors.description}
                  </span>
                )}
              </div>

              {/* Code */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Coupon Code</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formik.values.code}
                  onChange={(e) => {
                    formik.setFieldValue("code", e.target.value.toUpperCase());
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="Enter code (e.g., SAVE20)"
                  className={`input input-bordered rounded-lg ${
                    formik.touched.code && formik.errors.code
                      ? "input-error border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.code && formik.errors.code && (
                  <span className="text-red-500 text-sm mt-1">
                    {formik.errors.code}
                  </span>
                )}
              </div>

              {/* Discount */}
              <div className="form-control col-span-2">
                <label className="label">
                  <span className="label-text">Coupon Discount (%)</span>
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formik.values.discount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter discount percentage (0-100)"
                  className={`input input-bordered rounded-lg ${
                    formik.touched.discount && formik.errors.discount
                      ? "input-error border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.discount && formik.errors.discount && (
                  <span className="text-red-500 text-sm mt-1">
                    {formik.errors.discount}
                  </span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="modal-action">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-[#059500] text-[#059500] hover:bg-[#e8f9e8] transition"
                onClick={handleModalClose}
                disabled={isLoadingUpdateCoupon || isLoadingAddCoupon}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoadingUpdateCoupon || isLoadingAddCoupon}
                className="px-4 py-2 rounded-lg text-white bg-[#059500] hover:bg-[#048200] transition min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoadingUpdateCoupon || isLoadingAddCoupon ? (
                  <>
                    <ThemeLoader size={20} />
                    {editMode ? "Updating..." : "Adding..."}
                  </>
                ) : editMode ? (
                  "Update Coupon"
                ) : (
                  "Add Coupon"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isShowDeleteWarning && (
        <div className="modal modal-open">
          <div className="modal-box rounded-xl">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete this coupon? This action cannot be
              undone.
            </p>
            {selectedCouponId && (
              <div className="bg-gray-100 p-3 rounded-lg mt-2">
                <h4 className="font-semibold mb-1">Coupon Details:</h4>
                <p className="text-sm">
                  {(data &&
                    data?.coupens?.find(
                      (coupon) => coupon._id === selectedCouponId
                    )?.description) ||
                    "No description found"}
                </p>
              </div>
            )}
            <div className="modal-action">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                onClick={cancelDelete}
                disabled={isLoadingDeleteCoupon}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition min-w-[80px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmDelete}
                disabled={isLoadingDeleteCoupon}
              >
                {isLoadingDeleteCoupon ? (
                  <>
                    <ClipLoader color="#fff" size={16} />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponPage;
