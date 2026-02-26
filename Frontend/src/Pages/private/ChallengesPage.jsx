import { Trophy, Users, Upload, Clock, Eye, Award } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext";
import { ClipLoader } from "react-spinners";

function TravelChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [challengeId, setChallengeid] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeDetails, setChallengeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [topusers, setTopusers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const userId = user.id;
  const getallChallenges = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/getchallenges");
      console.log(res.data.data);
      const now = new Date();
      const data = res.data.data
        .filter((challenge) => {
          // Filter out challenges that have passed their deadline
          if (!challenge.submissionDeadline) return true;
          return new Date(challenge.submissionDeadline) >= now;
        })
        .map((challenge) => {
          const submissions = challenge.submissions || [];
          return {
            ...challenge,
            participantsCount: submissions.length,
            hasSubmitted: challenge.hasSubmitted,
          };
        });
      setLoading(false);
      setChallenges(data);
    } catch (error) {
      console.log(error.message);
      console.log(error.response?.data?.message);
    }
  };

  const challengeStats = {
    totalCompleted: challenges.filter((ch) => ch.hasSubmitted).length,
    remaining: challenges.filter((ch) => !ch.hasSubmitted).length,
    won: challenges.filter(
      (ch) => ch.result === "published" && ch.winnerId === userId,
    ).length,
  };

  const completedChallenges = challenges.filter((ch) => ch.hasSubmitted);

  const gettopusers = async () => {
    try {
      const res = await api.get(`/user/gettopusers`);
      setTopusers(res.data.data);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  useEffect(() => {
    getallChallenges();
    gettopusers();
  }, []);

  const openSubmissionModal = (challenge) => {
    setActiveChallenge(challenge);
    setChallengeid(challenge.id);
    setCaption("");
    setImageFile(null);
    setImagePreview(null);
    setShowSubmissionModal(true);
  };

  const closeSubmissionModal = () => {
    setShowSubmissionModal(false);
    getallChallenges();
  };

  const openDetailsModal = async (challenge) => {
    setActiveChallenge(challenge);
    setShowDetailsModal(true);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/user/getchallenges/${challenge.id}`);
      setChallengeDetails(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load challenge details",
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setChallengeDetails(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleSubmitEntry = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      if (caption) formData.append("caption", caption);
      if (imageFile) formData.append("image", imageFile);

      await api.post(`/user/getchallenges/${challengeId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Challenge submitted successfully");
      closeSubmissionModal();
      getallChallenges();
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Failed to submit entry");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <ClipLoader size={35} color="#14B8A6" />
        <p className="text-gray-500 mx-3 ">Loading challenges...</p>
      </div>
    );
  }
  return (
    <div className="px-4 md:px-10 py-10">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* MAIN COLUMN - challenges list aligned more to the left */}
        <div className="flex-1 min-w-0">
          {/* HEADER */}
          <div className="mb-6 mt-6 flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              <Trophy className="w-4 h-4" />
              Travel Challenges
            </span>
            <h1 className="text-[20px] md:text-[22px] font-semibold text-gray-900">
              Compete, explore, and win rewards
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl">
              Join curated travel challenges, share your experiences, and stand
              a chance to earn exciting awards for your journeys.
            </p>
          </div>

          {/* CHALLENGE STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50">
                  <Upload className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {challengeStats.totalCompleted}
                  </p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {challengeStats.remaining}
                  </p>
                  <p className="text-xs text-gray-500">Remaining</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-50">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {challengeStats.won}
                  </p>
                  <p className="text-xs text-gray-500">Won</p>
                </div>
              </div>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {challenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                index={index}
                onSubmitClick={() => openSubmissionModal(challenge)}
                onViewDetails={() => openDetailsModal(challenge)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR - placeholder for top participants layout */}
        <aside className="hidden lg:block w-72">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Top Participants
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Top 3 travelers who participated
            </p>
            {!topusers || topusers.length === 0 ? (
              <div className="space-y-3 text-xs text-gray-600">
                <div className="h-9 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                  No top participants yet
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-gray-700">
                {topusers.slice(0, 3).map((u, idx) => (
                  <div
                    key={u.id ?? u.userId ?? idx}
                    className="h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between px-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-[11px] font-semibold">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-gray-900 truncate leading-none">
                          {u.username ?? u.name ?? "User"}
                        </p>
                        <p className="text-[10px] text-gray-500 leading-none mt-0.5">
                          ID: {u.id ?? u.userId ?? "-"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-teal-700 bg-teal-50 px-2 py-1 rounded-full">
                      Top
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* COMPLETED CHALLENGES SECTION */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-green-600" />
                Your Completed Challenges
              </h3>

              {completedChallenges.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">
                    No challenges completed yet
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Start participating to see your progress!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {completedChallenges.slice(0, 5).map((challenge, idx) => (
                    <div
                      key={challenge.id}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-3 hover:bg-green-100/50 transition-colors cursor-pointer"
                      onClick={() => openDetailsModal(challenge)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-green-700">
                                ✓
                              </span>
                            </div>
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {challenge.challengeName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <Users className="w-3 h-3" />
                            <span>
                              {challenge.participantsCount} participants
                            </span>
                            {challenge.result === "published" &&
                              challenge.winnerId && (
                                <>
                                  <span>•</span>
                                  <span className="text-amber-600 font-medium">
                                    Winner announced!
                                  </span>
                                </>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {completedChallenges.length > 5 && (
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-500">
                        +{completedChallenges.length - 5} more completed
                        challenges
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Submit your entry
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              {activeChallenge?.challengeName
                ? `Challenge: ${activeChallenge.challengeName}`
                : "Share your best travel moment for this challenge."}
            </p>

            <form onSubmit={handleSubmitEntry} className="space-y-4">
              {/* Caption */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Caption
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Write a short caption about your entry..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Image
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-teal-300 bg-teal-50/40 px-4 py-2 text-xs font-medium text-teal-700 hover:bg-teal-50">
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    <span>Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  {imageFile && (
                    <span className="text-[11px] text-gray-600 truncate max-w-[140px]">
                      {imageFile.name}
                    </span>
                  )}
                </div>

                {imagePreview && (
                  <div className="mt-3">
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={closeSubmissionModal}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && <ClipLoader size={14} color="#ffffff" />}
                  {submitting ? "Submitting..." : "Submit entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Challenge Details Modal */}
      {showDetailsModal && challengeDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeDetailsModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDetailsModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {loadingDetails ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {challengeDetails.challengeName}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        challengeDetails.result === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {challengeDetails.result === "published"
                        ? "Results Published"
                        : "Results Pending"}
                    </span>
                  </div>
                </div>

                {/* Current User's Submission */}
                {challengeDetails.currentUserSubmission && (
                  <div className="border border-teal-200 rounded-xl p-4 bg-teal-50/30">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-teal-600" />
                      Your Submission
                    </h3>
                    {challengeDetails.currentUserSubmission.caption && (
                      <p className="text-sm text-gray-700 mb-3">
                        {challengeDetails.currentUserSubmission.caption}
                      </p>
                    )}
                    {challengeDetails.currentUserSubmission.images &&
                      challengeDetails.currentUserSubmission.images.length >
                        0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {challengeDetails.currentUserSubmission.images.map(
                            (img, idx) => (
                              <div
                                key={idx}
                                className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200"
                              >
                                <img
                                  src={`http://localhost:3000/${img}`}
                                  alt={`Submission ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ),
                          )}
                        </div>
                      )}
                  </div>
                )}

                {/* Winner's Submission */}
                {challengeDetails.result === "published" &&
                  challengeDetails.winnerSubmission && (
                    <div className="border border-amber-300 rounded-xl p-4 bg-amber-50/30">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600" />
                        Winner's Submission
                        {challengeDetails.winnerSubmission.user && (
                          <span className="text-xs text-gray-600">
                            - {challengeDetails.winnerSubmission.user.username}
                          </span>
                        )}
                      </h3>
                      {challengeDetails.winnerSubmission.caption && (
                        <p className="text-sm text-gray-700 mb-3">
                          {challengeDetails.winnerSubmission.caption}
                        </p>
                      )}
                      {challengeDetails.winnerSubmission.images &&
                        challengeDetails.winnerSubmission.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-3">
                            {challengeDetails.winnerSubmission.images.map(
                              (img, idx) => (
                                <div
                                  key={idx}
                                  className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200"
                                >
                                  <img
                                    src={`http://localhost:3000/${img}`}
                                    alt={`Winner ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  )}

                {/* All Participants */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    All Participants (
                    {challengeDetails.submissions?.length || 0})
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {challengeDetails.submissions &&
                    challengeDetails.submissions.length > 0 ? (
                      challengeDetails.submissions.map((submission, idx) => (
                        <div
                          key={submission.submissionId}
                          className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs font-medium text-gray-900">
                                {submission.user?.username ||
                                  `User #${submission.userId}`}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                Submitted on{" "}
                                {new Date(
                                  submission.submissionDate,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            {challengeDetails.winnerId ===
                              submission.userId && (
                              <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                                Winner
                              </span>
                            )}
                          </div>
                          {submission.caption && (
                            <p className="text-xs text-gray-700 mb-2">
                              {submission.caption}
                            </p>
                          )}
                          {submission.images &&
                            submission.images.length > 0 && (
                              <div className="flex gap-2">
                                {submission.images
                                  .slice(0, 2)
                                  .map((img, imgIdx) => (
                                    <div
                                      key={imgIdx}
                                      className="w-16 h-16 rounded overflow-hidden border border-gray-200"
                                    >
                                      <img
                                        src={`http://localhost:3000/${img}`}
                                        alt={`${idx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                              </div>
                            )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-4">
                        No submissions yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ChallengeCard({ challenge, index, onSubmitClick, onViewDetails }) {
  const [isHovered, setIsHovered] = useState(false);
  const deadlineLabel = challenge.submissionDeadline
    ? new Date(challenge.submissionDeadline).toLocaleDateString()
    : "No deadline";

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 pt-10 flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Result Badge - positioned on left side */}
      {challenge.result && (
        <div className="absolute top-3 left-3 z-20">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
              challenge.result === "published"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            Result: {challenge.result === "published" ? "Published" : "Pending"}
          </span>
        </div>
      )}

      {/* Hover Overlay - excludes button area */}
      {isHovered && (
        <div
          className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center z-10"
          style={{ bottom: "5rem" }}
        >
          <button
            onClick={onViewDetails}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 transition"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      )}

      {/* Top badge + award */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-50 text-teal-600">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wide text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
            Challenge {index + 1}
          </span>
        </div>
        {challenge.award && (
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
            {challenge.award}
          </span>
        )}
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <h2 className="text-base font-semibold text-gray-900 line-clamp-2">
          {challenge.challengeName}
        </h2>
        {challenge.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {challenge.description}
          </p>
        )}
      </div>

      {/* Info row */}
      <div className="mt-4 space-y-2 text-xs text-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium text-gray-700">Ends</span>
            <span className="text-gray-600">{deadlineLabel}</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-600">
            <Users className="w-3.5 h-3.5" />
            <span className="text-gray-600">
              {challenge.participantsCount ?? 0} joined
            </span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        className={`mt-5 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition ${
          challenge.hasSubmitted
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-teal-600 hover:bg-teal-700"
        }`}
        onClick={onSubmitClick}
        disabled={challenge.hasSubmitted}
      >
        <Upload className="w-4 h-4" />
        {challenge.hasSubmitted ? "Already Submitted" : "Submit entry"}
      </button>
    </div>
  );
}

export default TravelChallenges;
