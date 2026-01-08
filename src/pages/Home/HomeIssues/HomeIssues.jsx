import React, { useEffect, useState } from "react";
import useAxiosSimple from "../../../hooks/useAxiosSimple";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { AiFillLike } from "react-icons/ai";
import Swal from "sweetalert2";

const HomeIssues = () => {
  const [issues, setIssues] = useState([]);
  const axiosSimple = useAxiosSimple();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadIssues = () => {
    axiosSimple
      .get("/issues/home")
      .then((res) => setIssues(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleUpvote = async (issueId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await axiosSecure.patch(`/issues/${issueId}/upvote`);
      loadIssues(); // refresh vote count
      Swal.fire("Success", "Upvoted successfully", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <div className="px-3 lg:px-8">
        <h2 className="text-3xl font-bold text-secondary mb-6">Available Issues</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <div key={issue._id} className="card bg-base-100 shadow-xl">
            <figure>
              <img
                src={issue.image || "https://via.placeholder.com/300"}
                alt={issue.title}
                className="h-48 w-full object-cover"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">{issue.title}</h2>

              <p className="text-sm flex items-center gap-1">
                <AiFillLike /> {issue.upvoteCount || 0} votes
              </p>

              <div className="card-actions justify-between mt-3">
                <button
                  onClick={() => handleUpvote(issue._id)}
                  className="btn btn-outline btn-sm"
                >
                  Upvote
                </button>

                <Link to={`/issues/${issue._id}`}>
                  <button className="btn btn-primary btn-sm text-black">
                    Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeIssues;