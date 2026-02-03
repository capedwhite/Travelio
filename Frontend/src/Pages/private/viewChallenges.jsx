import { useEffect, useState } from "react";
import AdminSidebar from "../../components/Adminnavbar";
import {
  Trophy,
  Users,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Award,
  Star,
  Sparkles,
  Camera,
  User,
  CheckCircle,
  Crown,
  Target,
  TrendingUp,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function SubmissionModal({
  submission,
  isOpen,
  onClose,
  onSetWinner,
  challengeId,
  isSettingWinner,
}) {
  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#3ab19d] rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {submission.user?.name || submission.user?.username}
                </h2>
                <p className="text-slate-500">@{submission.user?.username}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition text-slate-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Caption */}
          {submission.caption && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <h3 className="font-medium text-slate-600 mb-2 text-sm">
                Caption
              </h3>
              <p className="text-slate-800 leading-relaxed">
                {submission.caption}
              </p>
            </div>
          )}

          {/* Images */}
          {submission.images && submission.images.length > 0 && (
            <div>
              <h3 className="font-medium text-slate-600 mb-4 flex items-center gap-2 text-sm">
                <Camera className="w-4 h-4 text-[#3ab19d]" />
                Submission Photos
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {submission.images.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative group overflow-hidden rounded-xl border border-slate-200"
                  >
                    <img
                      src={`http://localhost:3000/${image}`}
                      alt={`Submission ${idx + 1}`}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <span className="text-xs text-slate-500">Submitted On</span>
              <p className="font-semibold text-slate-800 mt-1">
                {new Date(submission.submissionDate).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <span className="text-xs text-slate-500">Status</span>
              <p className="font-semibold text-slate-800 mt-1">
                {submission.submissionStatus}
              </p>
            </div>
          </div>

          {/* Winner Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSetWinner(challengeId, submission.userId)}
              disabled={isSettingWinner}
              className="bg-[#3ab19d] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2d9b8a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSettingWinner ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  Set as Winner
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedChallenge, setExpandedChallenge] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [settingWinner, setSettingWinner] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/challenges/submissions");
      setChallenges(res.data.data);
    } catch (error) {
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setModalOpen(true);
  };

  const handleSetWinner = async (challengeId, winnerId) => {
    try {
      setSettingWinner(true);
      await api.put(`/admin/challenges/${challengeId}/winner/${winnerId}`);
      toast.success("Winner set successfully!");
      setModalOpen(false);
      fetchChallenges(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set winner");
    } finally {
      setSettingWinner(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <div className="ml-64 min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <ClipLoader size={50} color="#475569" />
            <p className="text-slate-600 mt-4 font-medium">
              Loading challenges...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!challenges || challenges.length === 0) {
    return (
      <>
        <AdminSidebar />
        <div className="ml-64 min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-600 mb-2">
              No Challenges Found
            </h3>
            <p className="text-slate-500">
              Create some challenges to get started!
            </p>
          </div>
        </div>
      </>
    );
  }

  // Calculate stats
  const totalChallenges = challenges.length;
  const totalSubmissions = challenges.reduce(
    (sum, challenge) => sum + (challenge.submissions?.length || 0),
    0,
  );
  const completedChallenges = challenges.filter(
    (c) => c.result === "published",
  ).length;

  return (
    <>
      <AdminSidebar />
      <div className="ml-64 min-h-screen bg-slate-50">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-lg border border-slate-200 mb-6">

              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Challenge Dashboard
                </h1>
                <p className="text-slate-500">
                  Manage competitions and select winners
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Total Challenges
                  </p>
                  <p className="text-3xl font-bold text-slate-800">
                    {totalChallenges}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Active competitions
                  </p>
                </div>
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Total Submissions
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {totalSubmissions}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Participant entries
                  </p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {completedChallenges}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Winners selected
                  </p>
                </div>
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Challenges */}
          <div className="space-y-6">
            {challenges.map((challenge) => {
              const submissionCount = challenge.submissions?.length || 0;
              const isCompleted = challenge.result === "published";

              return (
                <div
                  key={challenge.id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Challenge Header */}
                  <div className="bg-slate-50 p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#3ab19d] rounded-xl flex items-center justify-center">
                          <Trophy className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-800">
                            {challenge.challengeName}
                          </h2>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Deadline:{" "}
                              {new Date(
                                challenge.submissionDeadline,
                              ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {submissionCount} entries
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Prize */}
                        <div className="text-right mr-4">
                          <p className="text-sm text-slate-500">Prize Pool</p>
                          <p className="text-xl font-bold text-[#3ab19d]">
                            ₹{challenge.award}
                          </p>
                        </div>

                        {/* Status Badge */}
                        {isCompleted ? (
                          <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {new Date(challenge.submissionDeadline) > new Date()
                              ? "Active"
                              : "Ended"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div className="p-6">
                    <button
                      onClick={() =>
                        setExpandedChallenge(
                          expandedChallenge === challenge.id
                            ? null
                            : challenge.id,
                        )
                      }
                      className="w-full bg-[#3ab19d] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#2d9b8a] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {expandedChallenge === challenge.id ? (
                        <>
                          <EyeOff className="w-5 h-5" />
                          Hide Submissions
                        </>
                      ) : (
                        <>
                          <Eye className="w-5 h-5" />
                          View Submissions ({submissionCount})
                        </>
                      )}
                    </button>
                  </div>

                  {/* Submissions */}
                  {expandedChallenge === challenge.id && (
                    <div className="px-6 pb-6">
                      {submissionCount === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-500">No submissions yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {challenge.submissions.map((submission) => (
                            <div
                              key={submission.submissionId}
                              className="bg-slate-50 rounded-xl border border-slate-200 p-4 hover:bg-white hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                                    {submission.user?.profileImage ? (
                                      <img
                                        src={`http://localhost:3000/${submission.user.profileImage}`}
                                        alt={submission.user?.username}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <User className="w-6 h-6 text-slate-500" />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-slate-800">
                                      {submission.user?.name ||
                                        submission.user?.username}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                      {new Date(
                                        submission.submissionDate,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {challenge.winnerId === submission.userId && (
                                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                                      <Crown className="w-4 h-4" />
                                      Winner
                                    </div>
                                  )}

                                  <button
                                    onClick={() =>
                                      handleViewSubmission(submission)
                                    }
                                    className="bg-[#3ab19d] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2d9b8a] transition-all duration-200 flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View
                                  </button>
                                </div>
                              </div>

                              {/* Preview */}
                              {(submission.caption ||
                                (submission.images &&
                                  submission.images.length > 0)) && (
                                <div className="mt-3 flex items-center gap-4 pt-3 border-t border-slate-200">
                                  {submission.caption && (
                                    <p className="flex-1 text-sm text-slate-600 line-clamp-1">
                                      {submission.caption}
                                    </p>
                                  )}

                                  {submission.images &&
                                    submission.images.length > 0 && (
                                      <div className="flex gap-2">
                                        {submission.images
                                          .slice(0, 3)
                                          .map((image, idx) => (
                                            <img
                                              key={idx}
                                              src={`http://localhost:3000/${image}`}
                                              alt={`Preview ${idx + 1}`}
                                              className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                                            />
                                          ))}
                                        {submission.images.length > 3 && (
                                          <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                                            <span className="text-slate-600 text-xs font-medium">
                                              +{submission.images.length - 3}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      <SubmissionModal
        submission={selectedSubmission}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSetWinner={handleSetWinner}
        challengeId={selectedSubmission?.challengeId}
        isSettingWinner={settingWinner}
      />
    </>
  );
}

export default ViewChallenges;
