import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../../components/Loading/Loading";
import { Link } from "react-router";

const MyIssue = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();

  const { data: myIssues = [], isLoading } = useQuery({
    queryKey: ["myIssues", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/issues/my"); // email handled in backend
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const handlePayment = async (issue) => {
    try {
      const paymentInfo = {
        cost: 100, // BDT
        issueId: issue._id,
      };

      const res = await axiosSecure.post(
        "/payment-checkout-session",
        paymentInfo
      );
      window.location.assign(res.data.url);
    } catch (error) {
      console.error(error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
      <h2 className="text-3xl font-bold mb-4">My Reported Issues</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>District</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Image</th>
              <th>Tracking Id</th>
            </tr>
          </thead>
          <tbody>
            {myIssues.map((issue, index) => (
              <tr key={issue._id}>
                <th>{index + 1}</th>
                <td>{issue.title}</td>
                <td>{issue.incidentDistrict}</td>
                <td>
                  <span className="badge badge-warning">{issue.status}</span>
                </td>
                <td>
                  {issue.priority === "normal" && issue.status !== "closed" ? (
                    <span
                      className="badge badge-outline cursor-pointer hover:badge-warning"
                      onClick={() => handlePayment(issue)}
                    >
                      {issue.priority}
                    </span>
                  ) : issue.priority === "normal" &&
                    issue.status === "closed" ? (
                    <span
                      className="badge badge-ghost cursor-not-allowed"
                    >
                      {issue.priority}
                    </span>
                  ) : (
                    <span className="badge badge-warning">
                      {issue.priority}
                    </span>
                  )}
                </td>
                <td>
                  {issue.image ? (
                    <img
                      src={issue.image}
                      alt={issue.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="text-blue-500 font-bold">
                  <Link to={`/issue_track/${issue.trackingId}`}>
                    {issue.trackingId}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyIssue;
