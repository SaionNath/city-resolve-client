import React from "react";
import {
  FaRegEdit,
  FaUsersCog,
  FaBell,
  FaChartLine,
  FaUserLock,
  FaCrown,
} from "react-icons/fa";

const Feature = () => {
  return (
    <div className="my-12 px-3 lg:px-8">
      <h2 className="text-3xl font-bold text-secondary mb-6">
        Application Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Feature 1 */}
        <div className="bg-white p-6 rounded-2xl space-y-3 shadow-sm">
          <FaRegEdit className="text-4xl text-secondary" />
          <h3 className="text-xl font-semibold text-secondary">
            Easy Issue Reporting
          </h3>
          <p className="text-[#606060]">
            Citizens can easily report public infrastructure problems by
            providing issue details, photos, and location. The process is simple
            and quick.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white p-6 rounded-2xl space-y-3 shadow-sm">
          <FaUsersCog className="text-4xl text-secondary" />
          <h3 className="text-xl font-semibold text-secondary">
            Role-Based Dashboards
          </h3>
          <p className="text-[#606060]">
            Separate dashboards for Admin, Staff, and Citizens ensure that each
            user only sees what they need to manage or track issues efficiently.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-6 rounded-2xl space-y-3 shadow-sm">
          <FaBell className="text-4xl text-secondary" />
          <h3 className="text-xl font-semibold text-secondary">
            Real-Time Status Tracking
          </h3>
          <p className="text-[#606060]">
            Every issue has a timeline showing status updates such as pending,
            in-progress, resolved, or closed so users stay informed at all
            times.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white p-6 rounded-2xl space-y-3 shadow-sm">
          <FaChartLine className="text-4xl text-secondary" />
          <h3 className="text-xl font-semibold text-secondary">
            Analytics & Reports
          </h3>
          <p className="text-[#606060]">
            Admins and staff can view statistics and charts to understand issue
            trends, workload distribution, and overall system performance.
          </p>
        </div>

        {/* Feature 5 */}
        <div className="bg-white p-6 rounded-2xl space-y-3 shadow-sm">
          <FaUserLock className="text-4xl text-secondary" />
          <h3 className="text-xl font-semibold text-secondary">
            Secure Access & Controls
          </h3>
          <p className="text-[#606060]">
            Authentication, private routes, and role verification ensure that
            sensitive actions are protected and only authorized users can
            perform them.
          </p>
        </div>

        {/* Feature 6 */}
        <div className="bg-white p-6 rounded-2xl space-y-3 shadow-sm">
          <FaCrown className="text-4xl text-secondary" />
          <h3 className="text-xl font-semibold text-secondary">
            Premium Priority Support
          </h3>
          <p className="text-[#606060]">
            Premium users can boost issue priority and submit unlimited reports,
            helping urgent problems get faster attention from authorities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feature;