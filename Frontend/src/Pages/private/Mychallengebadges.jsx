import { useState, useEffect } from "react";
import {
  Trophy,
  Award,
  Star,
  Calendar,
  Gift,
  CheckCircle,
  Clock,
  Sparkles,
  Medal,
  Crown,
  Percent,
  Ticket,
  TrendingUp,
  Target,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function MyChallengeAwards() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAwards: 0,
    usedAwards: 0,
    availableAwards: 0,
    discountAwards: 0,
    couponAwards: 0,
  });

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/awards");
      const awardsData = res.data.data || [];
      setAwards(awardsData);

      // Calculate stats
      const used = awardsData.filter((a) => a.isUsed).length;
      const discounts = awardsData.filter((a) =>
        a.awardWon.includes("discount"),
      ).length;
      const coupons = awardsData.filter((a) =>
        a.awardWon.includes("coupon"),
      ).length;

      setStats({
        totalAwards: awardsData.length,
        usedAwards: used,
        availableAwards: awardsData.length - used,
        discountAwards: discounts,
        couponAwards: coupons,
      });
    } catch (error) {
      console.log("Error fetching awards:", error);
      toast.error("Failed to load awards");
    } finally {
      setLoading(false);
    }
  };

  const getAwardIcon = (awardType) => {
    if (awardType.includes("100%")) return <Crown className="w-6 h-6" />;
    if (awardType.includes("50%")) return <Medal className="w-6 h-6" />;
    if (awardType.includes("discount")) return <Percent className="w-6 h-6" />;
    if (awardType.includes("coupon")) return <Ticket className="w-6 h-6" />;
    return <Gift className="w-6 h-6" />;
  };

  const getAwardColor = (awardType) => {
    if (awardType.includes("100%"))
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        icon: "text-amber-500",
      };
    if (awardType.includes("50%"))
      return {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        icon: "text-purple-500",
      };
    if (awardType.includes("30%"))
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        icon: "text-blue-500",
      };
    if (awardType.includes("10%"))
      return {
        bg: "bg-teal-50",
        border: "border-teal-200",
        text: "text-teal-700",
        icon: "text-teal-500",
      };
    if (awardType.includes("5 coupon"))
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        icon: "text-emerald-500",
      };
    if (awardType.includes("1 coupon"))
      return {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-700",
        icon: "text-slate-500",
      };
    return {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      icon: "text-gray-500",
    };
  };

  const getAwardBadge = (awardType) => {
    if (awardType.includes("100%")) return "Legendary";
    if (awardType.includes("50%")) return "Epic";
    if (awardType.includes("30%")) return "Rare";
    if (awardType.includes("10%")) return "Common";
    if (awardType.includes("5 coupon")) return "Premium";
    return "Standard";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <ClipLoader size={40} color="#3ab19d" />
          <p className="text-slate-600 mt-4 font-medium">
            Loading your awards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-lg border border-slate-200 mb-4">
            <div className="w-12 h-12 bg-[#3ab19d] rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-slate-800">
                My Challenge Awards
              </h1>
              <p className="text-slate-500 text-sm">
                Your achievements and rewards
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-[#3ab19d]/10 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#3ab19d]" />
              </div>
              <span className="text-xs font-medium text-slate-400 uppercase">
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {stats.totalAwards}
            </p>
            <p className="text-xs text-slate-500 mt-1">Awards Won</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-400 uppercase">
                Active
              </span>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {stats.availableAwards}
            </p>
            <p className="text-xs text-slate-500 mt-1">Available to Use</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-slate-600" />
              </div>
              <span className="text-xs font-medium text-slate-400 uppercase">
                Used
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-600">
              {stats.usedAwards}
            </p>
            <p className="text-xs text-slate-500 mt-1">Redeemed</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Percent className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-slate-400 uppercase">
                Discounts
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {stats.discountAwards}
            </p>
            <p className="text-xs text-slate-500 mt-1">Discount Awards</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Ticket className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-slate-400 uppercase">
                Coupons
              </span>
            </div>
            <p className="text-3xl font-bold text-amber-600">
              {stats.couponAwards}
            </p>
            <p className="text-xs text-slate-500 mt-1">Coupon Awards</p>
          </div>
        </div>

        {/* Awards List */}
        {awards.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No Awards Yet
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Participate in challenges and win to earn amazing rewards! Your
              victories will be showcased here.
            </p>
            <a
              href="/getchallenges"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#3ab19d] hover:bg-[#329b89] text-white font-medium rounded-xl transition"
            >
              <Target className="w-5 h-5" />
              Explore Challenges
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#3ab19d]" />
                Your Awards Collection
              </h2>
              <span className="text-sm text-slate-500">
                {awards.length} award{awards.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-4">
              {awards.map((award) => {
                const colors = getAwardColor(award.awardWon);
                const badge = getAwardBadge(award.awardWon);

                return (
                  <div
                    key={award.id}
                    className={`bg-white rounded-2xl shadow-lg border ${award.isUsed ? "border-slate-200 opacity-75" : "border-slate-200"} overflow-hidden hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Award Icon Section */}
                      <div
                        className={`${colors.bg} p-6 md:p-8 flex items-center justify-center md:w-48`}
                      >
                        {award.submission?.images &&
                        award.submission.images.length > 0 ? (
                          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                            <img
                              src={`http://localhost:3000/${award.submission.images[0]}`}
                              alt="Your submission"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={`w-20 h-20 ${colors.border} border-2 rounded-2xl flex items-center justify-center bg-white shadow-sm`}
                          >
                            <div className={colors.icon}>
                              {getAwardIcon(award.awardWon)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Award Details */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border} border`}
                              >
                                {badge}
                              </span>
                              {award.isUsed ? (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                  Used
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                  Available
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">
                              {award.awardWon}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(award.awardedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Challenge Info */}
                        <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-[#3ab19d]" />
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              Won From Challenge
                            </span>
                          </div>
                          <p className="font-semibold text-slate-800">
                            {award.challengeTitle ||
                              award.challenge?.challengeName ||
                              "Challenge"}
                          </p>
                        </div>

                        {/* Award Description */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Gift className="w-4 h-4 text-[#3ab19d]" />
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              Reward Details
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {award.awardDescription}
                          </p>
                        </div>

                        {/* Usage Info */}
                        {award.isUsed && award.usedAt && (
                          <div className="flex items-center gap-2 text-sm text-slate-500 pt-3 border-t border-slate-100">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>
                              Used on{" "}
                              {new Date(award.usedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        )}

                        {!award.isUsed && (
                          <div className="flex items-center gap-2 text-sm text-emerald-600 pt-3 border-t border-slate-100">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-medium">
                              Ready to use on your next booking!
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Achievement Summary */}
        {awards.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#3ab19d]/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#3ab19d]" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Achievement Summary
                </h3>
                <p className="text-sm text-slate-500">
                  Your challenge journey so far
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="flex justify-center mb-2">
                  <Crown className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {
                    awards.filter(
                      (a) =>
                        a.awardWon.includes("100%") ||
                        a.awardWon.includes("50%"),
                    ).length
                  }
                </p>
                <p className="text-xs text-slate-500">Epic+ Rewards</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="flex justify-center mb-2">
                  <Star className="w-6 h-6 text-[#3ab19d]" />
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {stats.totalAwards}
                </p>
                <p className="text-xs text-slate-500">Challenges Won</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="flex justify-center mb-2">
                  <Percent className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {awards.reduce((total, a) => {
                    const match = a.awardWon.match(/(\d+)%/);
                    return match ? total + parseInt(match[1]) : total;
                  }, 0)}
                  %
                </p>
                <p className="text-xs text-slate-500">Total Savings</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="flex justify-center mb-2">
                  <Ticket className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {awards.reduce((total, a) => {
                    const match = a.awardWon.match(/(\d+) coupon/);
                    return match ? total + parseInt(match[1]) : total;
                  }, 0)}
                </p>
                <p className="text-xs text-slate-500">Total Coupons</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyChallengeAwards;
