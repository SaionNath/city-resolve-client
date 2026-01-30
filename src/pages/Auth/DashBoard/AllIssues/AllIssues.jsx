import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import Loading from "../../../../components/Loading/Loading";

const AllIssues = () => {
  const axiosSecure = useAxios();

  const {
    data: issues = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["all-issues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues", {
        params: { includePending: "true" },
      });
      return res.data;
    },
  });

  const handleApprove = (issue) => {
    Swal.fire({
      title: "Approve this issue?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/issues/${issue._id}/approve`).then((res) => {
          if (res.data.success) {
            refetch();
            Swal.fire("Approved!", "Issue approved successfully.", "success");
          }
        });
      }
    });
  };

  const handleReject = (issue) => {
    Swal.fire({
      title: "Reject this issue?",
      input: "text",
      inputLabel: "Rejection reason",
      inputPlaceholder: "Enter rejection reason...",
      showCancelButton: true,
      confirmButtonText: "Reject",
      inputValidator: (value) => {
        if (!value) {
          return "You must provide a reason!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/issues/${issue._id}/reject`, {
            reason: result.value,
          })
          .then((res) => {
            if (res.data.success) {
              refetch();
              Swal.fire("Rejected!", "Issue rejected successfully.", "success");
            }
          });
      }
    });
  };

  const handleCloseIssue = (issue) => {
    Swal.fire({
      title: "Close this issue?",
      text: "Make sure it is properly resolved.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/issues/${issue._id}/close`).then((res) => {
          if (res.data.success) {
            refetch();
            Swal.fire("Closed!", "Issue has been closed.", "success");
          }
        });
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-center my-4">
        All Issues ({issues.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>District</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Staff</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue, idx) => (
              <tr key={issue._id}>
                <td>{idx + 1}</td>
                <td>{issue.title}</td>
                <td>{issue.incidentDistrict}</td>
                <td>{issue.priority}</td>
                <td>
                  <span
                    className={`badge w-24 justify-center text-center capitalize
                    ${issue.status === "pending" && "badge-warning"}
                    ${issue.status === "approved" && "badge-success"}
                    ${issue.status === "rejected" && "badge-error"}
                    ${issue.status === "closed" && "badge-neutral"}
                    ${issue.status === "resolved" && "badge-info"}
                    ${issue.status === "in-progress" && "badge-accent"}
                  `}
                  >
                    {issue.status}
                  </span>
                </td>
                <td>
                  {issue.assignedStaff ? (
                    <div>
                      <p className="font-semibold">
                        {issue.assignedStaff.staffName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {issue.assignedStaff.staffEmail}
                      </p>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </td>

                <td className="space-x-2">
                  {issue.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(issue)}
                        className="btn btn-success btn-sm"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(issue)}
                        className="btn btn-error btn-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {issue.status === "resolved" && (
                    <button
                      onClick={() => handleCloseIssue(issue)}
                      className="btn btn-primary btn-sm text-black"
                    >
                      Close
                    </button>
                  )}

                  {issue.status === "closed" && (
                    <span className="badge badge-success">Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllIssues;
