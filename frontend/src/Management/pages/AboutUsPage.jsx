import React from "react";
import { FaChevronDown } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="min-h-screen ">
      {/* 🔹 Top Gray Header */}
      <div className="bg-white py-4 px-6 ">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          About Us
        </h2>
      </div>

      {/* 🔹 Content Section */}
      <div className="p-6 flex justify-center">
        <div className="w-full   bg-white ">
          <div className="px-6 py-6 text-gray-700 leading-relaxed">
            <p className="mb-4">
              <span className="font-semibold">Welcome to StudyLab</span> – a
              modern learning and study hub designed to provide students with a
              focused and productive environment. Our mission is to empower
              students with the right facilities, digital tools, and resources
              that make their academic journey smoother and more effective.
            </p>

            <p className="font-semibold mb-2">At StudyLab, we offer:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <span className="font-semibold">🎟️ Smart Seat Booking System</span>{" "}
                – Choose your study spot with ease, just like booking a movie seat.
              </li>
              <li>
                <span className="font-semibold">⏰ Time & Attendance Tracking</span>{" "}
                – Keep track of your study hours with automated check-in and
                check-out.
              </li>
              <li>
                <span className="font-semibold">💳 Hassle-Free Payments</span> – Pay
                fees online and download receipts instantly.
              </li>
              <li>
                <span className="font-semibold">🎫 Canteen Coupons</span> – Save
                more with student-friendly food discounts.
              </li>
              <li>
                <span className="font-semibold">🔔 Instant Notifications</span> –
                Stay updated on fees, assignments, and announcements.
              </li>
            </ul>

            <p className="mt-4">
              With 200+ seats across 7 floors, we ensure every student gets a
              comfortable and distraction-free space. Our system is built to bring
              transparency, efficiency, and convenience to both students and
              management.
            </p>

            <p className="mt-6 italic font-medium text-gray-800 text-center">
              ✨ "When students focus on learning, everything else should be
              effortless." ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
