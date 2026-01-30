import React from "react";
import useAxios from "../../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { IoMdPersonAdd } from "react-icons/io";
import { IoPersonRemove } from "react-icons/io5";
import { FaEye, FaTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";

const ApproveStaff = () => {
  const axiosSecure = useAxios();

  const { refetch, data: staffRequests = [] } = useQuery({
    queryKey: ["staffRequests", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/staffs");
      return res.data;
    },
  });

  const updateStaffStatus = (requestId, action) => {
    axiosSecure
      .patch(`/staffs/${action}/${requestId}`)
      .then((res) => {
        if (res.data.success) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Staff request ${action}ed successfully`,
            showConfirmButton: false,
            timer: 2500,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  return (
    <div>
      <h2 className="text-2xl text-center font-bold my-3">
        <span className="text-blue-500">{staffRequests.length}</span> pending
        staff requests
      </h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Staff Email</th>
              <th>Name</th>
              <th>Requested At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffRequests.map((request, index) => (
              <tr key={request._id}>
                <td>{index + 1}</td>
                <td>{request.staffEmail}</td>
                <td>{request.displayName}</td>
                <td>{new Date(request.requestedAt).toLocaleString()}</td>
                <td>
                  {request.status === "pending" ? (
                    <span className="text-yellow-500 font-bold">
                      {request.status}
                    </span>
                  ) : request.status === "approved" ? (
                    <span className="text-green-500 font-bold">
                      {request.status}
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold">
                      {request.status}
                    </span>
                  )}
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => updateStaffStatus(request._id, "approve")}
                    className="btn btn-sm btn-success"
                    disabled={request.status !== "pending"}
                  >
                    <IoMdPersonAdd />
                  </button>
                  <button
                    onClick={() => updateStaffStatus(request._id, "reject")}
                    className="btn btn-sm btn-error"
                    disabled={request.status !== "pending"}
                  >
                    <IoPersonRemove />
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

export default ApproveStaff;