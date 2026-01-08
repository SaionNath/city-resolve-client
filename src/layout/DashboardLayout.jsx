import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import Logo from "../components/logo/Logo";
import { FaCreditCard, FaMotorcycle, FaUsers } from "react-icons/fa6";
import useRole from "../hooks/useRole";
import { FaCheckCircle, FaClipboardList, FaListAlt, FaTasks, FaUserCog, FaUserPlus } from "react-icons/fa";
import logoImg from '../assets/img/logo.png';

const DashboardLayout = () => {
  const { role } = useRole();  
  // console.log(role);
 
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4">
            <Logo></Logo>
          </div>
        </nav>
        {/* Page content here */}
        <Outlet></Outlet>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <Link to = '/'><img src = {logoImg} alt="" /></Link>
            </li>
            <li>
              <NavLink
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
              >
                {/* Home icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span className="is-drawer-close:hidden">Homepage</span>
              </NavLink>
            </li>

            {/* our dashboard links */}
            <li>
              <NavLink
              to = '/dashboard/my_issues'
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="My Issues">
                <FaClipboardList className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">My Submitted Issue</span>
              </NavLink>
            </li>

            <li>
              <NavLink
              to = '/dashboard/payment_history'
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Payment History">
                <FaCreditCard className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Payment History</span>
              </NavLink>
            </li>

            {
              role === "staff" && 
                <>
                  <li>
                    <NavLink
                    to = '/dashboard/assigned_issue'
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Assigned Issues">
                      <FaTasks className="my-1.5 inline-block size-4" />
                      <span className="is-drawer-close:hidden">Assigned Issue</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                    to = '/dashboard/completed_issues'
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Completed Issues">
                      <FaCheckCircle className="my-1.5 inline-block size-4" />
                      <span className="is-drawer-close:hidden">Completed Issues</span>
                    </NavLink>
                  </li>
                </>
            }

            {
              role === 'admin' && 
                <>
                  <li>
                    <NavLink
                    to = '/dashboard/all_issues'
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="All Issues">
                      <FaListAlt className="my-1.5 inline-block size-4" />
                      <span className="is-drawer-close:hidden">All Issues</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                    to = '/dashboard/staff_request'
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Staf Request">
                      <FaUserPlus className="my-1.5 inline-block size-4" />
                      <span className="is-drawer-close:hidden">Staff Request</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                    to = '/dashboard/assign_staff'
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Assign Staff">
                      <FaUserCog className="my-1.5 inline-block size-4" />
                      <span className="is-drawer-close:hidden">Assign Staff</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                    to = '/dashboard/users_management'
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Users Management">
                      <FaUsers className="my-1.5 inline-block size-4" />
                      <span className="is-drawer-close:hidden">Users Management</span>
                    </NavLink>
                  </li>
                </>
            }

            {/* List item
            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Settings"
              >
                Settings icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                >
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
                <span className="is-drawer-close:hidden">Settings</span>
              </button>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
