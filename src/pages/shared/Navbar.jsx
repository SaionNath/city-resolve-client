import React from "react";
import { NavLink } from "react-router";
import Logo from "../../components/logo/Logo";

const Navbar = () => {


  const links = <>
    <li><NavLink to='/'>Home</NavLink></li>
    <li><NavLink to='/all_issue'>All Issue</NavLink></li>
    <li><NavLink to='/issue_report'>Report Issue</NavLink></li>

  </> 
  return (
    <div className="navbar bg-base-100 mb-4 rounded-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <span className="btn btn-ghost text-xl"><Logo></Logo></span>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {links}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        {/* {
          user?
          <button onClick={handleLogOut} className="btn bg-white rounded-lg">Log Out</button>:
          <NavLink to='/login' className="btn bg-white rounded-lg">Log In</NavLink>
        } */}
        <NavLink to='/login' className="btn bg-white rounded-lg">Log In</NavLink>
        <NavLink to='/BeRider' className="btn btn-primary text-black font-bold rounded-lg">Be a rider</NavLink>
      </div>
    </div>
  );
};

export default Navbar;