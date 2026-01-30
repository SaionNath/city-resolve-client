import React, { useState } from "react";
import useAxios from "../../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { FaUserShield } from "react-icons/fa";
import { FiShieldOff } from "react-icons/fi";
import Swal from "sweetalert2";

const UserManagement = () => {
  const axiosSecure = useAxios();
  const [searchText, setSearchText] = useState("");

  // Fetch users
  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users", searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${searchText}`);
      return res.data;
    },
  });

  // promote or demote admin
  const handleRoleChange = (user, action) => {
    const text =
      action === "promote"
        ? `Promote ${user.displayName} to admin?`
        : `Demote ${user.displayName} from admin?`;

    Swal.fire({
      title: "Are you sure?",
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/${user._id}/role`, { action })
          .then(() => {
            refetch();
            Swal.fire("Success", "Role updated successfully", "success");
          })
          .catch((err) =>
            Swal.fire(
              "Error",
              err.response?.data?.message || "Something went wrong",
              "error"
            )
          );
      }
    });
  };

  // block or unblock user
  const handleBlockToggle = (user) => {
    const action = user.isBlocked ? "unblock" : "block";
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} ${user.displayName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} them!`,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/${user._id}/block`, { isBlocked: !user.isBlocked })
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetch();
              Swal.fire(
                "Updated!",
                `${user.displayName} has been ${action}ed`,
                "success"
              );
            }
          })
          .catch(() => Swal.fire("Error", "Something went wrong.", "error"));
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl text-center font-bold my-3">
        <span className="text-blue-500">{users.length}</span> users on the
        platform
      </h2>

      <label className="input my-5 mx-3">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          className="grow"
          placeholder="Search Users"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </label>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Admin Actions</th>
              <th>Other Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={user.photoURL} alt="Avatar" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.displayName}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role === "admin" ? (
                    <button
                      onClick={() => handleRoleChange(user, "demote")}
                      className="btn btn-square rounded-xl hover:bg-red-400"
                    >
                      <FiShieldOff />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRoleChange(user, "promote")}
                      className="btn btn-square rounded-xl hover:bg-green-400"
                    >
                      <FaUserShield />
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleBlockToggle(user)}
                    className={`btn btn-square rounded-xl ${
                      user.isBlocked
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-yellow-400 hover:bg-yellow-500"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;