import React from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Loading from "../components/Loading/Loading";
import Forbidden from "../components/Forbidden/Forbidden";

const RiderRoute = ({ children }) => {
  const { loading, user } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Forbidden />;
  }

  if (role !== "staff") {
    return <Forbidden />;
  }

  return children;
};

export default RiderRoute;
