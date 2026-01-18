import { useForm } from "react-hook-form";
import AdminSidebar from "../../components/Adminnavbar";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

function AddChallenges() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      challengeName: "",
      title: "",
      submissionDeadline: "",
      description: "",
      award: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log(data);
      // TODO: Replace with actual API endpoint
      const res = await api.post("/admin/challenges", data);
      toast.success(res.data.message || "Challenge created successfully!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to create challenge"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminSidebar />
      <div className="pl-8 pr-8 pt-8 pb-6 bg-gray-50 min-h-screen ml-64">
        <h1 className="text-gray-500 mt-1 text-lg mb-6">Add New Challenge</h1>

        <div className="bg-white rounded-2xl shadow p-8 max-w-3xl">
          <h2 className="text-2xl font-semibold mb-6">Challenge Details</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Challenge Name */}
            <div>
              <input
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Challenge Name *"
                {...register("challengeName", {
                  required: "Challenge name is required",
                })}
              />
              {errors.challengeName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.challengeName.message}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <input
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Title *"
                {...register("title", {
                  required: "Title is required",
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Submission Deadline */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Submission Deadline *
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                {...register("submissionDeadline", {
                  required: "Submission deadline is required",
                })}
              />
              {errors.submissionDeadline && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.submissionDeadline.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows={5}
                placeholder="Description *"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Award You'll Receive */}
            <div>
              <input
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Award You'll Receive *"
                {...register("award", {
                  required: "Award description is required",
                })}
              />
              {errors.award && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.award.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <ClipLoader size={16} color="#ffffff" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Challenge"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddChallenges;

