// import React from "react";
// import { FaChevronRight, FaInfo } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const Setting = () => {
//   const navigate = useNavigate();

//   const items = [
//     { title: "About Us", path: "/about" },
//     { title: "Terms & Condition", path: "/term" },
//     { title: "Fee Structure", path: "/fees" },
//   ];

//   return (
//     <div className="min-h-screen p-6 flex ">
//       <div className="w-full ">
//         {items.map((item, index) => (
//           <div
//             key={index}
//             className="flex items-center justify-between bg-white px-4 py-3 rounded-md shadow-sm mb-3 cursor-pointer "
//             onClick={() => navigate(item.path)}
//           >
//             <div className="flex items-center gap-3">
//               {/* Blue rounded (i) icon */}
//               <div className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
//                 <FaInfo />
//               </div>
//               <span className="text-gray-800 font-medium">{item.title}</span>
//             </div>
//             <FaChevronRight className="text-gray-400" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Setting;

import React, { useState } from "react";
import { FaChevronRight, FaChevronDown, FaInfo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="w-full">
        {/* About Us - Dropdown */}
        <div className="bg-white rounded-md shadow-sm mb-3 overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer"
            onClick={() => toggleSection("about")}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
                <FaInfo />
              </div>
              <span className="text-gray-800 font-medium">About Us</span>
            </div>
            {expandedSection === "about" ? (
              <FaChevronDown className="text-gray-400" />
            ) : (
              <FaChevronRight className="text-gray-400" />
            )}
          </div>

          {expandedSection === "about" && (
            <div className="px-6 py-4 text-gray-700 leading-relaxed border-t">
              <p className="mb-4">
                <span className="font-semibold">Welcome to StudyLab</span> – a
                modern learning and study hub designed to provide students with
                a focused and productive environment. Our mission is to empower
                students with the right facilities, digital tools, and resources
                that make their academic journey smoother and more effective.
              </p>

              <p className="font-semibold mb-2">At StudyLab, we offer:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <span className="font-semibold">
                    🎟️ Smart Seat Booking System
                  </span>{" "}
                  – Choose your study spot with ease, just like booking a movie
                  seat.
                </li>
                <li>
                  <span className="font-semibold">
                    ⏰ Time & Attendance Tracking
                  </span>{" "}
                  – Keep track of your study hours with automated check-in and
                  check-out.
                </li>
                <li>
                  <span className="font-semibold">💳 Hassle-Free Payments</span>{" "}
                  – Pay fees online and download receipts instantly.
                </li>
                <li>
                  <span className="font-semibold">🎫 Canteen Coupons</span> –
                  Save more with student-friendly food discounts.
                </li>
                <li>
                  <span className="font-semibold">
                    🔔 Instant Notifications
                  </span>{" "}
                  – Stay updated on fees, assignments, and announcements.
                </li>
              </ul>

              <p className="mt-4">
                With 200+ seats across 7 floors, we ensure every student gets a
                comfortable and distraction-free space. Our system is built to
                bring transparency, efficiency, and convenience to both students
                and management.
              </p>

              <p className="mt-6 italic font-medium text-gray-800 text-center">
                ✨ "When students focus on learning, everything else should be
                effortless." ✨
              </p>
            </div>
          )}
        </div>

        {/* Terms & Conditions - Dropdown */}
        <div className="bg-white rounded-md shadow-sm mb-3 overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer"
            onClick={() => toggleSection("terms")}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
                <FaInfo />
              </div>
              <span className="text-gray-800 font-medium">
                Terms & Conditions
              </span>
            </div>
            {expandedSection === "terms" ? (
              <FaChevronDown className="text-gray-400" />
            ) : (
              <FaChevronRight className="text-gray-400" />
            )}
          </div>

          {expandedSection === "terms" && (
            <div className="px-6 py-4 text-gray-700 leading-relaxed border-t">
              <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
              <p className="mb-4">
                Welcome to StudyLab. By registering, booking a seat, or using
                our services, you agree to the following Terms & Conditions:
              </p>

              <ol className="list-decimal ml-5 space-y-4">
                <li>
                  <span className="font-semibold">Registration & Accounts</span>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      Students must provide accurate personal and academic
                      details during registration.
                    </li>
                    <li>Accounts are personal and non-transferable.</li>
                    <li>
                      Any misuse of the account may result in suspension or
                      termination.
                    </li>
                  </ul>
                </li>

                <li>
                  <span className="font-semibold">Seat Booking & Usage</span>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      Seat reservations are available on a monthly, quarterly,
                      or yearly basis.
                    </li>
                    <li>
                      Reserved seats must be confirmed with payment before the
                      due date; otherwise, they will be released.
                    </li>
                    <li>
                      Seat availability is shown in real-time (Vacant, Booked,
                      Expiring Soon).
                    </li>
                    <li>
                      Students are responsible for maintaining discipline and
                      cleanliness at their allotted seat.
                    </li>
                  </ul>
                </li>

                <li>
                  <span className="font-semibold">Attendance System</span>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      Attendance is marked through check-in and check-out within
                      the panel.
                    </li>
                    <li>
                      Fake or proxy check-ins will be considered a violation and
                      may result in penalties.
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Fee Structure - Navigation */}
        <div
          className="flex items-center justify-between bg-white px-4 py-3 rounded-md shadow-sm cursor-pointer"
          onClick={() => navigate("/fees")}
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
              <FaInfo />
            </div>
            <span className="text-gray-800 font-medium">Fee Structure</span>
          </div>
          <FaChevronRight className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Setting;
