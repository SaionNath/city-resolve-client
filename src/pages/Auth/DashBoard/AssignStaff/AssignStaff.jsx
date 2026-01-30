import React, { useRef, useState } from "react";
import useAxios from "../../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const AssignStaff = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const axiosSecure = useAxios();
  const staffModalRef = useRef();

  const { data: issues = [], refetch: issueRefetch } = useQuery({
    queryKey: ["issues", "admin-review"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues");
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
        staffName: staffMember.staffName,
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

  const handleApprove = (issueId) => {
    Swal.fire({
      title: "Approve this issue?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/issues/${issueId}/approve`).then(() => {
          issueRefetch();
          Swal.fire("Approved!", "Issue approved successfully.", "success");
        });
      }
    });
  };

  const handleReject = (issue) => {
    Swal.fire({
      title: "Reject Issue",
      input: "textarea",
      inputLabel: "Rejection Reason",
      inputPlaceholder: "Enter reason...",
      showCancelButton: true,
      confirmButtonText: "Reject",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        axiosSecure
          .patch(`/issues/${issue._id}/reject`, {
            reason: result.value,
          })
          .then(() => {
            issueRefetch();
            Swal.fire("Rejected", "Issue has been rejected.", "success");
          });
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl text-center font-bold my-3">
        Issue Review & Assignment Panel
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
                <td className="flex gap-2">
                  {issue.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(issue._id)}
                        className="btn btn-success btn-sm"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(issue)}
                        className="btn btn-error btn-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {issue.status === "approved" && (
                    <button
                      onClick={() => openAssignStaffModal(issue)}
                      className="btn btn-primary text-black btn-sm"
                    >
                      Assign Staff
                    </button>
                  )}

                  {issue.status === "assigned" && (
                    <span className="badge badge-info">Assigned</span>
                  )}

                  {issue.status === "rejected" && (
                    <span className="badge badge-error">Rejected</span>
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