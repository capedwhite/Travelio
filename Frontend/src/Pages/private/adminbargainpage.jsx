import { Check, X, PlusCircle, TrendingUp, Users, DollarSign, Target, Clock, User, Package, Star, IndianRupee, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/Adminnavbar";
import { PackageForm } from "./CreatePackage";
import toast from "react-hot-toast";

const BargainRequests = () => {
  const [bargainsData, setBargainsData] = useState([]);
  const [selectedBargain, setSelectedBargain] = useState(null);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [processingBargain, setProcessingBargain] = useState(null);

  // Fetch bargains
  const fetchBargains = async () => {
    try {
      const res = await api.get("/admin/packagebargain");
      setBargainsData(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchBargains();
  }, []);


  const handleAcceptBargain = async (bargainId, bargain, packageData) => {
    setProcessingBargain(bargainId);
    try {
      await api.put(`/admin/bargain/${bargainId}/status`, { status: 'accepted' });

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
          discountpercentage: Math.round(((packageData.price.discountedPrice - bargain.offerprice) / packageData.price.discountedPrice) * 100),
        },
        locations: packageData.locations || { country: "", city: "", pickup: "", notes: "" },
        touristSpots: packageData.touristSpots || [{ spotname: "", location: "", description: "" }],
        itinerary: packageData.itinerary || [{ title: "", description: "" }],
        hotels: packageData.hotels || [{ name: "", location: "", rating: "", amenities: "", hotelImages: [] }],
        availability: {
          startDate: packageData.availability?.startDate || "",
          endDate: packageData.availability?.endDate || "",
          maxBookings: packageData.availability?.maxBookings || "",
          inclusion: Array.isArray(packageData.inclusions) ? packageData.inclusions.join("\n") : "",
          exclusion: Array.isArray(packageData.exclusions) ? packageData.exclusions.join("\n") : "",
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
      await api.put(`/admin/bargain/${bargainId}/status`, { status: 'declined' });
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
  const totalBargains = bargainsData.reduce((sum, pkg) => sum + (pkg.bargains?.length || 0), 0);
  const pendingBargains = bargainsData.reduce((sum, pkg) =>
    sum + (pkg.bargains?.filter(b => b.status === "pending").length || 0), 0
  );
  const acceptedBargains = bargainsData.reduce((sum, pkg) =>
    sum + (pkg.bargains?.filter(b => b.status === "accepted").length || 0), 0
  );
  const totalSavings = bargainsData.reduce((sum, pkg) => {
    return sum + pkg.bargains?.reduce((pkgSum, bargain) => {
      const originalPrice = pkg.price?.discountedPrice || 0;
      const offeredPrice = bargain.offerprice || 0;
      return pkgSum + Math.max(0, originalPrice - offeredPrice);
    }, 0) || 0;
  }, 0);


  return (
    <>
      <AdminSidebar />
      <div className="ml-64 min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-100 via-cyan-100 to-emerald-100 px-6 py-3 rounded-full mb-4">
              <DollarSign className="w-6 h-6 text-teal-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Bargain Management Center
              </span>
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-gray-600 text-lg">Manage customer bargain requests and create personalized offers</p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-teal-100/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bargains</p>
                  <p className="text-3xl font-bold text-teal-600 group-hover:scale-110 transition-transform">{totalBargains}</p>
                  <p className="text-xs text-gray-500 mt-1">Active negotiations</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-teal-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-cyan-100/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-cyan-600 group-hover:scale-110 transition-transform">{pendingBargains}</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting decisions</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-cyan-100 to-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-cyan-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-emerald-100/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Accepted</p>
                  <p className="text-3xl font-bold text-emerald-600 group-hover:scale-110 transition-transform">{acceptedBargains}</p>
                  <p className="text-xs text-gray-500 mt-1">Ready for packaging</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Check className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-teal-100/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Potential Savings</p>
                  <p className="text-3xl font-bold text-teal-600 group-hover:scale-110 transition-transform">${totalSavings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Customer benefits</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-teal-600" />
                </div>
              </div>
            </div>
          </div>


          <div className="space-y-6">
            {bargainsData.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-teal-100/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >

                <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Package className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-1">{pkg.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-white/80">
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            ${pkg.price.discountedPrice}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {pkg.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {pkg.bargains?.length || 0} offers
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bargains */}
                <div className="p-6">
                  {pkg.bargains && pkg.bargains.length > 0 ? (
                    <div className="grid gap-4">
                      {pkg.bargains.map((bargainItem) => {
                        const originalPrice = pkg.price?.discountedPrice || 0;
                        const offeredPrice = bargainItem.offerprice || 0;
                        const savings = Math.max(0, originalPrice - offeredPrice);
                        const discountPercent = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

                        return (
                          <div
                            key={bargainItem.bargainId}
                            className="bg-gradient-to-r from-white to-teal-50/30 rounded-2xl border border-teal-100/50 p-6 hover:shadow-lg transition-all duration-300"
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                                  {bargainItem.user?.profileImage ? (
                                    <img
                                      src={`http://localhost:3000/${bargainItem.user?.profileImage}`}
                                      alt={bargainItem.user?.username}
                                      className="w-full h-full object-cover rounded-full"
                                    />
                                  ) : (
                                    <User className="w-6 h-6 text-white" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{bargainItem.user?.username || "Unknown User"}</h3>
                                  <p className="text-sm text-gray-600">{bargainItem.user?.email || "-"}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                                  bargainItem.status === "pending"
                                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                                    : bargainItem.status === "accepted"
                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                    : "bg-red-100 text-red-700 border border-red-200"
                                }`}>
                                  {bargainItem.status === "pending" && <Clock className="w-4 h-4" />}
                                  {bargainItem.status === "accepted" && <Check className="w-4 h-4" />}
                                  {bargainItem.status === "declined" && <X className="w-4 h-4" />}
                                  {bargainItem.status?.toUpperCase() || "PENDING"}
                                </div>
                              </div>
                            </div>

                            {/* Offer Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="bg-teal-50 rounded-xl p-4 text-center">
                                <div className="text-sm text-gray-600 mb-1">Original Price</div>
                                <div className="text-lg font-bold text-teal-700">${originalPrice}</div>
                              </div>
                              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                <div className="text-sm text-gray-600 mb-1">Offered Price</div>
                                <div className="text-lg font-bold text-emerald-700">${offeredPrice}</div>
                              </div>
                              <div className="bg-amber-50 rounded-xl p-4 text-center">
                                <div className="text-sm text-gray-600 mb-1">Savings</div>
                                <div className="text-lg font-bold text-amber-700">${savings} ({discountPercent}%)</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Offered: {new Date(bargainItem.offerdate).toLocaleDateString()}
                              </span>
                            </div>

                            {bargainItem.notes && (
                              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Star className="w-4 h-4 text-amber-600" />
                                  <span className="text-sm font-semibold text-gray-900">Customer Notes</span>
                                </div>
                                <p className="text-gray-700 italic">"{bargainItem.notes}"</p>
                              </div>
                            )}

                 
                            <div className="flex justify-end gap-3">
                              {bargainItem.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleDeclineBargain(bargainItem.bargainId)}
                                    disabled={processingBargain === bargainItem.bargainId}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <X size={16} />
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => handleAcceptBargain(bargainItem.bargainId, bargainItem, pkg)}
                                    disabled={processingBargain === bargainItem.bargainId}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Check size={16} />
                                    Accept & Create Package
                                  </button>
                                </>
                              )}

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No bargain requests for this package yet</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {bargainsData.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-24 h-24 text-teal-200 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Bargain Requests</h3>
              <p className="text-gray-500">Bargain requests from customers will appear here!</p>
            </div>
          )}
        </div>
      </div>

      {packageModalOpen && selectedBargain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setPackageModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[95vh] overflow-hidden flex" onClick={e => e.stopPropagation()}>

            <div className="w-1/3 bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 p-6 overflow-y-auto">
              <div className="sticky top-0 bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedBargain.bargain.user?.name || selectedBargain.bargain.user?.username}</h2>
                      <p className="text-sm text-gray-600">Bargain Request</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPackageModalOpen(false)}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-4 rounded-2xl mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="w-6 h-6" />
                    <span className="text-lg font-bold">{selectedBargain.package.title}</span>
                  </div>
                  <p className="text-sm opacity-90">Custom Package Deal</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-teal-600" />
                  Bargain Summary
                </h3>

                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <IndianRupee className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold text-gray-900">Price Comparison</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Price:</span>
                      <span className="font-semibold text-gray-900">${selectedBargain.package.price?.discountedPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer Offer:</span>
                      <span className="font-semibold text-emerald-700">${selectedBargain.bargain.offerprice}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Savings:</span>
                      <span className="font-bold text-teal-700">
                        ${(selectedBargain.package.price?.discountedPrice || 0) - selectedBargain.bargain.offerprice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold text-gray-900">Offer Details</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Offered Date:</span>
                      <span className="text-gray-900">{new Date(selectedBargain.bargain.offerdate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-emerald-700 font-semibold">Accepted</span>
                    </div>
                  </div>
                </div>

                {selectedBargain.bargain.notes && (
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <Star className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">Customer Notes</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{selectedBargain.bargain.notes}</p>
                  </div>
                )}


                <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl p-4 mt-6">
                  <h4 className="font-semibold text-teal-800 mb-3">Package Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white/50 rounded-lg p-2 text-center">
                      <div className="font-bold text-teal-700">{selectedBargain.package.duration}</div>
                      <div className="text-teal-600">Duration</div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2 text-center">
                      <div className="font-bold text-teal-700">${selectedBargain.bargain.offerprice}</div>
                      <div className="text-teal-600">Final Price</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="w-2/3 bg-gray-50 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-teal-600" />
                  <h2 className="text-xl font-bold text-gray-900">Create Custom Package</h2>
                  <span className="text-sm text-gray-600">Special offer for {selectedBargain.bargain.user?.username}</span>
                </div>
              </div>

              <div className="p-6">
                {selectedBargain.preFilled && (
                  <PackageForm
                    mode="create"
                    preFilledData={selectedBargain.preFilled}
                    visibility="private"
                    specificUserId={selectedBargain.bargain.userId}
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
