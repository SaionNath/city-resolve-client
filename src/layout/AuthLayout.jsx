import React from "react";
import Logo from "../components/logo/Logo";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="bg-white py-5">
      <div className="max-w-300 mx-auto px-2 md:px-0">
        <Logo></Logo>
        <div className="my-3">
            <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
