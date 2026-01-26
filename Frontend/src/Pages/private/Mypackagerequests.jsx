import { useEffect, useState } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Star,
  ArrowRight,
  Sparkles,
  Heart,
  Target,
  Award,
  TrendingUp
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function Mypackagerequests() {
  const [packageRequests, setPackageRequests] = useState([]);
  const [bargainPackages, setBargainPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsRes, bargainsRes] = await Promise.all([
        api.get("/user/mypackagerequests"),
        api.get("/user/mybargainpackages")
      ]);

      setPackageRequests(requestsRes.data.data || []);
      console.log(requestsRes.data.data)
      setBargainPackages(bargainsRes.data.data || []);
      console.log(bargainsRes.data.data )
    } catch (error) {
      toast.error("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "processed":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "border-amber-200 bg-amber-50";
      case "processed":
        return "border-emerald-200 bg-emerald-50";
      case "cancelled":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 flex items-center justify-center">
        <ClipLoader size={50} color="#3ab19d" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-teal-100 px-6 py-3 rounded-full mb-4">
            <Package className="w-6 h-6 text-teal-600" />
            <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              My Package Requests
            </span>
            <Sparkles className="w-6 h-6 text-cyan-600" />
          </div>
          <p className="text-gray-600 text-lg">Track your custom package requests and special offers</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-teal-100">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "requests"
                    ? "bg-teal-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Package Requests ({packageRequests.length})
              </button>
              <button
                onClick={() => setActiveTab("bargains")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "bargains"
                    ? "bg-teal-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Bargain Packages ({bargainPackages.length})
              </button>
            </div>
          </div>
        </div>

        {/* Package Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Custom Package Requests</h2>
              <div className="text-sm text-gray-600">
                {packageRequests.filter(r => r.status === "processed").length} of {packageRequests.length} processed
              </div>
            </div>

            {packageRequests.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-600 mb-3">No Requests Yet</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't made any custom package requests yet. Start exploring our packages to create your perfect travel experience.</p>
                <button
                  onClick={() => navigate("/explorepackages")}
                  className="bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition shadow-lg"
                >
                  Explore Packages
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {packageRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                  >
                    {/* Request Header */}
                    <div className="bg-gray-50 border-b border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                            {getStatusIcon(request.status)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{request.destination}</h3>
                            <p className="text-gray-600">Request #{request.id} • Submitted {formatDate(request.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${
                            request.status === "processed"
                              ? "bg-emerald-100 text-emerald-700"
                              : request.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {request.status === "processed" && <Award className="w-4 h-4" />}
                            {request.status === "pending" && <Clock className="w-4 h-4" />}
                            {request.status === "cancelled" && <XCircle className="w-4 h-4" />}
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <Calendar className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Travel Date</div>
                          <div className="font-semibold text-gray-900">{formatDate(request.travelDate)}</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <Clock className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Duration</div>
                          <div className="font-semibold text-gray-900">{request.duration}</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Travelers</div>
                          <div className="font-semibold text-gray-900">{request.travelers}</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <IndianRupee className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Budget</div>
                          <div className="font-semibold text-gray-900">{request.budget}</div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {request.specialRequests && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900">Special Requests</span>
                          </div>
                          <p className="text-gray-700">{request.specialRequests}</p>
                        </div>
                      )}

                      {/* Status Message */}
                      <div className="flex justify-end">
                        {request.status === "processed" ? (
                          <div className="text-center bg-emerald-50 rounded-xl p-4">
                            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold mb-2">
                              <CheckCircle className="w-4 h-4" />
                              Package Created!
                            </div>
                            <p className="text-sm text-emerald-700">Our team has created a custom package tailored to your requirements.</p>
                          </div>
                        ) : request.status === "pending" ? (
                          <div className="text-center bg-amber-50 rounded-xl p-4">
                            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-semibold mb-2">
                              <Clock className="w-4 h-4" />
                              Under Review
                            </div>
                            <p className="text-sm text-amber-700">We're carefully reviewing your request to create the perfect package for you.</p>
                          </div>
                        ) : (
                          <div className="text-center bg-red-50 rounded-xl p-4">
                            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold mb-2">
                              <XCircle className="w-4 h-4" />
                              Request Cancelled
                            </div>
                            <p className="text-sm text-red-700">This request has been cancelled. Please contact us if you need assistance.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {activeTab === "bargains" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Bargain Requests</h2>
              <div className="text-sm text-gray-600">
                Track your offer status and special packages
              </div>
            </div>

            {bargainPackages.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">No Bargain Requests</h3>
                <p className="text-gray-500 mb-6">You haven't made any bargain offers yet.</p>
                <button
                  onClick={() => navigate("/explorepackages")}
                  className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition"
                >
                  Explore Packages
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {bargainPackages.map((bargain) => (
                  <div
                    key={bargain.bargainId}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                  >
                    {/* Bargain Header */}
                    <div className="bg-gray-50 border-b border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                            <Target className="w-6 h-6 text-teal-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">Bargain Request #{bargain.bargainId}</h3>
                            <p className="text-gray-600">Submitted {formatDate(bargain.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${
                            bargain.status === "accepted"
                              ? "bg-emerald-100 text-emerald-700"
                              : bargain.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {bargain.status === "accepted" && <CheckCircle className="w-4 h-4" />}
                            {bargain.status === "pending" && <Clock className="w-4 h-4" />}
                            {bargain.status === "declined" && <XCircle className="w-4 h-4" />}
                            {bargain.status.charAt(0).toUpperCase() + bargain.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bargain Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <IndianRupee className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Your Offer</div>
                          <div className="text-xl font-bold text-gray-900">${bargain.offerprice}</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <Calendar className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Offer Date</div>
                          <div className="font-semibold text-gray-900">{(bargain.offerdate)}</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <Star className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Status</div>
                          <div className={`font-semibold ${
                            bargain.status === "accepted" ? "text-emerald-600" :
                            bargain.status === "pending" ? "text-amber-600" : "text-red-600"
                          }`}>
                            {bargain.status.charAt(0).toUpperCase() + bargain.status.slice(1)}
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {bargain.notes && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900">Your Notes</span>
                          </div>
                          <p className="text-gray-700">{bargain.notes}</p>
                        </div>
                      )}

                      {/* Package Details (if bargain was accepted) */}
                      {bargain.Package && bargain.status === "accepted" && (
                        <div className="border-t border-gray-200 pt-6">
                          <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Award className="w-5 h-5 text-emerald-600" />
                              <span className="font-bold text-emerald-800">🎉 Your Bargain Was Accepted!</span>
                            </div>
                            <p className="text-emerald-700 text-sm">
                              Congratulations! A custom package has been created based on your offer.
                            </p>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-bold text-gray-900">{bargain.Package.title}</h4>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-teal-600">${bargain.Package.price?.discountedPrice}</div>
                                <div className="text-xs text-gray-600">Your Special Price</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-teal-600" />
                                <div>
                                  <div className="text-sm text-gray-600">Destination</div>
                                  <div className="font-semibold text-gray-900">
                                    {bargain.Package.locations?.city || bargain.Package.locations?.country}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Clock className="w-6 h-6 text-cyan-600" />
                                <div>
                                  <div className="text-sm text-gray-600">Duration</div>
                                  <div className="font-semibold text-gray-900">{bargain.Package.duration}</div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <button
                                onClick={() => navigate(`/package/${bargain.Package.id}`)}
                                className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition flex items-center gap-2"
                              >
                                View Your Package
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* No Package Message */}
                      {!bargain.Package && (
                        <div className="border-t border-gray-200 pt-6">
                          <div className="text-center py-8">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-600 mb-2">No Package Generated Yet</h4>
                            <p className="text-gray-500 text-sm max-w-md mx-auto">
                              {bargain.status === "accepted"
                                ? "Your offer was accepted! We're working on creating your custom package."
                                : bargain.status === "pending"
                                ? "Your offer is under review. A package will be created once accepted."
                                : "Your offer was not accepted, so no package was generated."}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Status Message */}
                      {bargain.status === "pending" && (
                        <div className="bg-amber-50 rounded-xl p-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-600" />
                            <span className="font-semibold text-amber-800">Under Review</span>
                          </div>
                          <p className="text-amber-700 text-sm mt-1">
                            We're reviewing your offer. You'll be notified once a decision is made.
                          </p>
                        </div>
                      )}

                      {bargain.status === "declined" && (
                        <div className="bg-red-50 rounded-xl p-4">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="font-semibold text-red-800">Offer Declined</span>
                          </div>
                          <p className="text-red-700 text-sm mt-1">
                            Unfortunately, your offer couldn't be accepted at this time.
                          </p>
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
    </div>
  );
}



export default Mypackagerequests;
