import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Loading from "../../components/Loading/Loading";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useRef, useState } from "react";

const IssueDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const editModalRef = useRef();
  const [editData, setEditData] = useState({});

  const { data: issue, isLoading } = useQuery({
    queryKey: ["issueDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/${id}`);
      return res.data;
    },
  });

  const canModify =
    user?.email === issue?.reporterEmail && issue?.status === "pending";

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      title: editData.title,
      description: editData.description,
      image: editData.image,
      region: editData.region,
      incidentDistrict: editData.incidentDistrict,
    };

    try {
      await axiosSecure.patch(`/issues/${id}/edit`, payload);

      Swal.fire("Updated!", "Issue updated successfully", "success");
      editModalRef.current.close();
      window.location.reload();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error",
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditData({
      title: issue.title,
      description: issue.description,
      image: issue.image || "",
      incidentRegion: issue.incidentRegion || "",
      incidentDistrict: issue.incidentDistrict || "",
    });

    editModalRef.current.showModal();
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Delete this issue?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/issues/${id}`).then(() => {
          Swal.fire("Deleted!", "Issue removed successfully", "success");
          window.history.back();
        });
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">
      <h2 className="text-3xl font-bold mb-6 border-b pb-3">{issue.title}</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Tracking ID:</strong>{" "}
            <span className="text-gray-500">{issue.trackingId}</span>
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span className="badge badge-outline ml-2">{issue.status}</span>
          </p>

          {issue?.status === "rejected" && (
            <p className="text-red-600">
              <strong>Rejection Reason:</strong> {issue.rejectionReason}
            </p>
          )}

          <p>
            <strong>Priority:</strong>{" "}
            <span className="badge badge-warning ml-2">{issue.priority}</span>
          </p>

          <p>
            <strong>District:</strong> {issue.incidentDistrict}
          </p>

          <div className="mt-4">
            <h4 className="font-semibold text-lg mb-1">Description</h4>
            <p className="text-gray-600 leading-relaxed">{issue.description}</p>
          </div>

          {canModify && (
            <div className="flex gap-4 pt-6">
              <button className="btn btn-warning" onClick={handleEdit}>
                Edit
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center items-start">
          {issue.image ? (
            <img
              src={issue.image}
              alt={issue.title}
              className="rounded-xl max-h-100px object-cover shadow"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400">
              No image provided
            </div>
          )}
        </div>
      </div>

      {/* edit modal */}
      <dialog ref={editModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Issue</h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              name="title"
              value={editData.title || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Title"
              required
            />

            <textarea
              name="description"
              value={editData.description || ""}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              placeholder="Description"
              required
            />

            <input
              type="text"
              name="image"
              value={editData.image || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Image URL"
            />

            <input
              type="text"
              name="region"
              value={editData.incidentRegion || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Region"
              required
            />

            <input
              type="text"
              name="incidentDistrict"
              value={editData.incidentDistrict || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="District"
              required
            />

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => editModalRef.current.close()}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary text-black">
                Update
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default IssueDetails;