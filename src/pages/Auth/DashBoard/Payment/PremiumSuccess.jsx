import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../../components/Loading/Loading";

const PremiumSuccess = () => {
  const [params] = useSearchParams();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) return;

    axiosSecure
      .get(`/premium-success?session_id=${sessionId}`)
      .then(() => {
        Swal.fire({
          title: "You are now a Premium user!",
          icon: "success",
          draggable: true,
        });
        navigate("/profile");
      })
      .catch(() => {
        Swal.fire({
      title: "Cancelled",
      text: "Premium activation failed",
      icon: "error"
    });
        navigate("/profile");
      });
  }, [params, axiosSecure, navigate]);

  return <Loading></Loading>
};

export default PremiumSuccess;