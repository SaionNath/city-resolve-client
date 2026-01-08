import { useQuery } from "@tanstack/react-query";
import {BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer} from "recharts";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../../components/Loading/Loading";
import useRole from "../../../../hooks/useRole";
import useAuth from "../../../../hooks/useAuth";

const CitizenDashBoardHome = () => {
  const axiosSecure = useAxios();
  const { role, roleLoading } = useRole();
  const { user } = useAuth();

  const { data = [], isLoading } = useQuery({
    queryKey: ["citizen-dashboard"],
    enabled: !roleLoading && role === "citizen" && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/citizen-stats");
      return res.data.map((i) => ({
        status: i._id,
        count: i.count,
      }));
    },
  });

  const STATUS_COLORS = {
    pending: "#f59e0b",
    assigned: "#3b82f6",
    resolved: "#22c55e",
    closed: "#ef4444",
  };

  if (roleLoading || isLoading) return <Loading />;
  if (role !== "citizen") return null;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">My Issue Statistics</h2>
      {data.length === 0 && (
        <p className="text-gray-500">No issues reported yet</p>
      )}

      <div className="w-full h-75 sm:h-87.5 md:h-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="status" angle={-15} textAnchor="end" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.status] || "#6b7280"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CitizenDashBoardHome;