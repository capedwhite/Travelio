import { useState } from "react";
import {
  MapPin,
  Clock,
  Sparkles,
  MessageSquare,
  Star,
  TrendingUp,
  Globe,
  Calendar,
  Users,
  Award,
  Heart,
  Compass,
  Plane,
  Mountain,
  Crown,
  Gem,
  Zap,
  CheckCircle,
  X,
} from "lucide-react";
import api from "../../api/axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "./schema/bookingSchema";
import { bargainSchema } from "./schema/bargainSchema";
import PackageRequest from "./packageRequest";
import { ClipLoader } from "react-spinners";

function ExplorePackages() {
  const [pkg, setPackage] = useState([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bargainOpen, setBargainOpen] = useState(false);
  const [packageid, setPackageid] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [togglingFavorite, setTogglingFavorite] = useState(null);
  const {
    register: bookingregister,
    handleSubmit: bookingsubmit,
    formState: { errors: bookingerror },
    reset: bookingreset,
  } = useForm({ resolver: zodResolver(bookingSchema) });
  const {
    register: bargainregister,
    handleSubmit: bargainsubmit,
    formState: { errors: bargainerror },
    reset: bargainreset,
  } = useForm({ resolver: zodResolver(bargainSchema) });

  const handleBooking = async (data) => {
    console.log("handling booking submission ", data);
    try {
      const payload = {
        ...data,
        packageid,
      };
      const res = await api.post("/user/explorepackages/booking", payload);
      console.log(res.data?.data);
      alert(res.data?.message);
      bookingreset();
    } catch (error) {
      console.log(error.message);
      alert(error.response?.data?.message);
    }
  };
  const handleBargain = async (data) => {
    try {
      const payload = {
        ...data,
        packageid,
      };
      const res = await api.post("/user/explorepackages/bargain", payload);
      console.log(res.data.data);
      alert(res.data.message);
      bargainreset();
    } catch (error) {
      console.log(error);
      alert(error.res.data.message);
    }
  };

  useEffect(() => {
    const getallpackages = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/user/explorepackages?filter=${activeFilter}`,
        );
        console.log(res.data.data);
        console.log(res.data.message);
        setPackage(res.data.data);
      } catch (error) {
        console.log(error);
        console.log(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    getallpackages();
  }, [activeFilter]);

  // Fetch user's favorite IDs on mount
  useEffect(() => {
    const fetchFavoriteIds = async () => {
      try {
        const res = await api.get("/user/favorites/ids");
        setFavoriteIds(res.data.data || []);
      } catch (error) {
        console.log("Error fetching favorites:", error);
      }
    };
    fetchFavoriteIds();
  }, []);

  const handleToggleFavorite = async (packageId, e) => {
    e.stopPropagation();
    setTogglingFavorite(packageId);
    try {
      const res = await api.post("/user/favorites/toggle", { packageId });
      if (res.data.isFavorited) {
        setFavoriteIds((prev) => [...prev, packageId]);
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== packageId));
      }
    } catch (error) {
      console.log("Error toggling favorite:", error);
      alert(error.response?.data?.message || "Failed to update favorite");
    } finally {
      setTogglingFavorite(null);
    }
  };
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex justify-center py-50">
        <ClipLoader size={35} color="#14B8A6" />
        <p className="mx-3 ">Loading Explore packages</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
        {/* Hero Section */}
        <div className=" rounded-2xl mb-8 p-8 text-center text-white"     style={{
      backgroundImage: "url('/images/image.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    }}>
          
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/10 rounded-full">
              <Globe className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Explore Packages
          </h1>
          <p className="text-lg text-[#fffffff2] mb-6 max-w-2xl mx-auto">
            Discover extraordinary destinations and create unforgettable
            memories with our curated travel experiences
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Destinations</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <Crown className="w-4 h-4" />
              <span>Luxury Experiences</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <Gem className="w-4 h-4" />
              <span>Premium Service</span>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex gap-8">
          {/* Left Side - Packages */}
          <div className="flex-1">
            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { name: "All", icon: Compass },
                  { name: "Adventure", icon: Mountain },
                  { name: "Family", icon: TrendingUp },
                  { name: "Luxury", icon: Crown },
                  { name: "Budget", icon: CheckCircle },
                ].map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => setActiveFilter(name)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      activeFilter === name
                        ? "bg-teal-500 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {pkg.map((pkg, index) => (
                <>
                  <div
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden">
                      <div className="aspect-[3/2] relative">
                        <img
                          src={`http://localhost:3000/${pkg.images.coverImage}`}
                          alt={pkg.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Hover View Display */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                              <Compass className="w-5 h-5" />
                              <span
                                className="font-semibold"
                                onClick={() => {
                                  navigate(`/explorepackages/${pkg.id}`);
                                }}
                              >
                                View Details
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      {pkg.seasonalDiscount?.label && (
                        <div className="absolute bottom-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {pkg.seasonalDiscount.label}{" "}
                          {pkg.seasonalDiscount.percentage}%
                        </div>
                      )}

                      {pkg.tags && pkg.tags.length > 0 && (
                        <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {pkg.tags.slice(0, 2).join(", ")}
                        </div>
                      )}

                      {/* Heart icon for favorites */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          className={`p-1.5 rounded-full transition-all ${
                            favoriteIds.includes(pkg.id)
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-white/80 hover:bg-white"
                          }`}
                          onClick={(e) => handleToggleFavorite(pkg.id, e)}
                          disabled={togglingFavorite === pkg.id}
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              favoriteIds.includes(pkg.id)
                                ? "text-white fill-white"
                                : "text-gray-600"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-1 group-hover:text-[#3ab19d] transition-colors duration-300">
                          {pkg.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-[#3ab19d]" />
                          <span>{pkg.locations.city}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-[#3ab19d]" />
                          <span>{pkg.duration}</span>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-[#3ab19d]">
                              {pkg.price.currency}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {Number(pkg.price.discountedPrice) === 0 ? (
                                <span className="text-green-600">Free</span>
                              ) : (
                                pkg.price.discountedPrice
                              )}
                            </span>
                          </div>
                          {Number(pkg.price.discountedPrice) !== 0 &&
                            pkg.price.originalPrice && (
                              <p className="text-xs text-gray-400 line-through">
                                {pkg.price.currency} {pkg.price.originalPrice}
                              </p>
                            )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-[#3ab19d] text-white px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#2d9b8a] transition-all duration-200"
                          onClick={() => {
                            setBookingOpen(true);
                            setPackageid(pkg.id);
                          }}
                        >
                          <Sparkles className="w-4 h-4" />
                          Book Now
                        </button>
                        <button
                          className="flex-1 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-[#dda169] hover:text-[#dda169] transition-all duration-200"
                          onClick={() => {
                            setBargainOpen(true);
                            setPackageid(pkg.id);
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                          Bargain
                        </button>
                      </div>

          
                    </div>
                  </div>

                  {bookingOpen && (
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                      onClick={() => {
                        setBookingOpen(false);
                      }}
                    >
                      <div
                        className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto transform"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-8">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#3ab19d]/10 rounded-xl">
                                <Calendar className="w-6 h-6 text-[#3ab19d]" />
                              </div>
                              <h2 className="text-2xl font-bold text-gray-900">
                                Book This Package
                              </h2>
                            </div>
                            <button
                              onClick={() => {
                                setBookingOpen(false);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <form onSubmit={bookingsubmit(handleBooking)}>
                            <div className="space-y-5">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  <Users className="w-4 h-4 text-[#3ab19d]" />
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter your full name"
                                  {...bookingregister("fullname")}
                                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white hover:border-[#3ab19d]/50"
                                />
                                {bookingerror.name && (
                                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <X className="w-3 h-3" />
                                    {bookingerror.name.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  {...bookingregister("email")}
                                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white hover:border-[#3ab19d]/50"
                                />
                                {bookingerror.email && (
                                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <X className="w-3 h-3" />
                                    {bookingerror.email.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  Phone Number
                                </label>
                                <input
                                  type="tel"
                                  placeholder="+1 (555) 123-4567"
                                  {...bookingregister("phone")}
                                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white hover:border-[#3ab19d]/50"
                                />
                                {bookingerror.phone && (
                                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <X className="w-3 h-3" />
                                    {bookingerror.phone.message}
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    👥 Travelers
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    {...bookingregister("travelers")}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white hover:border-[#3ab19d]/50"
                                    placeholder="2"
                                  />
                                  {bookingerror.travelers && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                      <X className="w-3 h-3" />
                                      {bookingerror.travelers.message}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    Travel Date
                                  </label>
                                  <input
                                    type="date"
                                    {...bookingregister("date")}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white hover:border-[#3ab19d]/50"
                                  />
                                  {bookingerror.date && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                      <X className="w-3 h-3" />
                                      {bookingerror.date.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              className="mt-6 w-full bg-gradient-to-r from-[#3ab19d] to-[#4cc9b4] text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-[#3ab19d]/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                              type="submit"
                            >
                              <Sparkles className="w-5 h-5" />
                              Confirm Booking
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}

                  {bargainOpen && (
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                      onClick={() => {
                        setBargainOpen(false);
                      }}
                    >
                      <div
                        className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto transform"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-8">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#dda169]/10 rounded-xl">
                                <MessageSquare className="w-6 h-6 text-[#dda169]" />
                              </div>
                              <h2 className="text-2xl font-bold text-gray-900">
                                Negotiate Price
                              </h2>
                            </div>
                            <button
                              onClick={() => {
                                setBargainOpen(false);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <form onSubmit={bargainsubmit(handleBargain)}>
                            <div className="space-y-5">
                              <div className="bg-gradient-to-r from-[#dda169]/10 to-[#dda169]/5 p-4 rounded-xl border border-[#dda169]/20">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">
                                    Original Price
                                  </span>
                                  <span className="text-lg font-bold text-[#dda169] flex items-center gap-1">
                                    <Gem className="w-4 h-4" />
                                    {pkg.price.currency}{" "}
                                    {pkg.price.originalPrice}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  Your Offer
                                </label>
                                <input
                                  type="number"
                                  placeholder={`Enter your best offer`}
                                  {...bargainregister("offerprice")}
                                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dda169] focus:border-[#dda169] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white hover:border-[#dda169]/50"
                                />
                                {bargainerror.offerprice && (
                                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <X className="w-3 h-3" />
                                    {bargainerror.offerprice.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  Preferred Duration
                                </label>
                                <input
                                  type="text"
                                  placeholder={`Current: ${pkg.duration}`}
                                  {...bargainregister("offerdate")}
                                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dda169] focus:border-[#dda169] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white hover:border-[#dda169]/50"
                                />
                                {bargainerror.offerdate && (
                                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <X className="w-3 h-3" />
                                    {bargainerror.offerdate.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  Special Requests
                                </label>
                                <textarea
                                  placeholder="Any special requests or changes you'd like..."
                                  {...bargainregister("notes")}
                                  rows={3}
                                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dda169] focus:border-[#dda169] focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white hover:border-[#dda169]/50 resize-none"
                                />
                                {bargainerror.notes && (
                                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <X className="w-3 h-3" />
                                    {bargainerror.notes.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              className="mt-6 w-full bg-gradient-to-r from-[#dda169] to-[#e6b86a] text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-[#dda169]/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                              type="submit"
                            >
                              <MessageSquare className="w-5 h-5" />
                              Submit Negotiation
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>

          {/* Right Side - Package Request Form */}
          <div className="hidden lg:block w-96">
            <PackageRequest />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ExplorePackages;
