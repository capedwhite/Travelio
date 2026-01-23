import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  Star,
  Plane,
  Hotel,
  Camera
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function MyBookingStatus() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, confirmed, pending, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/user/mybookings");
      setBookings(res.data.data);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending":
      case "not paid":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
      case "not paid":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    return booking.status?.toLowerCase().includes(filter.toLowerCase());
  });

  const getTotalSpent = () => {
    return bookings
      .filter(booking => booking.status?.toLowerCase() === "paid" || booking.status?.toLowerCase() === "confirmed")
      .reduce((total, booking) => total + (booking.price?.total || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <ClipLoader size={50} color="#8b5cf6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            My Travel Bookings
          </h1>
          <p className="text-gray-600 text-lg">
            Your journey begins here - track all your adventures
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-indigo-600">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {bookings.filter(b => b.status?.toLowerCase() === "confirmed" || b.status?.toLowerCase() === "paid").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-amber-600">
                  {bookings.filter(b => b.status?.toLowerCase() === "pending" || b.status?.toLowerCase() === "not paid").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-purple-600 flex items-center">
                  <IndianRupee className="w-6 h-6" />
                  {getTotalSpent().toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === "all"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setFilter("confirmed")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === "confirmed"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Confirmed ({bookings.filter(b => b.status?.toLowerCase() === "confirmed" || b.status?.toLowerCase() === "paid").length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === "pending"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({bookings.filter(b => b.status?.toLowerCase() === "pending" || b.status?.toLowerCase() === "not paid").length})
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === "cancelled"
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancelled ({bookings.filter(b => b.status?.toLowerCase() === "cancelled").length})
            </button>
          </div>
        </div>

        {/* BOOKINGS LIST */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">Start your travel journey by booking an amazing package!</p>
            <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all transform hover:-translate-y-1">
              Explore Packages
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* HEADER */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{booking.package?.title}</h3>
                        <p className="text-white/80">Booking #{booking.bookingId}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {/* PACKAGE INFO */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-indigo-600" />
                        Package Details
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {booking.package?.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {booking.package?.duration}
                      </div>
                    </div>

                    {/* TRAVEL INFO */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        Travel Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Travelers:</span>
                          <span className="font-medium">{booking.Travelers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {new Date(booking.Date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booked by:</span>
                          <span className="font-medium">{booking.Fullname}</span>
                        </div>
                      </div>
                    </div>

                    {/* PRICE INFO */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        Payment Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Amount:</span>
                          <span className="text-lg font-bold text-emerald-600 flex items-center">
                            <IndianRupee className="w-4 h-4" />
                            {booking.price?.total?.toLocaleString() || "N/A"}
                          </span>
                        </div>
                        {booking.price?.discountedPrice && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Original:</span>
                            <span className="text-sm text-gray-500 line-through flex items-center">
                              <IndianRupee className="w-3 h-3" />
                              {booking.price?.originalPrice?.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Per Person:</span>
                          <span className="text-sm font-medium flex items-center">
                            <IndianRupee className="w-3 h-3" />
                            {booking.price?.discountedPrice || booking.price?.originalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* IMAGES */}
                  {booking.package?.images?.coverImage && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-pink-600" />
                        Package Gallery
                      </h4>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        <img
                          src={`http://localhost:3000/${booking.package.images.coverImage}`}
                          alt="Package"
                          className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                        {booking.package.images.tourist?.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={`http://localhost:3000/${img}`}
                            alt={`Tourist spot ${idx + 1}`}
                            className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LOCATIONS */}
                  {booking.package?.locations && booking.package.locations.length > 0 && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        Destinations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {booking.package.locations.slice(0, 5).map((location, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {location}
                          </span>
                        ))}
                        {booking.package.locations.length > 5 && (
                          <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                            +{booking.package.locations.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookingStatus;
