import { useForm } from "react-hook-form";
import AdminSidebar from "../../components/Adminnavbar";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

function AddChallenges() {
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [challenges, setChallenges] = useState([]);
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
      awardDetail: "",
    },
  });

  const fetchChallenges = async () => {
    try {
      setListLoading(true);
      const res = await api.get("/admin/getchallenges");
      setChallenges(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch challenges");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  // Empty funcs for now (per your request)
  const handleUpdateChallenge = (challengeItem) => {
    console.log("Update clicked:", challengeItem);
  };

  const handleDeleteChallenge = (challengeId) => {
    console.log("Delete clicked:", challengeId);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log(data);

      const res = await api.post("/admin/addchallenges", data);
      toast.success(res.data.message || "Challenge created successfully!");
      reset();
      fetchChallenges();
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
        <h1 className="text-gray-500 mt-1 text-[20px] mb-6">Add New Challenge</h1>

        <div className="bg-white rounded-2xl shadow p-8 max-w-3xl">
          <h2 className="text-[16px] font-semibold mb-6">Challenge Details</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
     
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
            <div>
              <input
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Description about the award *"
                {...register("awardDetail", {
                  required: "Award detail is required",
                })}
              />
              {errors.awardDetail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.awardDetail.message}
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

        {/* Challenges List */}
        <div className="bg-white rounded-2xl shadow p-8 mt-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-[16px] font-semibold">Challenges Added</h2>
            <button
              type="button"
              onClick={fetchChallenges}
              className="px-4 py-2 rounded-lg font-medium transition bg-teal-100 text-teal-700 hover:bg-teal-200"
            >
              Refresh
            </button>
          </div>

          {listLoading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <ClipLoader size={16} color="#0d9488" />
              <span>Loading challenges...</span>
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-gray-500">No challenges found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-600 text-sm border-b">
                    <th className="py-3 pr-4">Challenge Name</th>
                    <th className="py-3 pr-4">Deadline</th>
                    <th className="py-3 pr-4">Award</th>
                    <th className="py-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.map((c) => (
                    <tr key={c.id} className="border-b last:border-b-0">
                      <td className="py-4 pr-4">
                        <div className="font-medium text-gray-900">
                          {c.challengeName}
                        </div>
                        {c.description ? (
                          <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {c.description}
                          </div>
                        ) : null}
                      </td>
                      <td className="py-4 pr-4 text-gray-700 whitespace-nowrap">
                        {c.submissionDeadline
                          ? new Date(c.submissionDeadline).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-4 pr-4 text-gray-700">
                        {c.award || "-"}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateChallenge(c)}
                            className="px-3 py-2 rounded-lg font-medium transition bg-teal-600 text-white hover:bg-teal-700"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteChallenge(c.id)}
                            className="px-3 py-2 rounded-lg font-medium transition bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddChallenges;


