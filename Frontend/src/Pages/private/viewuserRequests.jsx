import { useEffect, useState } from "react";
import AdminSidebar from "../../components/Adminnavbar";
import {
  MapPin,
  Clock,
  Users,
  IndianRupee,
  Calendar,
  User,
  Sparkles,
  TrendingUp,
  Heart,
  Star,
  Eye,
  Globe,
  Plane,
  Target,
  Award,
  Crown
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function ViewUserRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/packagerequests");
      setRequests(res.data.data);
    } catch (error) {
      toast.error("Failed to load package requests");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  // Calculate stats
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === "pending").length;
  const uniqueDestinations = [...new Set(requests.map(r => r.destination))].length;
  const totalTravelers = requests.reduce((sum, r) => sum + r.travelers, 0);

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <div className="ml-64 min-h-screen flex items-center justify-center">
          <ClipLoader size={50} color="#3ab19d" />
        </div>
      </>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <>
        <AdminSidebar />
        <div className="ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Plane className="w-24 h-24 text-teal-200 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Requests Yet</h3>
            <p className="text-gray-500">Package requests from users will appear here!</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />
      <div className="ml-64 min-h-screen ">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-100 via-cyan-100 to-emerald-100 px-6 py-3 rounded-full mb-4">
              <Heart className="w-6 h-6 text-teal-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Dream Trip Requests
              </span>
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-gray-600 text-lg">Explore user dreams and create unforgettable experiences</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-teal-100/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Requests</p>
                  <p className="text-3xl font-bold text-teal-600 group-hover:scale-110 transition-transform">{totalRequests}</p>
                  <p className="text-xs text-gray-500 mt-1">Dream destinations</p>
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
                  <p className="text-3xl font-bold text-cyan-600 group-hover:scale-110 transition-transform">{pendingRequests}</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting magic</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-cyan-100 to-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-cyan-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-emerald-100/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Destinations</p>
                  <p className="text-3xl font-bold text-emerald-600 group-hover:scale-110 transition-transform">{uniqueDestinations}</p>
                  <p className="text-xs text-gray-500 mt-1">Unique places</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-teal-100/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Travelers</p>
                  <p className="text-3xl font-bold text-teal-600 group-hover:scale-110 transition-transform">{totalTravelers}</p>
                  <p className="text-xs text-gray-500 mt-1">Dream seekers</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-teal-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Requests Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-teal-100/50 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                {/* Header with gradient */}
                <div className="bg-[#3ab19d] p-6 text-white relative overflow-hidden">


                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{request.destination}</h3>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Calendar className="w-4 h-4" />
                        {new Date(request.travelDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      request.status === "pending"
                        ? "bg-amber-500/20 text-amber-100 border border-amber-400/30"
                        : "bg-emerald-500/20 text-emerald-100 border border-emerald-400/30"
                    }`}>
                      {request.status === "pending" ? (
                        <>
                          <Clock className="w-3 h-3" />
                          Pending
                        </>
                      ) : (
                        <>
                          <Award className="w-3 h-3" />
                          Processed
                        </>
                      )}
                    </div>
                    <div className="text-white/80 text-sm">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                      {request.user?.profileImage ? (
                        <img
                          src={`http://localhost:3000/${request.user.profileImage}`}
                          alt={request.user?.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{request.user?.name || request.user?.username}</h4>
                      <p className="text-sm text-gray-600">@{request.user?.username}</p>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-teal-50 rounded-xl p-3 text-center">
                      <Clock className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-900">{request.duration}</div>
                      <div className="text-xs text-gray-600">Duration</div>
                    </div>
                    <div className="bg-cyan-50 rounded-xl p-3 text-center">
                      <Users className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-900">{request.travelers}</div>
                      <div className="text-xs text-gray-600">Travelers</div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-gray-900">{request.budget}</span>
                    </div>
                    <div className="text-xs text-gray-600">Budget Range</div>
                  </div>

                  {/* Special Requests Preview */}
                  {request.specialRequests && (
                    <div className="bg-amber-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold text-gray-900">Special Requests</span>
                      </div>
                      <div className="text-xs text-gray-700 line-clamp-2">
                        {request.specialRequests}
                      </div>
                    </div>
                  )}

                  {/* View Button */}
                  <button
                    onClick={() => handleViewRequest(request)}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105"
                  >
                    <Eye className="w-5 h-5" />
                    View Full Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-[#3ab19d] p-6 text-white rounded-t-3xl relative overflow-hidden">
           

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Plane className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedRequest.destination}</h2>
                    <p className="text-white/80">{selectedRequest.user?.name || selectedRequest.user?.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                >
                  ✕
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold">{selectedRequest.travelers}</div>
                  <div className="text-xs text-white/80">Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{selectedRequest.duration}</div>
                  <div className="text-xs text-white/80">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{selectedRequest.budget}</div>
                  <div className="text-xs text-white/80">Budget</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${selectedRequest.status === "pending" ? "text-amber-300" : "text-emerald-300"}`}>
                    {selectedRequest.status}
                  </div>
                  <div className="text-xs text-white/80">Status</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* User Details */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  Dream Seeker
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                    {selectedRequest.user?.profileImage ? (
                      <img
                        src={`http://localhost:3000/${selectedRequest.user.profileImage}`}
                        alt={selectedRequest.user?.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedRequest.user?.name || selectedRequest.user?.username}</h4>
                    <p className="text-sm text-gray-600">{selectedRequest.user?.email}</p>
                    <p className="text-xs text-gray-500">@{selectedRequest.user?.username}</p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold text-gray-900">Travel Date</span>
                  </div>
                  <p className="text-gray-700">{new Date(selectedRequest.travelDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>

                <div className="bg-cyan-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold text-gray-900">Duration</span>
                  </div>
                  <p className="text-gray-700">{selectedRequest.duration}</p>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-gray-900">Travelers</span>
                  </div>
                  <p className="text-gray-700">{selectedRequest.travelers} people</p>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">Budget</span>
                  </div>
                  <p className="text-gray-700">{selectedRequest.budget}</p>
                </div>
              </div>

              {/* Special Requests */}
              {selectedRequest.specialRequests && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">Special Requests & Dreams</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedRequest.specialRequests}</p>
                </div>
              )}

              {/* Request Info */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Request Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Submitted:</span>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedRequest.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className={`font-medium ${selectedRequest.status === "pending" ? "text-amber-600" : "text-emerald-600"}`}>
                      {selectedRequest.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-center pt-4">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-4 py-2 rounded-full mb-4">
                    <Crown className="w-5 h-5 text-teal-600" />
                    <span className="text-sm font-semibold text-teal-700">Ready to create their dream trip?</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    This request is waiting for your magical touch! ✨
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewUserRequests;
