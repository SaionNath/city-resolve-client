import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import axios from "axios";
import useAxios from "../../../../hooks/useAxios";

const ManageStaff = () => {
  const axiosSecure = useAxios();
  const serviceCenterData = useLoaderData();

  const [staffs, setStaffs] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    // formState: { errors },
  } = useForm();

  useEffect(() => {
    let isMounted = true;

    const loadStaffs = async () => {
      try {
        const res = await axiosSecure.get("/staffs");
        if (isMounted) {
          setStaffs(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch staffs", error);
      }
    };

    loadStaffs();

    return () => {
      isMounted = false;
    };
  }, [axiosSecure]);

  const regions = [...new Set(serviceCenterData.map((c) => c.region))];
  const staffRegion = useWatch({ control, name: "staffRegion" });

  const districtsByRegion = (region) => {
    if (!region) return [];
    return serviceCenterData
      .filter((c) => c.region === region)
      .map((d) => d.district);
  };

  const handleCreateStaff = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host_Key
        }`,
        formData,
      );

      const photoURL = imgRes.data.data.url;

      const staffInfo = {
        staffName: data.staffName,
        staffEmail: data.staffEmail,
        password: data.password,
        staffAge: data.staffAge,
        staffPhone: data.staffPhone,
        staffNid: data.staffNid,
        staffRegion: data.staffRegion,
        staffDistrict: data.staffDistrict,
        photoURL,
      };

      await axiosSecure.post("/admin/create-staff", staffInfo);

      Swal.fire("Success", "Staff created successfully", "success");

      setOpenModal(false);
      reset();

      const res = await axiosSecure.get("/staffs");
      setStaffs(res.data);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-secondary">Manage Staff</h2>
        <button
          className="btn btn-primary text-black"
          onClick={() => setOpenModal(true)}
        >
          + Add Staff
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>District</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((s) => (
              <tr key={s._id}>
                <td>
                  <img
                    src={s.photoURL}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td>{s.staffName}</td>
                <td>{s.email}</td>
                <td>{s.staffRegion}</td>
                <td>{s.staffDistrict}</td>
                <td>
                  {s.isBlocked ? (
                    <span className="badge badge-error">Blocked</span>
                  ) : (
                    <span className="badge badge-success">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openModal && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-2xl mb-4">Add New Staff</h3>

            <form
              onSubmit={handleSubmit(handleCreateStaff)}
              className="space-y-3"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  {...register("staffName", { required: true })}
                  placeholder="Name"
                  className="input input-bordered w-full"
                />

                <input
                  {...register("staffEmail", { required: true })}
                  placeholder="Email"
                  className="input input-bordered w-full"
                />

                <input
                  {...register("password", { required: true, minLength: 6 })}
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                />

                <input
                  {...register("staffAge", { required: true })}
                  type="number"
                  placeholder="Age"
                  className="input input-bordered w-full"
                />

                <input
                  {...register("staffPhone", { required: true })}
                  placeholder="Phone"
                  className="input input-bordered w-full"
                />

                <input
                  {...register("staffNid", { required: true })}
                  placeholder="NID No"
                  className="input input-bordered w-full"
                />

                <select
                  {...register("staffRegion", { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Region</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <select
                  {...register("staffDistrict", { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select District</option>
                  {districtsByRegion(staffRegion).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="file"
                {...register("photo", { required: true })}
                className="file-input w-full"
              />

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-black">
                  Create Staff
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ManageStaff;