import React from "react";
import {
  FaClipboardList,
  FaUserShield,
  FaTools,
  FaCheckCircle,
} from "react-icons/fa";

const Works = () => {
  return (
    <div className="my-10 space-y-6 px-3 lg:px-8">
      <h3 className="text-3xl font-bold text-secondary">How It Works</h3>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Step 1 */}
        <div className="bg-white px-5 py-8 space-y-3 rounded-2xl shadow-sm">
          <FaClipboardList className="text-secondary text-4xl" />
          <h3 className="text-xl font-bold text-secondary">Report an Issue</h3>
          <p className="text-[#606060]">
            Citizens can report public issues such as potholes, broken
            streetlights, water leakage, or garbage problems with images and
            location.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white px-5 py-8 space-y-3 rounded-2xl shadow-sm">
          <FaUserShield className="text-secondary text-4xl" />
          <h3 className="text-xl font-bold text-secondary">
            Admin Review & Assign
          </h3>
          <p className="text-[#606060]">
            Admin reviews the reported issue, verifies its authenticity, and
            assigns it to the appropriate staff member.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white px-5 py-8 space-y-3 rounded-2xl shadow-sm">
          <FaTools className="text-secondary text-4xl" />
          <h3 className="text-xl font-bold text-secondary">Staff Action</h3>
          <p className="text-[#606060]">
            Assigned staff starts working on the issue, updates progress, and
            changes status from pending to in-progress or resolved.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-white px-5 py-8 space-y-3 rounded-2xl shadow-sm">
          <FaCheckCircle className="text-secondary text-4xl" />
          <h3 className="text-xl font-bold text-secondary">Issue Resolved</h3>
          <p className="text-[#606060]">
            Once the work is completed, the issue is marked as resolved or
            closed. Citizens can track the full timeline anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Works;