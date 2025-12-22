import React from 'react';
import useAuth from '../../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../../hooks/useAxios';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/payments');
      return res.data;
    }
  });

  if (isLoading) {
    return <p className="text-center">Loading payment history...</p>;
  }

  return (
    <div>
      <h2 className='text-2xl text-center font-bold my-3'>
        <span className='text-blue-500'>{payments.length}</span> payments completed
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Amount (BDT)</th>
              <th>Payment Date</th>
              <th>Transaction ID</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id}>
                <th>{index + 1}</th>
                <td>{payment.trackingId}</td>
                <td>{payment.amount}</td>
                <td>
                  {new Date(payment.paidAt).toLocaleDateString()}
                </td>
                <td className="text-xs">{payment.transactionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;