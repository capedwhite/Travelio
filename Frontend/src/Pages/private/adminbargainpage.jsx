import {
  Check,
  X,
  PlusCircle,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Clock,
  User,
  Package,
  Star,
  IndianRupee,
  Calendar,
  MessageSquare,
  Eye,
  EyeOff,
  Receipt,
  Percent,
  Handshake,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/Adminnavbar";
import { PackageForm } from "./CreatePackage";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const BargainRequests = () => {
  const [bargainsData, setBargainsData] = useState([]);
  const [selectedBargain, setSelectedBargain] = useState(null);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [processingBargain, setProcessingBargain] = useState(null);
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch bargains
  const fetchBargains = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/packagebargain");
      setBargainsData(res.data.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBargains();
  }, []);

  const handleAcceptBargain = async (bargainId, bargain, packageData) => {
    setProcessingBargain(bargainId);
    try {
      await api.put(`/admin/bargain/${bargainId}/status`, {
        status: "accepted",
      });

      // Pre-fill form data based on the bargain details
      const preFilled = {
        basicInfo: {
          title: `${packageData.title} - Special Offer`,
          description: `Custom package created for ${bargain.user?.username}'s bargain request. Original price: $${packageData.price.discountedPrice}, Offered price: $${bargain.offerprice}`,
          tag: packageData.tags?.[0] || "Bargain Special",
          duration: packageData.duration,
        },
        pricing: {
          originalPrice: packageData.price.discountedPrice,
          discountedPrice: bargain.offerprice,
          currency: packageData.price.currency,
          label: `Bargain for ${bargain.user?.username}`,
          discountpercentage: Math.round(
            ((packageData.price.discountedPrice - bargain.offerprice) /
              packageData.price.discountedPrice) *
              100,
          ),
        },
        locations: packageData.locations || {
          country: "",
          city: "",
          pickup: "",
          notes: "",
        },
        touristSpots: packageData.touristSpots || [
          { spotname: "", location: "", description: "" },
        ],
        itinerary: packageData.itinerary || [{ title: "", description: "" }],
        hotels: packageData.hotels || [
          {
            name: "",
            location: "",
            rating: "",
            amenities: "",
            hotelImages: [],
          },
        ],
        availability: {
          startDate: packageData.availability?.startDate || "",
          endDate: packageData.availability?.endDate || "",
          maxBookings: packageData.availability?.maxBookings || "",
          inclusion: Array.isArray(packageData.inclusions)
            ? packageData.inclusions.join("\n")
            : "",
          exclusion: Array.isArray(packageData.exclusions)
            ? packageData.exclusions.join("\n")
            : "",
        },
        media: {
          coverImage: packageData.images?.coverImage || null,
          touristLocationImages: packageData.images?.tourist || [],
          existingCoverImage: packageData.images?.coverImage || null,
          existingTouristImages: packageData.images?.tourist || [],
        },
      };

      setSelectedBargain({ bargain, package: packageData, preFilled });
      setPackageModalOpen(true);

      fetchBargains(); // Refresh data
    } catch (error) {
      toast.error("Failed to accept bargain");
    } finally {
      setProcessingBargain(null);
    }
  };

  const handleDeclineBargain = async (bargainId) => {
    setProcessingBargain(bargainId);
    try {
      await api.put(`/admin/bargain/${bargainId}/status`, {
        status: "declined",
      });
      toast.success("Bargain declined");
      fetchBargains(); // Refresh data
    } catch (error) {
      toast.error("Failed to decline bargain");
    } finally {
      setProcessingBargain(null);
    }
  };

  const handlePackageSuccess = () => {
    setPackageModalOpen(false);
    fetchBargains();
    toast.success("Custom package created successfully!");
  };

  // Calculate stats
  const totalBargains = bargainsData.reduce(
    (sum, pkg) => sum + (pkg.bargains?.length || 0),
    0,
  );
  const pendingBargains = bargainsData.reduce(
    (sum, pkg) =>
      sum + (pkg.bargains?.filter((b) => b.status === "pending").length || 0),
    0,
  );
  const acceptedBargains = bargainsData.reduce(
    (sum, pkg) =>
      sum + (pkg.bargains?.filter((b) => b.status === "accepted").length || 0),
    0,
  );
  const totalSavings = bargainsData.reduce((sum, pkg) => {
    return (
      sum +
        pkg.bargains?.reduce((pkgSum, bargain) => {
          const originalPrice = pkg.price?.discountedPrice || 0;
          const offeredPrice = bargain.offerprice || 0;
          return pkgSum + Math.max(0, originalPrice - offeredPrice);
        }, 0) || 0
    );
  }, 0);

  // Loading state
  if (loading) {
    return (
      <AdminSidebar>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="text-center">
            <ClipLoader size={50} color="#64748b" />
            <p className="text-slate-600 mt-4 font-medium">
              Loading bargain requests...
            </p>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  // Empty state
  if (!bargainsData || bargainsData.length === 0) {
    return (
      <AdminSidebar>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-600 mb-2">
              No Bargain Requests
            </h3>
            <p className="text-slate-500">
              Bargain requests from customers will appear here
            </p>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <>
      <AdminSidebar>
        <div className="min-h-screen bg-slate-50 px-4">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-lg border border-slate-200 mb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    Bargain Management Center
                  </h1>
                  <p className="text-slate-600">
                    Manage customer bargain requests and create personalized
                    offers
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">
                      Total Bargains
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {totalBargains}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Active negotiations
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
                      Pending
                    </p>
                    <p className="text-3xl font-bold text-amber-700">
                      {pendingBargains}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Awaiting decisions
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-7 h-7 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">
                      Accepted
                    </p>
                    <p className="text-3xl font-bold text-emerald-700">
                      {acceptedBargains}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Ready for packaging
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Check className="w-7 h-7 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">
                      Potential Savings
                    </p>
                    <p className="text-3xl font-bold text-blue-700 flex items-center">
                      <DollarSign className="w-6 h-6" />
                      {totalSavings.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Customer benefits
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Packages List */}
            <div className="space-y-6">
              {bargainsData.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 "
                >
                  {/* Package Header */}
                  <div className="bg-slate-50 p-6 border-b border-slate-200 overflow-x-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#3ab19d] rounded-2xl flex items-center justify-center">
                          <Package className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-800">
                            {pkg.title}
                          </h2>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />$
                              {pkg.price.discountedPrice}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {pkg.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-800">
                          {pkg.bargains?.length || 0}
                        </div>
                        <div className="text-sm text-slate-600">
                          Bargain Offers
                        </div>
                        <div className="flex gap-2 mt-2">
                          <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-xs font-medium">
                            {pkg.bargains?.filter((b) => b.status === "Pending")
                              .length || 0}{" "}
                            Pending
                          </div>
                          <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-medium">
                            {pkg.bargains?.filter(
                              (b) => b.status === "accepted",
                            ).length || 0}{" "}
                            Accepted
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Bargains Button */}
                  <div className="p-6">
                    <button
                      onClick={() =>
                        setExpandedPackage(
                          expandedPackage === pkg.id ? null : pkg.id,
                        )
                      }
                      className="w-full bg-[#3ab19d] text-white py-3 px-6 rounded-2xl font-semibold hover:bg-[#2d9b8a] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {expandedPackage === pkg.id ? (
                        <>
                          <EyeOff className="w-5 h-5" />
                          Hide Bargain Offers
                        </>
                      ) : (
                        <>
                          <Eye className="w-5 h-5" />
                          View Bargain Offers ({pkg.bargains?.length || 0})
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bargains List */}
                  {expandedPackage === pkg.id && (
                    <div className="px-6 pb-6">
                      {pkg.bargains && pkg.bargains.length > 0 ? (
                        <div className="space-y-4">
                          {pkg.bargains.map((bargainItem) => {
                            const originalPrice =
                              pkg.price?.discountedPrice || 0;
                            const offeredPrice = bargainItem.offerprice || 0;
                            const savings = Math.max(
                              0,
                              originalPrice - offeredPrice,
                            );
                            const discountPercent =
                              originalPrice > 0
                                ? Math.round((savings / originalPrice) * 100)
                                : 0;

                            return (
                              <div
                                key={bargainItem.bargainId}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                              >
                                <div className="grid md:grid-cols-2 gap-0">
                                  {/* Customer Information */}
                                  <div className="p-6 border-r border-slate-200">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-[#3ab19d] rounded-xl flex items-center justify-center overflow-hidden">
                                        {bargainItem.user?.profileImage ? (
                                          <img
                                            src={`http://localhost:3000/${bargainItem.user?.profileImage}`}
                                            alt={bargainItem.user?.username}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <User className="w-5 h-5 text-white" />
                                        )}
                                      </div>
                                      <h3 className="text-lg font-bold text-slate-800">
                                        Customer Details
                                      </h3>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-slate-500" />
                                        <span className="font-semibold text-slate-800">
                                          {bargainItem.user?.username ||
                                            "Unknown User"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-slate-600">
                                          {bargainItem.user?.email ||
                                            "No email provided"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                        <span className="text-slate-600">
                                          Offered:{" "}
                                          {new Date(
                                            bargainItem.offerdate,
                                          ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mt-4">
                                      <span className="text-sm font-semibold text-slate-700">
                                        Status:
                                      </span>
                                      <div
                                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ml-2 ${
                                          bargainItem.status === "Pending"
                                            ? "bg-amber-100 text-amber-700"
                                            : bargainItem.status === "accepted"
                                              ? "bg-emerald-100 text-emerald-700"
                                              : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {bargainItem.status === "Pending" && (
                                          <Clock className="w-4 h-4" />
                                        )}
                                        {bargainItem.status === "accepted" && (
                                          <Check className="w-4 h-4" />
                                        )}
                                        {bargainItem.status === "declined" && (
                                          <X className="w-4 h-4" />
                                        )}
                                        {bargainItem.status?.toUpperCase() ||
                                          "PENDING"}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Price & Actions */}
                                  <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-white" />
                                      </div>
                                      <h3 className="text-lg font-bold text-slate-800">
                                        Price Breakdown
                                      </h3>
                                    </div>

                                    {/* Price Details */}
                                    <div className="bg-white rounded-xl p-4 mb-4 border border-slate-200">
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-slate-600">
                                            Original Price:
                                          </span>
                                          <span className="text-sm text-slate-800">
                                            ${originalPrice.toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-emerald-600">
                                            Offered Price:
                                          </span>
                                          <span className="text-sm font-semibold text-emerald-600">
                                            ${offeredPrice.toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="border-t border-slate-200 pt-2">
                                          <div className="flex justify-between items-center">
                                            <span className="font-semibold text-slate-800">
                                              Customer Savings:
                                            </span>
                                            <span className="font-bold text-blue-600">
                                              ${savings.toLocaleString()} (
                                              {discountPercent}%)
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2">
                                      {processingBargain ===
                                      bargainItem.bargainId ? (
                                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-2 rounded-lg">
                                          <ClipLoader
                                            size={16}
                                            color="#64748b"
                                          />
                                          <span>Processing...</span>
                                        </div>
                                      ) : bargainItem.status === "Pending" ? (
                                        <>
                                          <button
                                            onClick={() =>
                                              handleAcceptBargain(
                                                bargainItem.bargainId,
                                                bargainItem,
                                                pkg,
                                              )
                                            }
                                            className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium flex items-center gap-2"
                                          >
                                            <Check size={16} />
                                            Accept & Create Package
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeclineBargain(
                                                bargainItem.bargainId,
                                              )
                                            }
                                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-200 font-medium flex items-center gap-2"
                                          >
                                            <X size={16} />
                                            Decline
                                          </button>
                                        </>
                                      ) : bargainItem.status === "accepted" ? (
                                        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                                          <Check className="w-4 h-4" />
                                          <span>
                                            Bargain Accepted - Package Created
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                                          <X className="w-4 h-4" />
                                          <span>Bargain Declined</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Customer Notes */}
                                {bargainItem.notes && (
                                  <div className="bg-slate-50 p-6 border-t border-slate-200">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-white" />
                                      </div>
                                      <h3 className="text-lg font-bold text-slate-800">
                                        Customer Notes
                                      </h3>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                                      <p className="text-slate-700 italic">
                                        "{bargainItem.notes}"
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-slate-50 rounded-2xl">
                          <Target className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-600">
                            No bargain requests for this package yet
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminSidebar>

      {packageModalOpen && selectedBargain && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setPackageModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[95vh] overflow-hidden flex"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-1/3 bg-slate-50 p-6 overflow-y-auto border-r border-slate-200">
              <div className="sticky top-0 bg-white rounded-2xl p-6 mb-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#3ab19d] rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        {selectedBargain.bargain.user?.name ||
                          selectedBargain.bargain.user?.username}
                      </h2>
                      <p className="text-sm text-slate-600">Bargain Request</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPackageModalOpen(false)}
                    className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-[#3ab19d] text-white p-4 rounded-2xl mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="w-6 h-6" />
                    <span className="text-lg font-bold">
                      {selectedBargain.package.title}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">Custom Package Deal</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#3ab19d]" />
                  Bargain Summary
                </h3>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-5 h-5 text-[#3ab19d]" />
                    <span className="font-semibold text-slate-800">
                      Price Comparison
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Original Price:</span>
                      <span className="font-semibold text-slate-800">
                        ${selectedBargain.package.price?.discountedPrice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Customer Offer:</span>
                      <span className="font-semibold text-emerald-700">
                        ${selectedBargain.bargain.offerprice}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="text-slate-600">Savings:</span>
                      <span className="font-bold text-blue-700">
                        $
                        {(selectedBargain.package.price?.discountedPrice || 0) -
                          selectedBargain.bargain.offerprice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-slate-800">
                      Offer Details
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Offered Date:</span>
                      <span className="text-slate-800">
                        {new Date(
                          selectedBargain.bargain.offerdate,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className="text-emerald-700 font-semibold">
                        Accepted
                      </span>
                    </div>
                  </div>
                </div>

                {selectedBargain.bargain.notes && (
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-slate-800">
                        Customer Notes
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed italic">
                      "{selectedBargain.bargain.notes}"
                    </p>
                  </div>
                )}

                <div className="bg-slate-100 rounded-2xl p-4 mt-6 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Package Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                      <div className="font-bold text-slate-800">
                        {selectedBargain.package.duration}
                      </div>
                      <div className="text-slate-600 text-xs">Duration</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                      <div className="font-bold text-emerald-700">
                        ${selectedBargain.bargain.offerprice}
                      </div>
                      <div className="text-slate-600 text-xs">Final Price</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-2/3 bg-slate-50 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-[#3ab19d]" />
                  <h2 className="text-xl font-bold text-slate-800">
                    Create Custom Package
                  </h2>
                  <span className="text-sm text-slate-600">
                    Special offer for {selectedBargain.bargain.user?.username}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {selectedBargain.preFilled && (
                  <PackageForm
                    mode="create"
                    preFilledData={selectedBargain.preFilled}
                    visibility="private"
                    specificUserId={selectedBargain.bargain.userId}
                    bargainid={selectedBargain.bargain.bargainId}
                    onSuccess={handlePackageSuccess}
                    refetch={() => {}}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BargainRequests;
