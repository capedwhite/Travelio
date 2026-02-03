import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Sparkles,
  MessageSquare,
  Star,
  TrendingUp,
  Heart,
  Compass,
  Calendar,
  Users,
  X,
  HeartOff,
} from "lucide-react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "./schema/bookingSchema";
import { bargainSchema } from "./schema/bargainSchema";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

function MyFavourites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bargainOpen, setBargainOpen] = useState(false);
  const [packageid, setPackageid] = useState(null);
  const [removingFavorite, setRemovingFavorite] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/favorites");
      setFavorites(res.data.data || []);
    } catch (error) {
      console.log("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (packageId, e) => {
    e.stopPropagation();
    setRemovingFavorite(packageId);
    try {
      await api.post("/user/favorites/toggle", { packageId });
      setFavorites((prev) =>
        prev.filter((fav) => fav.package.id !== packageId),
      );
      toast.success("Removed from favorites");
    } catch (error) {
      console.log("Error removing favorite:", error);
      toast.error("Failed to remove from favorites");
    } finally {
      setRemovingFavorite(null);
    }
  };

  const handleBooking = async (data) => {
    try {
      const payload = { ...data, packageid };
      const res = await api.post("/user/explorepackages/booking", payload);
      toast.success(res.data?.message);
      bookingreset();
      setBookingOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const handleBargain = async (data) => {
    try {
      const payload = { ...data, packageid };
      const res = await api.post("/user/explorepackages/bargain", payload);
      toast.success(res.data.message);
      bargainreset();
      setBargainOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Bargain request failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <ClipLoader size={50} color="#3ab19d" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
        {/* Header */}
        <div className="bg-[#3ab19d] rounded-2xl mb-8 p-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/10 rounded-full">
              <Heart className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">My Favourites</h1>
          <p className="text-lg text-white/90 mb-4 max-w-2xl mx-auto">
            Your saved travel packages ready to book anytime
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Heart className="w-4 h-4 fill-white" />
            <span>{favorites.length} Saved Packages</span>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <HeartOff className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-600 mb-3">
              No Favourites Yet
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start exploring packages and save your favorites by clicking the
              heart icon!
            </p>
            <button
              onClick={() => navigate("/explorepackages")}
              className="bg-[#3ab19d] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#2d9b8a] transition shadow-lg"
            >
              Explore Packages
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((fav, index) => {
              const pkg = fav.package;
              return (
                <div
                  key={fav.id}
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
                          <div
                            className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer"
                            onClick={() =>
                              navigate(`/explorepackages/${pkg.id}`)
                            }
                          >
                            <Compass className="w-5 h-5" />
                            <span className="font-semibold">View Details</span>
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

                    {/* Remove from favorites button */}
                    <div className="absolute top-3 right-3">
                      <button
                        className="p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition-all"
                        onClick={(e) => handleRemoveFavorite(pkg.id, e)}
                        disabled={removingFavorite === pkg.id}
                      >
                        {removingFavorite === pkg.id ? (
                          <ClipLoader size={16} color="#fff" />
                        ) : (
                          <Heart className="w-4 h-4 text-white fill-white" />
                        )}
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
                        <span>{pkg.locations?.city}</span>
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
                            {pkg.price?.currency}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {Number(pkg.price?.discountedPrice) === 0 ? (
                              <span className="text-green-600">Free</span>
                            ) : (
                              pkg.price?.discountedPrice
                            )}
                          </span>
                        </div>
                        {Number(pkg.price?.discountedPrice) !== 0 &&
                          pkg.price?.originalPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              {pkg.price?.currency} {pkg.price?.originalPrice}
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

                    {/* Rating indicator */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < 4 ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">4.8</span>
                      </div>
                      <span className="text-xs text-gray-500">120 reviews</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Booking Modal */}
        {bookingOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setBookingOpen(false)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
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
                    onClick={() => setBookingOpen(false)}
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
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none transition-all"
                      />
                      {bookingerror.fullname && (
                        <p className="text-red-500 text-sm mt-1">
                          {bookingerror.fullname.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#3ab19d]" />
                        Travel Date
                      </label>
                      <input
                        type="date"
                        {...bookingregister("traveldate")}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none transition-all"
                      />
                      {bookingerror.traveldate && (
                        <p className="text-red-500 text-sm mt-1">
                          {bookingerror.traveldate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#3ab19d]" />
                        Number of Travelers
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Enter number of travelers"
                        {...bookingregister("travelers")}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none transition-all"
                      />
                      {bookingerror.travelers && (
                        <p className="text-red-500 text-sm mt-1">
                          {bookingerror.travelers.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#3ab19d] text-white py-3 rounded-xl font-semibold hover:bg-[#2d9b8a] transition-all"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Bargain Modal */}
        {bargainOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setBargainOpen(false)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#dda169]/10 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-[#dda169]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Make an Offer
                    </h2>
                  </div>
                  <button
                    onClick={() => setBargainOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={bargainsubmit(handleBargain)}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Offer Price
                      </label>
                      <input
                        type="number"
                        placeholder="Enter your offer price"
                        {...bargainregister("offerprice")}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dda169] focus:border-[#dda169] focus:outline-none transition-all"
                      />
                      {bargainerror.offerprice && (
                        <p className="text-red-500 text-sm mt-1">
                          {bargainerror.offerprice.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        {...bargainregister("offerdate")}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dda169] focus:border-[#dda169] focus:outline-none transition-all"
                      />
                      {bargainerror.offerdate && (
                        <p className="text-red-500 text-sm mt-1">
                          {bargainerror.offerdate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        placeholder="Any special requests or notes..."
                        {...bargainregister("notes")}
                        rows={3}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#dda169] focus:border-[#dda169] focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#dda169] text-white py-3 rounded-xl font-semibold hover:bg-[#c88f5a] transition-all"
                    >
                      Submit Offer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyFavourites;
