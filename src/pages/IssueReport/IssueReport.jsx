import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../components/Loading/Loading";

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

  const { data: dbUser = {}, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  if (!user || isLoading) return <Loading />;

  // if (dbUser?.role === "citizen" && dbUser?.isBlocked) {
  //   navigate("/dashboard/account_restricted", {
  //     state: {
  //       reason: dbUser.blockReason,
  //     },
  //     replace: true,
  //   });
  //   return null;
  // }

  const isPremium = dbUser?.isPremium;
  const issueCount = dbUser?.issueCount || 0;
  const canReport = isPremium || issueCount < 3;

  const handleReportIssue = async (data) => {
    let imageUrl = "";

    if (data.issueImage?.[0]) {
      const formData = new FormData();
      formData.append("image", data.issueImage[0]);

      try {
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_image_host_Key
          }`,
          formData
        );
        imageUrl = imgRes.data.data.url;
      } catch {
        Swal.fire({
          icon: "error",
          title: "error",
          text: "Image upload failed",
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
    };

    try {
      const res = await axiosSecure.post("/issues", issueData);

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Issue Submitted",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/dashboard/my_issues");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        navigate("/dashboard/account_restricted", {
          state: {
            reason: error.response.data.reason,
          },
        });
        return;
      }
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Something went wrong",
      });
    }
  };

  return (
    <div className="bg-white px-10 py-8 rounded-2xl text-black">
      <h2 className="text-3xl font-bold">Report an Issue</h2>
      <p className="text-gray-600 mt-2">
        Please provide accurate information so the issue can be resolved faster.
      </p>

      {!canReport && (
        <div className="bg-yellow-100 p-4 rounded mt-4 text-yellow-800">
          Free users can report only 3 issues. Upgrade to Premium for unlimited
          reports.
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleReportIssue)}
        className="mt-6 space-y-4"
      >
        <input
          {...register("title", { required: true })}
          className="input w-full"
          placeholder="Issue title"
        />
        {errors.title && <p className="text-red-500">Title required</p>}

        <input
          type="file"
          accept="image/*"
          {...register("issueImage")}
          className="file-input w-full"
        />

        <select
          {...register("incidentRegion", { required: true })}
          className="select w-full"
        >
          <option value="">Select Region</option>
          {regions.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <select
          {...register("incidentDistrict", { required: true })}
          className="select w-full"
        >
          <option value="">Select District</option>
          {districtsByRegion(incidentRegion).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <textarea
          {...register("description", { required: true })}
          className="textarea w-full"
          placeholder="Describe the issue"
        />

        <button
          disabled={!canReport}
          className="btn w-full bg-primary text-black"
        >
          Submit Issue
        </button>
      </form>
    </div>
  );
};

export default IssueReport;