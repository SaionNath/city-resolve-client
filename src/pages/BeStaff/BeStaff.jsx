import React from "react";
import { useForm, useWatch } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import { useLoaderData, useNavigate } from "react-router";

const Bestaff = () => {
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
  // console.log(serviceCenterData);

  const regionsDuplicate = serviceCenterData.map((c) => c.region);
  const regions = [...new Set(regionsDuplicate)];

  const staffRegion = useWatch({ control, name: "staffRegion" });

  const districtsByRegion = (region) => {
    const regionDistricts = serviceCenterData.filter(
      (c) => c.region === region
    );
    const districts = regionDistricts.map((d) => d.district);
    return districts;
  };

  const handleStaff = (data) => {
    console.log(data);
    axiosSecure.post("/staffs", data).then((res) => {
      if (res.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title:
            "Your application has been submitted. We will inform you in 14 days",
          showConfirmButton: false,
          timer: 3500,
        }).then(() => {
          navigate("/dashboard");
        });
      }
    });
  };

  return (
    <div className="bg-white px-16 py-12 rounded-2xl my-4">
      <h3 className="text-5xl font-bold text-secondary mb-6">Be a staff</h3>

      <div className="border-b border-dashed border-secondary my-6"></div>
      <div>
        <h2 className="text-2xl font-bold text-secondary">
          Tell us about yourself
        </h2>

        <form onSubmit={handleSubmit(handleStaff)} className="mt-6">
          <div>
            <fieldset className="fieldset">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="space-y-3">
                  {/* staff Name */}
                  <div>
                    <label className="label">Name</label>
                    <input
                      type="text"
                      {...register("staffName", { required: true })}
                      className="input w-full"
                      defaultValue={user?.displayName}
                    />

                    {errors.staffName?.type === "required" && (
                      <p className="text-red-500">Staff Name is required</p>
                    )}
                  </div>

                  {/* staff Email */}
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      {...register("staffEmail", { required: true })}
                      className="input w-full"
                      defaultValue={user?.email}
                    />

                    {errors.staffEmail?.type === "required" && (
                      <p className="text-red-500">Staff Email is required</p>
                    )}
                  </div>

                  {/* staff Age */}
                  <div>
                    <label className="label">Age</label>
                    <input
                      type="number"
                      {...register("staffAge", { required: true })}
                      className="input w-full"
                      placeholder="Your Age"
                    />

                    {errors.staffAge?.type === "required" && (
                      <p className="text-red-500">Staff Age is required</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* staff nid No */}
                  <div>
                    <label className="label">NID No</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      {...register("staffNid", { required: true })}
                      className="input w-full"
                      placeholder="Your NID"
                    />

                    {errors.staffNid?.type === "required" && (
                      <p className="text-red-500">Staff Nid is required</p>
                    )}
                  </div>

                  {/* staff region */}
                  <div>
                    <label className="fieldset-label">Region</label>
                    <select
                      {...register("staffRegion", { required: true })}
                      defaultValue="Select a region"
                      className="select w-full"
                    >
                      <option disabled={true}>Select a region</option>
                      {regions.map((region, index) => (
                        <option key={index} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {errors.staffRegion?.type === "required" && (
                      <p className="text-red-500">Staff Region is required</p>
                    )}
                  </div>

                  {/* staff District */}
                  <div>
                    <label className="fieldset-label">District</label>
                    <select
                      {...register("staffDistrict", { required: true })}
                      defaultValue="Select a district"
                      className="select w-full"
                    >
                      <option disabled={true}>Select a district</option>
                      {districtsByRegion(staffRegion).map((region, index) => (
                        <option key={index} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {errors.staffDistrict?.type === "required" && (
                      <p className="text-red-500">Staff District is required</p>
                    )}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* staff Phone No */}
            <div>
              <label className="label">Phone No</label>
              <input
                type="tel"
                {...register("staffPhone", { required: true })}
                className="input w-full"
                placeholder="Your Phone No"
              />

              {errors.staffPhone?.type === "required" && (
                <p className="text-red-500">Staff Phone is required</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn w-full bg-primary hover:bg-lime-400 text-black font-semibold mt-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Bestaff;
