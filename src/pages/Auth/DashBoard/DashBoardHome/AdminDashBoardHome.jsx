import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../../components/Loading/Loading";
import useRole from "../../../../hooks/useRole";
import { Link, useNavigate } from "react-router";

const AdminDashBoardHome = () => {
  const axiosSecure = useAxios();
  const { role, roleLoading } = useRole();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    enabled: !roleLoading && role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/admin-stats");
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
  
  if (isLoading) return <Loading></Loading>;

  const pieData = data.issueStats.map((i) => ({
    name: i._id,
    value: i.count,
  }));

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold">Admin Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat shadow rounded-lg">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{data.usersCount}</div>
        </div>

        <div className="stat shadow rounded-lg">
          <div className="stat-title">Staff</div>
          <div className="stat-value">{data.staffCount}</div>
        </div>

        <div className="stat shadow rounded-lg">
          <div className="stat-title">Citizens</div>
          <div className="stat-value">{data.citizenCount}</div>
        </div>
      </div>

      <button
        onClick={() => navigate("/dashboard/admin-payments")}
        className="btn btn-outline"
      >
        View & Download Receipts
      </button>

      <div className="w-full h-80 sm:h-72 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              label
              outerRadius="80%"
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
    </div>
  );
};

export default AdminDashBoardHome;