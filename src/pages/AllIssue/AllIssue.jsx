import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router";
import { FaThumbsUp } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";

const AllIssue = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxios();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: issues = [], refetch } = useQuery({
    queryKey: ["allIssues", searchText, statusFilter],
    enabled: !!user && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get("/issues", {
        params: {
          search: searchText || undefined,
          status: statusFilter || undefined,
          includePending: "true",
        },
      });
      return res.data;
    },
  });

  const handleUpvote = async (id) => {
    await axiosSecure.patch(`/issues/${id}/upvote`);
    refetch();
  };

  // const handleApprove = async (id) => {
  //   await axiosSecure.patch(`/issues/${id}/approve`);
  //   refetch();
  // };

  // const handleReject = async (id) => {
  //   const reason = prompt("Enter rejection reason:");
  //   if (!reason) return;

  //   await axiosSecure.patch(`/issues/${id}/reject`, { reason });
  //   refetch();
  // };

  return (
    <div className="bg-white p-6 rounded-2xl">
      <h2 className="text-3xl font-bold mb-4 text-center">
        All Reported Issues
      </h2>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 my-6">
        <input
          type="search"
          className="input input-bordered w-full lg:max-w-sm"
          placeholder="Search Issues by Title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
            { label: "Assigned", value: "assigned" },
            { label: "In-progress", value: "in-progress" },
            { label: "Resolved", value: "resolved" },
            { label: "Closed", value: "closed" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setStatusFilter(item.value)}
              className={`btn btn-sm text-black ${
                statusFilter === item.value ? "btn-primary" : "btn-outline"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>District</th>
              <th>Status</th>
              <th>Upvote</th>
              <th>Priority</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue, index) => (
              <tr key={issue._id}>
                <td>{index + 1}</td>
                <td>{issue.title}</td>
                <td>{issue.incidentDistrict}</td>

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
                  {issue.reporterEmail !== user?.email ? (
                    <button
                      disabled={issue.status === "closed"}
                      onClick={() => handleUpvote(issue._id)}
                      className="btn btn-xs"
                    >
                      <FaThumbsUp /> {issue.upvotes?.length || 0}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">Your issue</span>
                  )}
                </td>

                <td>
                  {issue.priority === "high" ? (
                    <span className="badge badge-error">High</span>
                  ) : (
                    <span className="badge">Normal</span>
                  )}
                </td>

                <td>
                  {issue.image ? (
                    <img
                      src={issue.image}
                      alt=""
                      className="w-12 h-12 rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>

                <td className="space-x-2">
                  <Link to={`/issues/${issue._id}`}>
                    <button className="btn btn-primary text-black">
                      Details
                    </button>
                  </Link>

                  {/* {user?.role === "admin" && issue.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(issue._id)}
                        className="btn btn-xs btn-success"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(issue._id)}
                        className="btn btn-xs btn-error"
                      >
                        Reject
                      </button>
                    </>
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllIssue;