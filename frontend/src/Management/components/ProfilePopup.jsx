import React from "react";
import { FaUserLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../redux/Slice/AuthSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { decryptData } from "../Utils/Encryption";

const ProfilePopup = ({ isOpen, isClicked }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Safely decrypt management data
  let management = null;
  try {
    const storedManagement = localStorage.getItem("Management");
    if (storedManagement) {
      management = decryptData(storedManagement);
    }
  } catch (error) {
    console.error("Failed to decrypt management data:", error);
  }

  // ✅ Fallback values to prevent errors if management is null
  const email = management?.email || "rahulsharma@gmail.com";
  const name = management?.name || "Rahul Sharma";
  const createdAt = management?.createdAt || "2025-08-12";

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("Management");
    localStorage.removeItem("Management_Token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-4 top-14 w-80 bg-white shadow-xl rounded-xl overflow-hidden z-50 p-6 text-center border border-gray-100">
      {/* Profile Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <FaUserLock className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* User Info */}
      <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
      <p className="text-sm text-gray-500">{email}</p>

      {/* Account Created */}
      <p className="mt-4 text-xs text-gray-400">
        Account Created on {new Date(createdAt).toDateString()}
      </p>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePopup;
