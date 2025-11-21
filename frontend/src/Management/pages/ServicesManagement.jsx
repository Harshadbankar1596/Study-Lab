import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import {
  useAddServiceMutation,
  useDeleteServiceMutation,
  useGetServiceQuery,
  useUpdateServiceMutation,
} from "../redux/Api/ServiceAPI";

const ServiceManagement = () => {
  // RTK Query mutations & query
  const { data: services, isLoading: isLoadingGetService } =
    useGetServiceQuery();
  const [addService, { isLoading: isLoadingAddService }] =
    useAddServiceMutation();
  const [updateService, { isLoading: isLoadingUpdateService }] =
    useUpdateServiceMutation();
  const [deleteServiceAPI, { isLoading: isLoadingDeleteService }] =
    useDeleteServiceMutation();

  // State
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [isShowDeleteWarning, setIsShowDeleteWarning] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // Validation schema
  const validationSchema = Yup.object({
    serviceName: Yup.string()
      .required("Service name is required")
      .min(3, "Service name must be at least 3 characters")
      .max(50, "Service name cannot exceed 50 characters"),
    quantity: Yup.number()
      .required("Quantity is required")
      .positive("Quantity must be positive")
      .integer("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive")
      .min(1, "Price must be at least ₹1"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      serviceName: "",
      quantity: "",
      price: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (editMode) {
        await handleUpdateService(values);
      } else {
        await handleAddService(values);
      }
      resetForm();
    },
  });

  // Add Service
  const handleAddService = async (values) => {
    try {
      await addService({
        serviceName: values.serviceName,
        quantity: values.quantity,
        price: values.price,
      }).unwrap();

      toast.success("✅ Service added successfully!");
      setShowModal(false);
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.error ||
        error?.data?.error ||
        "Failed to add service!";
      toast.error(message);
    }
  };

  // Update Service
  const handleUpdateService = async (values) => {
    try {
      await updateService({
        _id: editingServiceId,
        serviceName: values.serviceName,
        quantity: values.quantity,
        price: values.price,
      }).unwrap();

      toast.success("✅ Service updated successfully!");
      setShowModal(false);
      setEditMode(false);
      setEditingServiceId(null);
    } catch (error) {
      toast.error("Failed to update service!");
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditMode(false);
    setEditingServiceId(null);
    formik.resetForm();
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (service) => {
    setEditMode(true);
    setEditingServiceId(service._id);
    formik.setValues({
      serviceName: service.serviceName || service.name,
      quantity: service.quantity,
      price: service.price,
    });
    setShowModal(true);
  };

  // Delete Service
  const deleteService = async (id) => {
    return await deleteServiceAPI(id).unwrap();
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteService(selectedServiceId);
      toast.success("✅ Deleted successfully!");
      setIsShowDeleteWarning(false);
      setSelectedServiceId(null);
    } catch (error) {
      toast.error("Failed to delete!");
    }
  };

  const showDeleteWarning = (id) => {
    setSelectedServiceId(id);
    setIsShowDeleteWarning(true);
  };

  const cancelDelete = () => {
    setIsShowDeleteWarning(false);
    setSelectedServiceId(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
    setEditingServiceId(null);
    formik.resetForm();
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Add Service Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-md text-white font-medium bg-[#059500] hover:bg-[#048200] transition"
        >
          + Add Service
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-base-100 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Services</h2>
        <div className="overflow-x-auto">
          {isLoadingGetService ? (
            <div className="flex justify-center py-6">
              <ClipLoader color="#059500" size={30} />
            </div>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {services?.map((service) => (
                  <tr key={service._id}>
                    <td>{service.serviceName || service.name}</td>
                    <td>{service.quantity}</td>
                    <td>₹{service.price}</td>
                    <td className="flex justify-center gap-4">
                      <button
                        className="btn btn-ghost btn-xs text-red-500"
                        onClick={() => showDeleteWarning(service._id)}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs text-gray-600"
                        onClick={() => openEditModal(service)}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h2 className="font-bold text-lg mb-4">
              {editMode ? "Edit Service" : "Add New Service"}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Service Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Service Name</span>
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formik.values.serviceName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter service name"
                  className={`input input-bordered ${
                    formik.touched.serviceName && formik.errors.serviceName
                      ? "input-error"
                      : ""
                  }`}
                />
                {formik.touched.serviceName && formik.errors.serviceName && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.serviceName}
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Quantity</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter quantity"
                  className={`input input-bordered ${
                    formik.touched.quantity && formik.errors.quantity
                      ? "input-error"
                      : ""
                  }`}
                />
                {formik.touched.quantity && formik.errors.quantity && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.quantity}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price (₹)</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter price"
                  className={`input input-bordered ${
                    formik.touched.price && formik.errors.price
                      ? "input-error"
                      : ""
                  }`}
                />
                {formik.touched.price && formik.errors.price && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.price}
                  </span>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-[#059500] text-[#059500] hover:bg-[#e8f9e8] transition"
                onClick={handleModalClose}
                disabled={isLoadingAddService || isLoadingUpdateService}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={formik.handleSubmit}
                disabled={isLoadingAddService || isLoadingUpdateService}
                className="px-4 py-2 rounded-md text-white bg-[#059500] hover:bg-[#048200] transition min-w-[140px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingAddService || isLoadingUpdateService ? (
                  <ClipLoader color="#fff" size={20} />
                ) : editMode ? (
                  "Update Service"
                ) : (
                  "Add Service"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isShowDeleteWarning && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete this service? This action cannot
              be undone.
            </p>
            {selectedServiceId && (
              <div className="bg-gray-100 p-3 rounded-md mt-2">
                <h4 className="font-semibold mb-1">Service Details:</h4>
                <p className="text-sm">
                  {services?.find((s) => s._id === selectedServiceId)
                    ?.serviceName || "No service name found"}
                </p>
              </div>
            )}
            <div className="modal-action">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                onClick={cancelDelete}
                disabled={isLoadingDeleteService}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition max-w-[80px] min-w-[80px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmDelete}
                disabled={isLoadingDeleteService}
              >
                {isLoadingDeleteService ? (
                  <ClipLoader color="#fff" size={20} />
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

export default ServiceManagement;
