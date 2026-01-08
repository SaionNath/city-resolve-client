import React from "react";
import { useLocation } from "react-router";
import useAxios from "../../../../hooks/useAxios";

const AccountRestricted = () => {
//   const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxios();
  const { reason } = location.state || {};

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl">
      <h2 className="text-2xl font-bold text-red-600">Account Restricted</h2>

      <p className="mt-4 text-gray-700">
        {reason || "Your account has been temporarily restricted."}
      </p>

      <div className="mt-6 bg-gray-100 p-4 rounded">
        <h3 className="font-semibold">Upgrade to Premium</h3>
        <ul className="list-disc ml-5 mt-2 text-sm">
          <li>Unlimited issue reports</li>
          <li>No account restrictions</li>
          <li>Priority support</li>
        </ul>
      </div>

      <button
        onClick={async () => {
          const res = await axiosSecure.post("/premium-checkout");
          window.location.href = res.data.url;
        }}
        className="btn bg-primary mt-6 w-full"
      >
        Upgrade to report issue
      </button>
    </div>
  );
};

export default AccountRestricted;
