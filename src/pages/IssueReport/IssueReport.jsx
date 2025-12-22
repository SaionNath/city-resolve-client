import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const IssueReport = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const serviceCenterData = useLoaderData();
  const regions = [...new Set(serviceCenterData.map((c) => c.region))];
  const incidentRegion = useWatch({ control, name: "incidentRegion" });

  const districtsByRegion = (region) => {
    return serviceCenterData
      .filter((c) => c.region === region)
      .map((d) => d.district);
  };

  const { data: dbUser = {} } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  const isPremium = dbUser?.premium;
  const issueCount = dbUser?.issueCount || 0;
  const canReport = isPremium || issueCount < 3;

  const handleReportIssue = async (data) => {
    if (!canReport) {
      Swal.fire({
        icon: "warning",
        title: "Limit Reached",
        text: "Free users can report up to 3 issues. Please subscribe to continue.",
        confirmButtonText: "Go to Subscription",
      }).then(() => navigate("/dashboard/profile"));
      return;
    }

    let imageUrl = "";

    if (data.issueImage && data.issueImage[0]) {
      const formData = new FormData();
      formData.append("image", data.issueImage[0]);

      const imageApiUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_host_Key
      }`;

      try {
        const imgRes = await axios.post(imageApiUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = imgRes.data.data.url;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `Image Upload Failed ${error}`,
          text: "Please try again later.",
        });
        return;
      }
    }

    const issueData = {
      title: data.title,
      description: data.description,
      incidentRegion: data.incidentRegion,
      incidentDistrict: data.incidentDistrict,
      image: imageUrl,
      reporterEmail: user.email,
      reporterName: user.displayName,
      status: "pending",
      priority: "normal",
      createdAt: new Date(),
    };

    const res = await axiosSecure.post("/issues", issueData);

    if (res.data.insertedId) {
      Swal.fire({
        icon: "success",
        title: "Issue Submitted",
        text: "Your issue has been reported successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/dashboard/my_issues");
    }
  };

  return (
    <div className="bg-white px-10 py-8 rounded-2xl text-black">
      <h2 className="text-3xl font-bold">Report an Issue</h2>
      <p className="text-gray-600 mt-2">
        Please provide accurate information so the issue can be resolved faster.
      </p>

      {!canReport && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mt-4">
          You have reached the free issue limit (3). Subscribe for <b>1000tk</b>{" "}
          to report unlimited issues.
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleReportIssue)}
        className="mt-6 space-y-4"
      >
        {/* Issue Title */}
        <div>
          <label className="label">Issue Title</label>
          <input
            {...register("title", { required: true })}
            className="input w-full"
            placeholder="Short issue title"
          />
          {errors.title && <p className="text-red-500">Title is required</p>}
        </div>

        {/* Issue Image */}
        <div>
          <label className="label">Issue Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            {...register("issueImage")}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Region */}
        <div>
          <label className="label">Incident Region</label>
          <select
            {...register("incidentRegion", { required: true })}
            className="select w-full"
          >
            <option value="">Select Region</option>
            {regions.map((r, i) => (
              <option key={i} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="label">Incident District</label>
          <select
            {...register("incidentDistrict", { required: true })}
            className="select w-full"
          >
            <option value="">Select District</option>
            {districtsByRegion(incidentRegion).map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="label">Issue Description</label>
          <textarea
            {...register("description", { required: true })}
            className="textarea w-full"
            rows="4"
            placeholder="Describe the issue in detail"
          />
        </div>

        <button
          disabled={!canReport}
          className="btn w-full bg-primary text-black font-semibold disabled:opacity-50"
        >
          Submit Issue
        </button>
      </form>
    </div>
  );
};

export default IssueReport;
