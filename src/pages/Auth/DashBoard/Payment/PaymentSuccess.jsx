import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import useAxios from "../../../../hooks/useAxios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxios();

  const hasCalledRef = useRef(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId || hasCalledRef.current) return;

    hasCalledRef.current = true;

    axiosSecure
      .post(`/payment-success?session_id=${sessionId}`)
      .then((res) => {
        setPaymentInfo({
          transactionId: res.data.transactionId,
          trackingId: res.data.trackingId,
        });
      })
      .catch(() => {
        setError("Failed to verify payment. Please contact support.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessionId, axiosSecure]);

  if (loading) {
    return (
      <h2 className="text-2xl font-bold text-center">Verifying payment...</h2>
    );
  }

  if (error) {
    return <h2 className="text-red-500 text-xl text-center">{error}</h2>;
  }

  return (
    <div className="text-center space-y-3 my-5">
      <h2 className="text-4xl font-bold text-green-600">Payment Successful</h2>

      <p className="font-bold">
        Transaction ID:
        <span className="text-red-500 block">{paymentInfo?.transactionId}</span>
      </p>

      <p className="font-bold">
        Tracking ID:
        <span className="text-blue-500 block">{paymentInfo?.trackingId}</span>
      </p>
    </div>
  );
};

export default PaymentSuccess;
