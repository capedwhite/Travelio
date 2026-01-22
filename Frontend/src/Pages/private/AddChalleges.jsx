import { useForm } from "react-hook-form";
import AdminSidebar from "../../components/Adminnavbar";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Edit2, Trash2, X, Sparkles } from "lucide-react";

function AddChallenges() {
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatingChallenge, setUpdatingChallenge] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
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

  const updateForm = useForm({
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

  const handleUpdateChallenge = async (challengeItem) => {
    try {
      setUpdateLoading(true);
      const res = await api.get(`/admin/getchallenges/${challengeItem.id}`);
      const challengeData = res.data.data;

      setUpdatingChallenge(challengeData);
      updateForm.reset({
        challengeName: challengeData.challengeName || "",
        submissionDeadline: challengeData.submissionDeadline
          ? new Date(challengeData.submissionDeadline).toISOString().split('T')[0]
          : "",
        description: challengeData.description || "",
        award: challengeData.award || "",
        awardDetail: challengeData.awardDetail || "",
      });
      setShowUpdateModal(true);
    } catch (error) {
      toast.error("Failed to load challenge details");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (!window.confirm("Are you sure you want to delete this challenge? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleteLoading(challengeId);
      await api.delete(`/admin/getchallenges/${challengeId}`);
      toast.success("Challenge deleted successfully!");
      fetchChallenges();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete challenge");
    } finally {
      setDeleteLoading(null);
    }
  };

  const onUpdateSubmit = async (data) => {
    try {
      setUpdateLoading(true);
      await api.put(`/admin/getchallenges/${updatingChallenge.id}`, data);
      toast.success("Challenge updated successfully!");
      setShowUpdateModal(false);
      fetchChallenges();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update challenge");
    } finally {
      setUpdateLoading(false);
    }
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

        {/* Update Challenge Modal */}
        {showUpdateModal && updatingChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Update Challenge</h2>
                    <p className="text-sm text-gray-500">Make changes to your challenge</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="p-6 space-y-6">
                {/* Challenge Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Challenge Name *
                  </label>
                  <input
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Enter challenge name"
                    {...updateForm.register("challengeName", {
                      required: "Challenge name is required",
                    })}
                  />
                  {updateForm.formState.errors.challengeName && (
                    <p className="text-red-500 text-sm mt-1">
                      {updateForm.formState.errors.challengeName.message}
                    </p>
                  )}
                </div>

                {/* Submission Deadline */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Submission Deadline *
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    {...updateForm.register("submissionDeadline", {
                      required: "Submission deadline is required",
                    })}
                  />
                  {updateForm.formState.errors.submissionDeadline && (
                    <p className="text-red-500 text-sm mt-1">
                      {updateForm.formState.errors.submissionDeadline.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                    rows={4}
                    placeholder="Describe the challenge"
                    {...updateForm.register("description", {
                      required: "Description is required",
                    })}
                  />
                  {updateForm.formState.errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {updateForm.formState.errors.description.message}
                    </p>
                  )}
                </div>

                {/* Award */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Award *
                  </label>
                  <input
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="What will participants receive?"
                    {...updateForm.register("award", {
                      required: "Award is required",
                    })}
                  />
                  {updateForm.formState.errors.award && (
                    <p className="text-red-500 text-sm mt-1">
                      {updateForm.formState.errors.award.message}
                    </p>
                  )}
                </div>

                {/* Award Detail */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Award Details *
                  </label>
                  <input
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="More details about the award"
                    {...updateForm.register("awardDetail", {
                      required: "Award detail is required",
                    })}
                  />
                  {updateForm.formState.errors.awardDetail && (
                    <p className="text-red-500 text-sm mt-1">
                      {updateForm.formState.errors.awardDetail.message}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="px-6 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {updateLoading ? (
                      <div className="flex items-center gap-2">
                        <ClipLoader size={16} color="#ffffff" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Update Challenge</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                            disabled={updateLoading}
                            className="group relative px-4 py-2 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center gap-2">
                              <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                              <span className="hidden sm:inline">Update</span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteChallenge(c.id)}
                            disabled={deleteLoading === c.id}
                            className="group relative px-4 py-2 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center gap-2">
                              {deleteLoading === c.id ? (
                                <ClipLoader size={14} color="#dc2626" />
                              ) : (
                                <Trash2 className="w-4 h-4 group-hover:animate-bounce" />
                              )}
                              <span className="hidden sm:inline">
                                {deleteLoading === c.id ? "Deleting..." : "Delete"}
                              </span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
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


