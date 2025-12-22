import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Loading from "../../components/Loading/Loading";

const IssueDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();

  const { data: issue, isLoading } = useQuery({
    queryKey: ["issueDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="bg-white p-6 rounded-2xl max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{issue.title}</h2>

      <div className="space-y-2">
        <p>
          <strong>Tracking ID:</strong> {issue.trackingId}
        </p>
        <p>
          <strong>Status:</strong> {issue.status}
        </p>
        <p>
          <strong>Priority:</strong> {issue.priority}
        </p>
        <p>
          <strong>District:</strong> {issue.incidentDistrict}
        </p>
        <p>
          <strong>Reported By:</strong> {issue.reporterEmail}
        </p>
        <p>
          <strong>Description:</strong> {issue.description}
        </p>
      </div>

      {issue.image && (
        <img
          src={issue.image}
          alt={issue.title}
          className="mt-4 rounded-lg w-full max-h-96 object-cover"
        />
      )}
    </div>
  );
};

export default IssueDetails;