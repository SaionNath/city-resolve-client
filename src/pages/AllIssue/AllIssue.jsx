import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Loading from "../../components/Loading/Loading";
import { Link } from "react-router";
import { FaThumbsUp } from "react-icons/fa6";

const AllIssue = () => {
  const axiosSecure = useAxios();

  const {
    data: issues = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allIssues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues");
      return res.data;
    },
  });

  const handleUpvote = async (id) => {
    try {
      await axiosSecure.patch(`/issues/${id}/upvote`);
      refetch();
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

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
              <th>Upvote</th>
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

                <td className="flex flex-col items-center gap-1">
                  <span className="badge badge-warning capitalize">
                    {issue.status}
                  </span>

                  <button
                    disabled={issue.status === "closed"}
                    onClick={() => handleUpvote(issue._id)}
                    className={`flex flex-col items-center text-sm ${
                      issue.status === "closed"
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    <FaThumbsUp size={16} />
                    <span>{issue.upvotes?.length || 0}</span>
                  </button>
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