import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen ">
      {/* 🔹 Top Gray Header */}
      <div className="bg-white py-4 px-6 ">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Terms & Conditions
        </h2>
      </div>

      {/* 🔹 Content Section */}
      <div className="p-6 flex justify-center">
        <div className="w-full bg-white   px-6 py-6 text-gray-700 leading-relaxed">
          <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
          <p className="mb-4">
            Welcome to StudyLab. By registering, booking a seat, or using our
            services, you agree to the following Terms & Conditions:
          </p>

          <ol className="list-decimal ml-5 space-y-4">
            <li>
              <span className="font-semibold">Registration & Accounts</span>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>
                  Students must provide accurate personal and academic details
                  during registration.
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
                  Seat reservations are available on a monthly, quarterly, or
                  yearly basis.
                </li>
                <li>
                  Reserved seats must be confirmed with payment before the due
                  date; otherwise, they will be released.
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
                  Attendance is marked through check-in and check-out within the
                  panel.
                </li>
                <li>
                  Fake or proxy check-ins will be considered a violation and may
                  result in penalties.
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
