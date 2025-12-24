import React, { useRef, useState } from "react";
import useAxios from "../../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const AssignStaff = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const axiosSecure = useAxios();
  const staffModalRef = useRef();

  const { data: issues = [], refetch: issueRefetch } = useQuery({
    queryKey: ["issues", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues?status=pending");
      return res.data;
    },
  });

  const { data: staff = [], refetch: staffRefetch } = useQuery({
    queryKey: ["staff", selectedIssue?.incidentDistrict],
    enabled: !!selectedIssue,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/staffs/available?district=${selectedIssue.incidentDistrict}`
      );
      return res.data;
    },
  });

  const openAssignStaffModal = (issue) => {
    setSelectedIssue(issue);
    staffModalRef.current.showModal();
  };

  const handleAssignStaff = (staffMember) => {
    axiosSecure
      .patch(`/issues/${selectedIssue._id}/assign`, {
        staffEmail: staffMember.email,
        staffName: staffMember.displayName,
      })
      .then((res) => {
        if (res.data.success) {
          issueRefetch();
          staffRefetch();
          staffModalRef.current.close();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Staff ${staffMember.displayName} assigned!`,
            showConfirmButton: false,
            timer: 2800,
          });
        }
      });
  };

  return (
    <div>
      <h2 className="text-2xl text-center font-bold my-3">
        Pending Issues: <span className="text-blue-500">{issues.length}</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Region</th>
              <th>District</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, idx) => (
              <tr key={issue._id}>
                <td>{idx + 1}</td>
                <td>{issue.title}</td>
                <td>{issue.incidentRegion}</td>
                <td>{issue.incidentDistrict}</td>
                <td>{issue.priority}</td>
                <td>{issue.status}</td>
                <td>
                  {issue.assignedStaff ? (
                    <button className="btn btn-disabled">Staff Assigned</button>
                  ) : (
                    <button
                      onClick={() => openAssignStaffModal(issue)}
                      className="btn btn-primary text-black"
                    >
                      Assign Staff
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog
        ref={staffModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Staff for {selectedIssue?.incidentDistrict}: {staff.length}
          </h3>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s, idx) => (
                  <tr key={s._id}>
                    <td>{idx + 1}</td>
                    <td>{s.staffName}</td>
                    <td>{s.email}</td>
                    <td>
                      <button
                        onClick={() => handleAssignStaff(s)}
                        className="btn btn-primary text-black"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => staffModalRef.current.close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignStaff;
