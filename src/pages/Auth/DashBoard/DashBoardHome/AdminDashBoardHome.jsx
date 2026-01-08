import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../../components/Loading/Loading";
import useRole from "../../../../hooks/useRole";

const AdminDashBoardHome = () => {
  const axiosSecure = useAxios();
  const { role, roleLoading } = useRole();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    enabled: !roleLoading && role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/admin-stats");
      return res.data;
    },
  });

  const COLORS = ["#3b82f6", "#22c55e", "#ef4444"];

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

      <div className="w-full h-75 sm:h-87.5 md:h-100">
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
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
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
