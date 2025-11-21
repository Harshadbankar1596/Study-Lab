// import { useState } from "react";
// import { useLocation } from "react-router-dom";
// import { HiMenuAlt2 } from "react-icons/hi";
// import { FaUserCircle } from "react-icons/fa";
// import { IoNotificationsSharp } from "react-icons/io5";
// import NotificationPopup from "../components/Notificationpopup";
// import ProfilePopup from "./ProfilePopup";

// const Header = ({ onToggleSidebar }) => {
//   const location = useLocation();
//   const [showProfile, setShowProfile] = useState(false);
//   const [showNotif, setShowNotif] = useState(false);
//   const [isClicked, setIsClicked] = useState(false);

//   const titles = {
//     "/dash": "Dashboard",
//     "/seat": "Seat Management",
//     "/seat1": "Seat Management",
//     "/attendance": "My Attendance",
//     "/fees": "Fees & Payments",
//     "/students": "Student Management",
//     "/addmission": "Addmission Management",
//     "/staff": "Staff Management",
//     "/notification": "Notifications & Announcements",
//     "/finance": "Finance Management",
//     "/coupen": "Coupen Managment",
//     "/setting": "Setting",
//     "/enquiry": "Enquiries",
//     "/service": "Add On Services",
//     "/housekeeping": "Housekeeping",
//   };

//   const pageTitle = titles[location.pathname] || "Dashboard";

//   return (
//     <>
//       <header className="bg-white p-4 flex items-center justify-between shadow-md relative text-black">
//         {/* Left: Toggle + Page Title */}
//         <div className="flex items-center gap-4">
//           <button
//             onClick={onToggleSidebar}
//             className="text-white bg-blue-500 rounded-full p-2 text-2xl"
//           >
//             <HiMenuAlt2 />
//           </button>
//           <h1 className="text-xl font-bold">{pageTitle}</h1>
//         </div>

//         {/* Right: Notification, Profile, Logo */}
//         <div className="flex items-center gap-6 relative">
//           {/* Notifications */}
//           <div className="relative">
//             <button
//               onClick={() => {
//                 setShowNotif(!showNotif);
//                 setShowProfile(false);
//               }}
//               className="relative cursor-pointer bg-blue-500 text-white p-2 rounded-full"
//             >
//               <IoNotificationsSharp className="w-6 h-6" />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
//                 3
//               </span>
//             </button>
//             <NotificationPopup isOpen={showNotif} />
//           </div>

//           {/* Profile */}
//           <div className="relative">
//             <button
//               onClick={() => {
//                 setShowProfile(!showProfile);
//                 setShowNotif(false);
//               }}
//               className="cursor-pointer bg-blue-500 text-white p-2 rounded-full"
//             >
//               <FaUserCircle className="w-6 h-6" />
//             </button>
//             <ProfilePopup isClicked={isClicked} isOpen={showProfile} />
//           </div>

//           {/* Logo */}
//           <div className="w-20 h-16 p-1 flex items-center justify-center bg-white overflow-hidden">
//             <img
//               src="/logo.png"
//               alt="Company Logo"
//               className="w-full h-full object-contain"
//             />
//           </div>
//         </div>
//       </header>
//     </>
//   );
// };

// export default Header;

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { HiMenuAlt2 } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { IoNotificationsSharp } from "react-icons/io5";
import NotificationPopup from "../components/Notificationpopup";
import ProfilePopup from "./ProfilePopup";

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Refs for click outside detection
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const titles = {
    "/dash": "Dashboard",
    "/seat": "Seat Management",
    "/seat1": "Seat Management",
    "/attendance": "My Attendance",
    "/fees": "Fees & Payments",
    "/students": "Student Management",
    "/addmission": "Addmission Management",
    "/staff": "Staff Management",
    "/notification": "Notifications & Announcements",
    "/finance": "Finance Management",
    "/coupen": "Coupen Managment",
    "/setting": "Setting",
    "/enquiry": "Enquiries",
    "/service": "Add On Services",
    "/housekeeping": "Housekeeping",
  };

  const pageTitle = titles[location.pathname] || "Dashboard";

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close notification popup if click is outside
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotif(false);
      }

      // Close profile popup if click is outside
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    // Add event listener when either popup is open
    if (showNotif || showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotif, showProfile]);

  return (
    <>
      <header className="bg-white p-4 flex items-center justify-between shadow-md relative text-black">
        {/* Left: Toggle + Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="text-white bg-blue-500 rounded-full p-2 text-2xl"
          >
            <HiMenuAlt2 />
          </button>
          <h1 className="text-xl font-bold">{pageTitle}</h1>
        </div>

        {/* Right: Notification, Profile, Logo */}
        <div className="flex items-center gap-6 relative">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setShowNotif(!showNotif);
                setShowProfile(false);
              }}
              className="relative cursor-pointer bg-blue-500 text-white p-2 rounded-full"
            >
              <IoNotificationsSharp className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>
            <NotificationPopup isOpen={showNotif} />
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotif(false);
              }}
              className="cursor-pointer bg-blue-500 text-white p-2 rounded-full"
            >
              <FaUserCircle className="w-6 h-6" />
            </button>
            <ProfilePopup isClicked={isClicked} isOpen={showProfile} />
          </div>

          {/* Logo */}
          <div className="w-20 h-16 p-1 flex items-center justify-center bg-white overflow-hidden">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
