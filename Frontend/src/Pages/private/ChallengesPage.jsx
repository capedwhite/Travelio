import { Trophy, Users, Upload, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function TravelChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const getallChallenges = async () => {
    const res = await api.get("/admin/getchallenges");
    console.log(res.data.data);
    setChallenges(res.data.data);
  };

  useEffect(() => {
    getallChallenges();
  }, []);

  const openSubmissionModal = (challenge) => {
    setActiveChallenge(challenge);
    setCaption("");
    setImageFile(null);
    setImagePreview(null);
    setShowSubmissionModal(true);
  };

  const closeSubmissionModal = () => {
    setShowSubmissionModal(false);
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

  const handleSubmitEntry = (e) => {
    e.preventDefault();
    // Placeholder for now – you can hook this up to your submissions API later
    console.log("Submitting entry for challenge:", activeChallenge);
    console.log("Caption:", caption);
    console.log("Image file:", imageFile);
    setShowSubmissionModal(false);
  };

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
              Join curated travel challenges, share your experiences, and stand a
              chance to earn exciting awards for your journeys.
            </p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {challenges.map((challenge,index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                index={index}
                onSubmitClick={() => openSubmissionModal(challenge)}
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
              You can show the top travelers who participated in these challenges
              here later.
            </p>
            <div className="space-y-3 text-xs text-gray-600">
              <div className="h-9 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                Placeholder row
              </div>
              <div className="h-9 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                Placeholder row
              </div>
              <div className="h-9 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                Placeholder row
              </div>
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
                  className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
                >
                  Submit entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ChallengeCard({ challenge ,index, onSubmitClick }) {

  
  const deadlineLabel = challenge.submissionDeadline
    ? new Date(challenge.submissionDeadline).toLocaleDateString()
    : "No deadline";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 flex flex-col">
      {/* Top badge + award */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-50 text-teal-600">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wide text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
            Challenge {index+1}
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
              {(challenge.participants ?? 0) || 0} joined
            </span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 transition"
        onClick={onSubmitClick}
      >
        <Upload className="w-4 h-4" />
        Submit entry
      </button>
    </div>
  );
}

export default TravelChallenges;