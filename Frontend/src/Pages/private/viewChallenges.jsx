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
  TrendingUp
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function SubmissionModal({ submission, isOpen, onClose, onSetWinner, challengeId, isSettingWinner }) {
  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{submission.user?.name || submission.user?.username}</h2>
                <p className="text-white/80">@{submission.user?.username}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Caption */}
          {submission.caption && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Caption</h3>
              <p className="text-gray-700">{submission.caption}</p>
            </div>
          )}

          {/* Images */}
          {submission.images && submission.images.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-600" />
                Submission Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submission.images.map((image, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={`http://localhost:3000/${image}`}
                      alt={`Submission ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-end">
                      <span className="text-white p-3 font-medium">Image {idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Details */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Submission Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Submitted:</span>
                <p className="font-medium text-gray-900">
                  {new Date(submission.submissionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className="font-medium text-gray-900">{submission.submissionStatus}</p>
              </div>
            </div>
          </div>

          {/* Winner Button */}
          <div className="flex justify-end">
            <button
              onClick={() => onSetWinner(challengeId, submission.userId)}
              disabled={isSettingWinner}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        <div className="ml-64 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <ClipLoader size={50} color="#8b5cf6" />
        </div>
      </>
    );
  }

  if (!challenges || challenges.length === 0) {
    return (
      <>
        <AdminSidebar />
        <div className="ml-64 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <Target className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Challenges Found</h3>
            <p className="text-gray-500">Create some challenges to get started!</p>
          </div>
        </div>
      </>
    );
  }

  // Calculate stats
  const totalChallenges = challenges.length;
  const totalSubmissions = challenges.reduce((sum, challenge) => sum + (challenge.submissions?.length || 0), 0);
  const completedChallenges = challenges.filter(c => c.result === "published").length;

  return (
    <>
      <AdminSidebar />
      <div className="ml-64 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-6 py-3 rounded-full mb-4">
              <Trophy className="w-6 h-6 text-indigo-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Challenge Management Dashboard
              </span>
              <Sparkles className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-gray-600 text-lg">Manage challenges and review user submissions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Challenges</p>
                  <p className="text-3xl font-bold text-indigo-600">{totalChallenges}</p>
                  <p className="text-xs text-gray-500 mt-1">Active challenges</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Target className="w-7 h-7 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                  <p className="text-3xl font-bold text-purple-600">{totalSubmissions}</p>
                  <p className="text-xs text-gray-500 mt-1">User submissions</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-emerald-600">{completedChallenges}</p>
                  <p className="text-xs text-gray-500 mt-1">Winners announced</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
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
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {/* Challenge Header */}
                  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <Trophy className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold mb-1">{challenge.challengeName}</h2>
                          <div className="flex items-center gap-4 text-sm text-white/80">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(challenge.submissionDeadline).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {submissionCount} submissions
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          {isCompleted ? (
                            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Completed
                            </span>
                          ) : (
                            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Pending
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-white/70">
                          {isCompleted && challenge.winnerId ? "Winner Selected" : "No Winner Yet"}
                        </div>
                      </div>
                    </div>

                    {/* Challenge Stats */}
                    <div className="grid grid-cols-4 gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div className="text-center">
                        <div className="text-lg font-bold text-indigo-600">{submissionCount}</div>
                        <div className="text-xs text-gray-600">Participants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">₹{challenge.award}</div>
                        <div className="text-xs text-gray-600">Prize</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-pink-600">
                          {new Date(challenge.submissionDeadline) > new Date() ? "Active" : "Ended"}
                        </div>
                        <div className="text-xs text-gray-600">Status</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600">
                          {isCompleted ? "✅" : "⏳"}
                        </div>
                        <div className="text-xs text-gray-600">Result</div>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div className="p-6 border-b border-gray-100">
                    <button
                      onClick={() =>
                        setExpandedChallenge(
                          expandedChallenge === challenge.id ? null : challenge.id
                        )
                      }
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2"
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
                    <div className="p-6">
                      {submissionCount === 0 ? (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No submissions yet</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {challenge.submissions.map((submission) => (
                            <div
                              key={submission.submissionId}
                              className="bg-gradient-to-r from-white to-gray-50/50 rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                                    {submission.user?.profileImage ? (
                                      <img
                                        src={`http://localhost:3000/${submission.user.profileImage}`}
                                        alt={submission.user?.username}
                                        className="w-full h-full object-cover rounded-full"
                                      />
                                    ) : (
                                      <User className="w-6 h-6 text-indigo-600" />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      {submission.user?.name || submission.user?.username}
                                    </h3>
                                    <p className="text-sm text-gray-600">@{submission.user?.username}</p>
                                    <p className="text-xs text-gray-500">
                                      Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {challenge.winnerId === submission.userId && (
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                      <Crown className="w-3 h-3" />
                                      Winner
                                    </div>
                                  )}

                                  <button
                                    onClick={() => handleViewSubmission(submission)}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Post
                                  </button>
                                </div>
                              </div>

                              {/* Preview */}
                              <div className="mt-4 flex items-center gap-4">
                                {submission.caption && (
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-700 line-clamp-2">
                                      {submission.caption}
                                    </p>
                                  </div>
                                )}

                                {submission.images && submission.images.length > 0 && (
                                  <div className="flex gap-2">
                                    {submission.images.slice(0, 3).map((image, idx) => (
                                      <div key={idx} className="relative">
                                        <img
                                          src={`http://localhost:3000/${image}`}
                                          alt={`Preview ${idx + 1}`}
                                          className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        {idx === 2 && submission.images.length > 3 && (
                                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                              +{submission.images.length - 3}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
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
