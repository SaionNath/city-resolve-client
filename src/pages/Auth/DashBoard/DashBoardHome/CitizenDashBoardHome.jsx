import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../../components/Loading/Loading";
import useRole from "../../../../hooks/useRole";
import useAuth from "../../../../hooks/useAuth";

const CitizenDashBoardHome = () => {
  const axiosSecure = useAxios();
  const { role, roleLoading } = useRole();
  const { user } = useAuth();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["citizen-dashboard"],
    enabled: !roleLoading && role === "citizen" && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/citizen-stats");
      return res.data;
    },
  });

  const STATUS_COLORS = {
    pending: "#ef4444",
    approve: "#3b82f6",
    "in-progress": "#f59e0b",
    resolved: "#22c55e",
    closed: "#228B22",
  };

  if (roleLoading || isLoading) return <Loading />;
  if (role !== "citizen") return null;

  const pieData = data.statusStats?.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const getCount = (status) =>
    data.statusStats?.find((s) => s._id === status)?.count || 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Citizen Statistics</h2>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Issues</div>
          <div className="stat-value text-primary">{data.totalIssues}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-[#ef4444]">{getCount("pending")}</div>
        </div>

        <div className="stat">
          <div className="stat-title">In Progress</div>
          <div className="stat-value text-blue-500">{getCount("assigned")}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-[#f59e0b]">
            {getCount("resolved")}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Payments</div>
          <div className="stat-value text-purple-500">{data.totalPayments}</div>
        </div>
      </div>

      {pieData?.length > 0 ? (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                label
                outerRadius={120}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[entry.name] || "#6b7280"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-500">No issues reported yet</p>
      )}
    </div>
  );
};

export default CitizenDashBoardHome;