import { useEffect, useState } from "react";
import AdminSidebar from "../../components/Adminnavbar";
import {
  Package,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Eye,
  EyeOff,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  User,
  Phone,
  Mail,
  Receipt,
  DollarSign,
  Crown,
  Percent,
  Ticket,
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
      setAllBookings(res.data.data || []);
      console.log(res.data.data);
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
      const res = await api.put(`/admin/booking/${bookingId}/status`, {
        status: newStatus,
      });
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
      <AdminSidebar>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <ClipLoader size={50} color="#64748b" />
            <p className="text-slate-600 mt-4 font-medium">
              Loading  bookings...
            </p>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  if (!allBookings || allBookings.length === 0) {
    return (
      <AdminSidebar>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-600 mb-2">
              No Bookings Found
            </h3>
            <p className="text-slate-500">No bookings have been made yet.</p>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  // Calculate total stats
  const totalBookings = allBookings.reduce(
    (sum, pkg) => sum + (pkg.bookings?.length || 0),
    0,
  );
  const totalRevenue = Math.round(
    allBookings.reduce((sum, pkg) => {
      const packageRevenue =
        pkg.bookings
          ?.filter((booking) => true) // Include all bookings for now to debug
          ?.reduce((pkgSum, booking) => {
            let price = 0;
            if (booking.price?.finalTotal) {
              price = booking.price.finalTotal;
            }
            const parsedPrice =
              typeof price === "string" ? parseFloat(price) || 0 : price;
            return pkgSum + parsedPrice;
          }, 0) || 0;
      return sum + packageRevenue;
    }, 0),
  );
  const confirmedBookings = allBookings.reduce(
    (sum, pkg) =>
      sum +
      (pkg.bookings?.filter(
        (b) =>
          b.status?.toLowerCase() === "confirmed" ||
          b.status?.toLowerCase() === "paid",
      )?.length || 0),
    0,
  );

  return (
    <AdminSidebar>
      <div className="min-h-screen bg-slate-50">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-lg border border-slate-200 mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
             Bookings Dashboard
                </h1>
                <p className="text-slate-600">
                  Luxury travel management at your fingertips
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
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold text-slate-800">
                    {totalBookings}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    All time bookings
                  </p>
                </div>
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Receipt className="w-7 h-7 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-emerald-700 flex items-center">
                    <DollarSign className="w-6 h-6" />
                    {totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Confirmed earnings
                  </p>
                </div>
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Confirmed
                  </p>
                  <p className="text-3xl font-bold text-blue-700">
                    {confirmedBookings}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Active bookings</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Conversion Rate
                  </p>
                  <p className="text-3xl font-bold text-purple-700">
                    {totalBookings > 0
                      ? Math.round((confirmedBookings / totalBookings) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Booking success</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Percent className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Packages List */}
          <div className="space-y-6">
            {allBookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  No packages found
                </h3>
                <p className="text-slate-500">
                  No packages have been created yet.
                </p>
              </div>
            ) : (
              allBookings.map((pkg) => {
                const packageBookings = pkg.bookings || [];
                const packageRevenue = packageBookings
                  .filter((booking) => true) // Include all bookings for now to debug
                  .reduce((sum, booking) => {
                    // Use finalTotal if available, otherwise calculate from discountedPrice * travelers or originalPrice * travelers
                    let price = 0;
                    if (booking.price?.finalTotal) {
                      price = booking.price.finalTotal;
                    } else if (booking.price?.total) {
                      price = booking.price.total;
                    } else if (booking.price?.discountedPrice) {
                      price =
                        (parseFloat(booking.price.discountedPrice) || 0) *
                        (booking.Travelers || 1);
                    } else if (booking.price?.originalPrice) {
                      price =
                        (parseFloat(booking.price.originalPrice) || 0) *
                        (booking.Travelers || 1);
                    }
                    const parsedPrice =
                      typeof price === "string"
                        ? parseFloat(price) || 0
                        : price;
                    return sum + parsedPrice;
                  }, 0);
                const confirmedCount = packageBookings.filter(
                  (b) =>
                    b.status?.toLowerCase() === "confirmed" ||
                    b.status?.toLowerCase() === "paid",
                ).length;

                return (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
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
                                <Calendar className="w-4 h-4" />
                                Created:{" "}
                                {new Date(pkg.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {pkg.price?.currency}{" "}
                                {Number(
                                  pkg.price?.originalPrice || 0,
                                ).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                              {pkg.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-800">
                            {packageBookings.length}
                          </div>
                          <div className="text-sm text-slate-600">
                            Total Bookings
                          </div>
                          <div className="flex gap-2 mt-2">
                            <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-medium">
                              {confirmedCount} Confirmed
                            </div>
                            <div className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-medium">
                              Revenue: {pkg.price?.currency}{" "}
                              {packageRevenue.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Bookings Button */}
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
                            Hide Bookings
                          </>
                        ) : (
                          <>
                            <Eye className="w-5 h-5" />
                            View Bookings ({packageBookings.length})
                          </>
                        )}
                      </button>
                    </div>

                    {/* Bookings List */}
                    {expandedPackage === pkg.id && (
                      <div className="px-6 pb-6">
                        {packageBookings.length === 0 ? (
                          <div className="text-center py-8 bg-slate-50 rounded-2xl">
                            <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-600">
                              No bookings for this package yet
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {packageBookings.map((booking) => (
                              <BookingDetailsCard
                                key={booking.bookingId}
                                booking={booking}
                                onStatusChange={handleStatusChange}
                                updatingStatus={updatingStatus}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}
function BookingDetailsCard({ booking, onStatusChange, updatingStatus }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-0">
        {/* Customer Information */}
        <div className="p-6 border-r border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#3ab19d] rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Customer Details
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-800">
                {booking.Fullname}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">{booking.Email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">{booking.Phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">
                Joined:{" "}
                {booking.user?.createdAt
                  ? new Date(booking.user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Payment & Status */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Payment & Status
            </h3>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-xl p-4 mb-4 border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-3">
              Price Breakdown
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Original Price:</span>
                <span className="text-sm text-slate-800">
                  {booking.price?.currency}{" "}
                  {booking.price?.total?.toLocaleString() ||
                    booking.price?.originalPrice?.toLocaleString()}
                </span>
              </div>
              {booking.price?.couponApplied && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600">
                    Coupon Discount:
                  </span>
                  <span className="text-sm text-green-600">
                    -{booking.price?.currency}{" "}
                    {booking.price?.couponDiscount?.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="border-t border-slate-300 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800">
                    Final Total:
                  </span>
                  <span className="font-bold text-emerald-600">
                    {booking.price?.currency}{" "}
                    {booking.price?.finalTotal?.toLocaleString() ||
                      booking.price?.total?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Coupon */}
          {booking.bookingCoupon && (
            <div className="bg-yellow-50 rounded-xl p-4 mb-4 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">
                  Booking Coupon
                </span>
              </div>
              <div className="bg-white border-2 border-yellow-300 rounded-lg p-2">
                <p className="text-center font-mono font-bold text-yellow-700">
                  {booking.bookingCoupon}
                </p>
              </div>
            </div>
          )}

          {/* Status & Actions */}
          <div className="space-y-3">
            <div>
              <span className="text-sm font-semibold text-slate-700">
                Current Status:
              </span>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ml-2 ${
                  booking.status?.toLowerCase() === "paid"
                    ? "bg-emerald-100 text-emerald-700"
                    : booking.status?.toLowerCase() === "confirmed"
                      ? "bg-blue-100 text-blue-700"
                      : booking.status?.toLowerCase() === "not paid"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                }`}
              >
                {booking.status?.toLowerCase() === "paid" && (
                  <CheckCircle className="w-4 h-4" />
                )}
                {booking.status?.toLowerCase() === "confirmed" && (
                  <Award className="w-4 h-4" />
                )}
                {booking.status?.toLowerCase() === "not paid" && (
                  <Clock className="w-4 h-4" />
                )}
                {booking.status?.toLowerCase() === "cancelled" && (
                  <XCircle className="w-4 h-4" />
                )}
                {booking.status || "Unknown"}
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="flex flex-wrap gap-2">
              {updatingStatus === booking.bookingId ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-2 rounded-lg">
                  <ClipLoader size={16} color="#64748b" />
                  <span>Updating...</span>
                </div>
              ) : booking.status?.toLowerCase() === "confirmed" ? (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span>Booking Confirmed - No further actions needed</span>
                </div>
              ) : (
                <>
                  {booking.status !== "Paid" && (
                    <button
                      onClick={() => onStatusChange(booking.bookingId, "Paid")}
                      className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium"
                    >
                      Mark Paid
                    </button>
                  )}
                  {booking.status !== "Confirmed" &&
                    booking.status === "Paid" && (
                      <button
                        onClick={() =>
                          onStatusChange(booking.bookingId, "Confirmed")
                        }
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                      >
                        Confirm
                      </button>
                    )}
                  {booking.status !== "Cancelled" && (
                    <button
                      onClick={() =>
                        onStatusChange(booking.bookingId, "Cancelled")
                      }
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Travel Dates */}
      <div className="bg-white p-6 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Travel Schedule</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-sm text-slate-600 mb-1">Travel Date</div>
            <div className="font-semibold text-slate-800">
              {new Date(booking.Date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-sm text-slate-600 mb-1">Booking Created</div>
            <div className="font-semibold text-slate-800">
              {new Date(booking.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-sm text-slate-600 mb-1">Last Updated</div>
            <div className="font-semibold text-slate-800">
              {new Date(booking.updatedAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBookingsPage;
