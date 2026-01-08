import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";

const AssignedIssues = () => {
  const axiosSecure = useAxios();

  const { data: issues = [], refetch } = useQuery({
    queryKey: ["assignedIssues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues?assignedToMe=true");
      return res.data;
    },
  });

  const handleResolve = (issueId) => {
    Swal.fire({
      title: "Mark issue as resolved?",
      text: "Make sure the work is completed properly.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, resolve it",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/issues/${issueId}/status`, { status: "resolved" })
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetch();
              Swal.fire("Resolved!", "Issue marked as resolved.", "success");
            }
          });
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl text-center font-bold my-4">
        Assigned Issues: <span className="text-red-500">{issues.length}</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>District</th>
              <th>Tracking ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue, index) => (
              <tr key={issue._id}>
                <td>{index + 1}</td>
                <td>{issue.title}</td>
                <td>{issue.incidentDistrict}</td>
                <td className="font-mono">{issue.trackingId}</td>
                <td>
                  <span className="badge badge-info">{issue.status}</span>
                </td>
                <td>
                  {issue.status === "assigned" && (
                    <button
                      onClick={() => handleResolve(issue._id)}
                      className="btn btn-success btn-sm"
                    >
                      Complete Issue
                    </button>
                  )}

                  {issue.status === "resolved" && (
                    <span className="text-green-600 font-semibold">
                      Waiting for admin
                    </span>
                  )}

                  {issue.status === "closed" && (
                    <span className="text-gray-500 font-medium">Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {issues.length === 0 && (
          <p className="text-center text-gray-500 my-6">
            No assigned issues right now.
          </p>
        )}
      </div>
    </div>
  );
};

export default AssignedIssues;
