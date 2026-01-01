import { Trophy, Users, Upload } from "lucide-react";
const challenges = [
  {
    id: 1,
    title: "Best Sunset Photo",
    description:
      "Capture the most stunning sunset from your travels. Show us those golden hour magic moments!",
    reward: "Winner gets $500 Travel Voucher",
    participants: 342,
    endDate: "Dec 31, 2025",
    badge: "voucher",
  },
  {
    id: 2,
    title: "Most Adventurous Activity",
    description:
      "Share your most thrilling adventure experience. Skydiving? Bungee jumping? Scuba diving?",
    reward: "Winner gets GoPro Hero 12",
    participants: 218,
    endDate: "Jan 15, 2026",
    badge: "gopro",
  },
  {
    id: 3,
    title: "Hidden Gem Discovery",
    description:
      "Found a secret spot that tourists rarely visit? Share your hidden gem with the community!",
    reward: "Community Spotlight",
    participants: 189,
    endDate: "Jan 20, 2026",
    badge: "spotlight",
  },
];



export default function TravelChallenges() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* HEADER */}
      <div className="mb-8 mt-[5%] pb-10">
        <h1 className="text-3xl font-bold">Travel Challenges</h1>
        <p className="text-gray-600 mt-1">
          Join challenges, compete with fellow travelers, and win amazing prizes
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>

    </div>
  );
}
 function ChallengeCard({ challenge }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
      
      {/* TOP */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="text-orange-500 w-6 h-6" />
          <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
            {challenge.reward}
          </span>
        </div>

        <h2 className="text-lg font-semibold">{challenge.title}</h2>
        <p className="text-gray-600 text-sm mt-2">
          {challenge.description}
        </p>
      </div>

      {/* INFO */}
      <div className="mt-6 space-y-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{challenge.participants} participants</span>
        </div>

        <p>
          Ends: <span className="font-medium">{challenge.endDate}</span>
        </p>
      </div>

      {/* ACTION */}
      <button
        className="mt-6 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium"
      >
        <Upload className="w-4 h-4" />
        Submit Entry
      </button>

    </div>
  );
}
