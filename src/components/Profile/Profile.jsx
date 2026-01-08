import React, { useEffect, useState } from "react";
import { FaCrown, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import Loading from "../Loading/Loading";

const Profile = () => {
  const { user, loading, updateUserProfile } = useAuth();
  const axiosSecure = useAxios();

  const [dbUser, setDbUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/${user.email}`).then((res) => {
        setDbUser(res.data);
        setName(res.data.displayName || "");
      });
    }
  }, [user, axiosSecure]);

  if (loading || !user || !dbUser) return <Loading />;

  const handleGetPremium = async () => {
    try {
      const res = await axiosSecure.post("/premium-checkout");
      window.location.href = res.data.url;
    } catch {
      Swal.fire({
        title: "Cancelled",
        text: "Premium activation failed",
        icon: "error",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      let photoURL = dbUser.photoURL;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_image_host_Key
          }`,
          formData
        );

        photoURL = imgRes.data.data.url;
      }

      await axiosSecure.patch("/users/profile", {
        displayName: name,
        photoURL,
      });

      await updateUserProfile({ displayName: name, photoURL });

      Swal.fire({
        title: "Profile updated successfully",
        icon: "success",
        draggable: true,
      });
      setOpen(false);
      setDbUser({ ...dbUser, displayName: name, photoURL });
    } catch {
      Swal.fire({
        title: "Cancelled",
        text: "Profile update failed",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col items-center gap-3 relative">
        {/* Profile Photo */}
        <div className="relative">
          <img
            src={dbUser.photoURL}
            className="w-28 h-28 rounded-full object-cover"
          />
          <button
            onClick={() => setOpen(true)}
            className="absolute bottom-1 right-1 bg-green-500 p-2 rounded-full text-white"
          >
            <FaEdit />
          </button>
        </div>

        <h2 className="flex items-center gap-2 text-xl font-bold">
          {dbUser.displayName}
          {dbUser.isPremium && (
            <span className="text-yellow-500">
              <FaCrown />
            </span>
          )}
        </h2>

        <p className="text-gray-600">
          {user.email}
          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700 capitalize">
            {dbUser.role}
          </span>
        </p>

        {dbUser.role === "citizen" && !dbUser.isPremium && (
          <button
            onClick={handleGetPremium}
            className="btn btn-primary text-black mt-3"
          >
            Get Premium
          </button>
        )}
        
        {dbUser.isPremium && (
          <p className="font-bold text-black">Premium Member</p>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-3">Edit Profile</h3>

            <label className="label">Name</label>
            <input
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="label mt-3">Change Photo</label>
            <input
              type="file"
              className="file-input w-full"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUpdate}
                className="btn btn-primary text-black"
              >
                Save
              </button>
              <button
                onClick={() => setOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
