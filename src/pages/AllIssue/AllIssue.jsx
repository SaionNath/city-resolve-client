import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Loading from "../../components/Loading/Loading";
import { Link } from "react-router";

const AllIssue = () => {
  const axiosSecure = useAxios();

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["allIssues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl">
      <h2 className="text-3xl font-bold mb-4 text-center">
        All Reported Issues
      </h2>

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
              <th>Others</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue, index) => (
              <tr key={issue._id}>
                <th>{index + 1}</th>

                <td className="font-medium">{issue.title}</td>

                <td>{issue.incidentDistrict}</td>

                <td>
                  <span className="badge badge-warning">{issue.status}</span>
                </td>

                <td>
                  {issue.priority === "high" ? (
                    <span className="badge badge-error">High</span>
                  ) : (
                    <span className="badge badge-outline">Normal</span>
                  )}
                </td>

                <td>
                  {issue.image ? (
                    <img
                      src={issue.image}
                      alt={issue.title}
                      className="w-14 h-14 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>

                <td>
                  <Link to={`/issues/${issue._id}`}>
                    <button className="btn btn-primary text-black">
                      Details
                    </button>
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

export default AllIssue;
