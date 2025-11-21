import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useGetAllStudentsQuery,
  useApproveStudentMutation,
  useAddStudentMutation,
  useGetChargesQuery,
} from "../redux/Api/StudentAPI";
import { useNavigate } from "react-router-dom";

const AddmissionManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Requests");
  const [approvingId, setApprovingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: apiResponse, error, isLoading } = useGetAllStudentsQuery();
  const [approveStudent] = useApproveStudentMutation();
  const [addStudent, { isLoading: isLoadingAddStudent }] =
    useAddStudentMutation();
  const { data: chargesData } = useGetChargesQuery();
  const charges = chargesData?.charges || [];
  const students = apiResponse?.students || [];

  // ✅ Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    contact: Yup.string()
      .required("Contact is required")
      .matches(/^[0-9]{10}$/, "Contact must be a 10-digit number"),
    dob: Yup.date()
      .required("Date of birth is required")
      .typeError("Invalid date")
      .max(new Date(), "Date of birth must be in the past"),
    currentAddress: Yup.string()
      .required("Current address is required")
      .min(5, "Current address must be at least 5 characters"),
    permenantAdd: Yup.string()
      .required("Permanent address is required")
      .min(5, "Permanent address must be at least 5 characters"),
    parentsContact: Yup.string()
      .required("Parent's contact is required")
      .notOneOf(
        [Yup.ref("contact")],
        "Parent's contact should not be same as contact"
      )
      .matches(/^[0-9]{10}$/, "Contact must be a 10-digit number"),
    regiterationAmount: Yup.string().required(
      "Registration amount is required"
    ),
    classStd: Yup.string().required("Class/Standard is required"),
    college: Yup.string()
      .required("College name is required")
      .min(3, "College name must be at least 3 characters"),
  });

  // ✅ Formik Initial Values
  const initialValues = {
    name: "",
    email: "",
    contact: "",
    dob: "",
    currentAddress: "",
    permenantAdd: "",
    parentsContact: "",
    regiterationAmount: "",
    classStd: "",
    college: "",
  };

  const handleAddStudent = async (values, { resetForm }) => {
    try {
      await addStudent(values).unwrap();
      alert("Student added successfully!");
      resetForm();
      setShowModal(false);
      navigate("/seat");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student. Please try again.");
    }
  };

  const getStatus = (student) => {
    if (student.isApproved) return "Approved";
    if (!student.isApproved && student.paymentStatus === "Pending")
      return "Pending";
    if (!student.isApproved && student.paymentStatus === "Done")
      return "Rejected";
    return "Pending";
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-50";
      case "Pending":
        return "text-blue-600 bg-blue-50";
      case "Rejected":
        return "text-red-600 bg-red-50";
      default:
        return "";
    }
  };

  const handleApprove = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to approve ${student.name}'s admission request?`
    );

    if (confirmed) {
      try {
        setApprovingId(student._id);
        await approveStudent(student._id).unwrap();
        alert(`${student.name} has been approved successfully!`);
      } catch (error) {
        console.error("Error approving student:", error);
        alert("Failed to approve student. Please try again.");
      } finally {
        setApprovingId(null);
      }
    }
  };

  const filteredData =
    activeTab === "All Requests"
      ? students
      : students.filter((student) => getStatus(student) === activeTab);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error fetching data</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        {/* Tabs */}
        <div className="flex space-x-2 bg-blue-100 rounded-lg p-2">
          {["All Requests", "Pending", "Approved"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-5 rounded-md font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Add Student Button */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-md text-white font-medium bg-[#059500] hover:bg-[#048200] transition"
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* ✅ Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Student</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleAddStudent}
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter student's name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter email address"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact
                      </label>
                      <Field
                        type="tel"
                        name="contact"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="10-digit phone number"
                      />
                      <ErrorMessage
                        name="contact"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <Field
                        type="date"
                        name="dob"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <ErrorMessage
                        name="dob"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Parent's Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent's Contact
                      </label>
                      <Field
                        type="tel"
                        name="parentsContact"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="10-digit phone number"
                      />
                      <ErrorMessage
                        name="parentsContact"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Registration Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Amount
                      </label>
                      <Field
                        as="select"
                        name="regiterationAmount"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">Select registration amount</option>
                        {charges.map((charge) => (
                          <option key={charge._id} value={charge.price}>
                            {charge.type} - ₹{charge.price}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="regiterationAmount"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* ✅ Class / Standard */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class / Standard
                      </label>
                      <Field
                        type="text"
                        name="classStd"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="e.g. 9, 10, 12"
                      />
                      <ErrorMessage
                        name="classStd"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* ✅ College */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        College Name
                      </label>
                      <Field
                        type="text"
                        name="college"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter college name"
                      />
                      <ErrorMessage
                        name="college"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Current Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Address
                    </label>
                    <Field
                      as="textarea"
                      name="currentAddress"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      placeholder="Enter current address"
                    />
                    <ErrorMessage
                      name="currentAddress"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Permanent Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permanent Address
                    </label>
                    <Field
                      as="textarea"
                      name="permenantAdd"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      placeholder="Enter permanent address"
                    />
                    <ErrorMessage
                      name="permenantAdd"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid || !dirty}
                      className="px-6 py-2 bg-[#059500] text-white rounded-md hover:bg-[#048200] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {isSubmitting ? "Adding..." : "Add Student"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* ✅ Student Table */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Name",
                "Email",
                "Contact",
                "Registration Amount",
                "Payment Status",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((student) => {
              const status = getStatus(student);
              const isProcessing = approvingId === student._id;

              return (
                <tr key={student._id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.contact}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₹{student.regiterationAmount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.paymentStatus || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {!student.isApproved ? (
                      <button
                        onClick={() => handleApprove(student)}
                        disabled={isProcessing}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-xs font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? "Processing..." : "Approve"}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No actions available
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddmissionManagement;
