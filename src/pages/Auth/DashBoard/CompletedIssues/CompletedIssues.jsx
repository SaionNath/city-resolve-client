import React from "react";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading";

const CompletedIssues = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["completed-issues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues/completed");
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div>
      <h2 className="text-2xl text-center font-bold my-4">
        Completed Issues:{" "}
        <span className="text-green-600">{issues.length}</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th>Tracking ID</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue, index) => (
              <tr key={issue._id}>
                <td>{index + 1}</td>
                <td>{issue.title}</td>
                <td>{issue.incidentRegion}</td>
                <td>{issue.incidentDistrict}</td>
                <td className="font-bold text-green-600 capitalize">
                  {issue.status}
                </td>
                <td>{issue.trackingId}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {issues.length === 0 && (
          <p className="text-center mt-6 text-gray-500">
            No completed issues found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CompletedIssues;
