import { useQuery } from "@tanstack/react-query";
import {PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer} from "recharts";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../../components/Loading/Loading";
import useRole from "../../../../hooks/useRole";

const StaffDashBoardHome = () => {
  const axiosSecure = useAxios();
  const { role, roleLoading } = useRole();

  const { data = [], isLoading } = useQuery({
    queryKey: ["staff-dashboard"],
    enabled: !roleLoading && role === "staff",
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/staff-stats");
      return res.data;
    },
  });

  const COLORS = ["#ef4444", "#3b82f6", "#22c55e"];

  if (isLoading) return <Loading></Loading>;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Staff Statistics</h2>
      {data.length === 0 && (
        <p className="text-gray-500">No issues assigned yet</p>
      )}

      <div className="w-full h-80 sm:h-72 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              label
              outerRadius="80%">
              {data.map((entry, index) => (
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

export default StaffDashBoardHome;