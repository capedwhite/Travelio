import { useEffect, useState } from "react";
import AdminSidebar from "../../components/Adminnavbar";
import {
  Package,
  TrendingUp,
  Users,
  IndianRupee,
  Calendar,
  MapPin,
  Eye,
  EyeOff,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Award,
  Plane
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function AdminBookingsPage() {
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/packagebooking");
      setAllBookings(res.data.data);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingStatus(bookingId);
      const res = await api.put(`/admin/booking/${bookingId}/status`, { status: newStatus });
      toast.success("Booking status updated successfully!");
      fetchBookings(); // Refresh data
    } catch (error) {
      toast.error("Failed to update booking status");
    } finally {
      setUpdatingStatus(null);
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

  if (!allBookings || allBookings.length === 0) {
    return (
      <>
        <AdminSidebar />
        <div className="ml-64 min-h-screen bg-gradient-to-r from-teal-600 to-emerald-200 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Bookings Found</h3>
            <p className="text-gray-500">No bookings have been made yet.</p>
          </div>
        </div>
      </>
    );
  }

  // Calculate total stats
  const totalBookings = allBookings.reduce((sum, pkg) => sum + pkg.bookings.length, 0);
  const totalRevenue = allBookings.reduce((sum, pkg) =>
    sum + (pkg.bookings.length * Number(pkg.price.originalPrice)), 0
  );
  const confirmedBookings = allBookings.reduce((sum, pkg) =>
    sum + pkg.bookings.filter(b => b.status === "Confirmed").length, 0
  );

  return (
    <>
      <AdminSidebar />
      <div className="ml-64 min-h-screen">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-100 to-emerald-100 px-6 py-3 rounded-full mb-4">
              <Plane className="w-6 h-6 text-teal-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-400 bg-clip-text text-transparent">
                Package Bookings Dashboard
              </span>
            </div>
            <p className="text-gray-600 text-lg">Manage and track all travel package bookings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-indigo-600">{totalBookings}</p>
                  <p className="text-xs text-gray-500 mt-1">Across all packages</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-emerald-600 flex items-center">
                    <IndianRupee className="w-6 h-6" />
                    {totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total earnings</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                  <p className="text-3xl font-bold text-pink-600">{confirmedBookings}</p>
                  <p className="text-xs text-gray-500 mt-1">Confirmed bookings</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-pink-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Packages */}
          <div className="space-y-6">
            {allBookings.map((pkg) => {
              const packageRevenue = pkg.bookings.length * Number(pkg.price.originalPrice);
              const packageConfirmed = pkg.bookings.filter(b => b.status === "Confirmed").length;

              return (
                <div
                  key={pkg.id}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {/* Package Header */}
                  <div className="bg-white
 p-6 text-black">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#3ab19d]/40 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <Package className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold mb-1">{pkg.title}</h2>
                          <div className="flex items-center gap-4 text-sm text-black/70">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(pkg.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              {Number(pkg.price.originalPrice).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold mb-1">{pkg.bookings.length}</div>
                        <div className="text-sm text-black/70">Total Bookings</div>
                      </div>
                    </div>

                    {/* Package Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="bg-[#3ab19d]/30 rounded-xl p-3 backdrop-blur-sm">
                        <div className="text-lg font-bold">{pkg.bookings.length}</div>
                        <div className="text-xs text-black/70">Total</div>
                      </div>
                      <div className="bg-[#3ab19d]/30 rounded-xl p-3 backdrop-blur-sm">
                        <div className="text-lg font-bold text-green-700">{packageConfirmed}</div>
                        <div className="text-xs text-black/70">Confirmed</div>
                      </div>
                      <div className="bg-[#3ab19d]/30 rounded-xl p-3 backdrop-blur-sm">
                        <div className="text-lg font-bold text-yellow-600">₹{packageRevenue.toLocaleString()}</div>
                        <div className="text-xs text-black/70">Revenue</div>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div className="p-6 border-b border-gray-100">
                    <button
                      onClick={() =>
                        setExpandedPackage(
                          expandedPackage === pkg.id ? null : pkg.id
                        )
                      }
                      className="w-full bg-teal-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {expandedPackage === pkg.id ? (
                        <>
                          <EyeOff className="w-5 h-5" />
                          Hide Booking Details
                        </>
                      ) : (
                        <>
                          <Eye className="w-5 h-5" />
                          View Booking Details
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bookings Table */}
                  {expandedPackage === pkg.id && (
                    <div className="p-6">
                      <BookingsTable
                        allBooking={pkg.bookings}
                        packagePrice={pkg.price.originalPrice}
                        onStatusChange={handleStatusChange}
                        updatingStatus={updatingStatus}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
function BookingsTable({ allBooking, packagePrice, onStatusChange, updatingStatus }) {
  return (
    <div className="space-y-4">
      {allBooking.map((booking) => (
        <div
          key={booking.bookingId}
          className="bg-gradient-to-r from-white to-gray-50/50 rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* User Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Customer Details
              </h4>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{booking.Fullname}</p>
                <p className="text-sm text-gray-600">{booking.Email}</p>
                <p className="text-sm text-gray-600">{booking.Phone}</p>
              </div>
            </div>

            {/* Booking Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Booking Details
              </h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Travelers:</span> {booking.Travelers}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {new Date(booking.Date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">ID:</span> #{booking.bookingId}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                Payment Details
              </h4>
              <div className="space-y-1">
                <p className="text-lg font-bold text-emerald-600">
                  ₹{Number(packagePrice).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Per Person: ₹{Number(packagePrice).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-pink-600" />
                Payment Status
              </h4>
              <div className="space-y-3">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {booking.status === "Paid" && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  {booking.status === "Not paid" && <Clock className="w-4 h-4 text-yellow-600" />}
                  {booking.status === "Confirmed" && <Award className="w-4 h-4 text-cyan-200" />}
                  {booking.status === "Cancelled" && <XCircle className="w-4 h-4 text-red-600" />}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "Paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : booking.status === "Confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : booking.status === "Not paid"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Status Change Buttons */}
                <div className="space-y-1">
                  {updatingStatus === booking.bookingId ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ClipLoader size={16} color="#8b5cf6" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {booking.status !== "Paid" && (
                        <button
                          onClick={() => onStatusChange(booking.bookingId, "Paid")}
                          className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600 transition-all duration-200 font-medium"
                        >
                          Mark Paid
                        </button>
                      )}
                      {booking.status !== "Confirmed" && booking.status === "Paid" && (
                        <button
                          onClick={() => onStatusChange(booking.bookingId, "Confirmed")}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status !== "Cancelled" && (
                        <button
                          onClick={() => onStatusChange(booking.bookingId, "Cancelled")}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-all duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminBookingsPage