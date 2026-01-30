import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";

const AdminPayments = () => {
  const axiosSecure = useAxios();

  const { data: payments = [] } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments");
      return res.data;
    },
  });

  const downloadReceipt = async (id) => {
    const res = await axiosSecure.get(
      `/admin/payments/${id}/receipt`,
      { responseType: "blob" },
    );

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${id}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Reason</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td>{p.email}</td>
              <td>{p.reason}</td>
              <td>
                {p.amount} {p.currency}
              </td>
              <td>{new Date(p.paidAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => downloadReceipt(p._id)}
                  className="btn btn-sm btn-primary text-black"
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPayments;