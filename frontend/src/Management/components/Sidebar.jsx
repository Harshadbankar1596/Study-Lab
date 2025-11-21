import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdEventSeat,
  MdAssignment,
  MdPayment,
  MdPeople,
  MdHowToReg,
  MdGroup,
  MdNotifications,
  MdAccountBalance,
  MdCardGiftcard,
  MdArrowOutward,
  // MdAccountCircle,
} from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { RiQuestionnaireLine } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: (
        <MdDashboard className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Seat Management",
      path: "/seat",
      icon: (
        <MdEventSeat className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: (
        <MdAssignment className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Fees & Payments",
      path: "/fees",
      icon: (
        <MdPayment className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Student Management",
      path: "/students",
      icon: (
        <MdPeople className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Admission Management",
      path: "/addmission",
      icon: (
        <MdHowToReg className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Staff Management",
      path: "/staff",
      icon: (
        <MdGroup className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Notifications",
      path: "/notification",
      icon: (
        <MdNotifications className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Finance Management",
      path: "/finance",
      icon: (
        <MdAccountBalance className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Coupons Management",
      path: "/coupen",
      icon: (
        <MdCardGiftcard className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Setting",
      path: "/setting",
      icon: (
        <CiSettings className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Enquiries",
      path: "/enquiry",
      icon: (
        <RiQuestionnaireLine className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
    {
      name: "Add On Services",
      path: "/service",
      icon: (
        <IoAddCircleOutline className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },

    {
      name: "HouseKeeping",
      path: "/housekeeping",
      icon: (
        <MdArrowOutward className="w-10 h-10 bg-blue-600 rounded-full p-2 text-white" />
      ),
    },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 h-full bg-white  shadow-lg z-30
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out
        w-64
        flex flex-col
      `}
    >
      {/* Logo Section */}
      <div className="p-4 border-b flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Company Logo"
          className="w-24 h-auto object-contain"
        />
      </div>

      {/* Scrollable Menu */}
      <ul className="p-4 flex flex-col gap-2 overflow-y-auto flex-1">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className="cursor-pointer hover:bg-gray-100 rounded p-2 flex items-center gap-3"
            onClick={() => {
              navigate(item.path);
              toggleSidebar();
            }}
          >
            {item.icon}
            <span className="font-medium text-gray-700">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
