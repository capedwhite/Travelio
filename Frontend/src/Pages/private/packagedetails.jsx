import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Hotel,
  Map,
  Star,
  Clock,
  Users,
  Award,
  CheckCircle,
  XCircle,
  Ticket,
  MessageSquare,
  User,
  Trash2,
  Send,
} from "lucide-react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bargainSchema } from "./schema/bargainSchema";
import { bookingSchema } from "./schema/bookingSchema";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext";

function PackageDetailsPage() {
  const { user } = useAuth();
  const [pkg, setPackage] = useState();
  const [openItinerary, setOpenItinerary] = useState(null);
  const [openTourist, setOpenTourist] = useState(null);
  const [openHotel, setOpenHotel] = useState(null);
  const [userAwards, setUserAwards] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showBookingTicket, setShowBookingTicket] = useState(false);
  const [bookingCoupon, setBookingCoupon] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const {
    register: bookingregister,
    handleSubmit: bookingsubmit,
    formState: { errors: bookingerror },
  } = useForm({ resolver: zodResolver(bookingSchema) });
  const {
    register: bargainregister,
    handleSubmit: bargainsubmit,
    formState: { errors: bargainerror },
  } = useForm({ resolver: zodResolver(bargainSchema) });

  const { id: packageid } = useParams();
  console.log(packageid);
  useEffect(() => {
    const getPackagebyid = async () => {
      console.log("function running");
      try {
        const res = await api.get(`/user/explorepackages/${packageid}`);
        console.log(res.data);
        console.log(res.data.message);
        setPackage(res.data.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getPackagebyid();
  }, [packageid]);

  useEffect(() => {
    const fetchUserAwards = async () => {
      try {
        const res = await api.get("/user/awards");
        setUserAwards(res.data.data || []);
      } catch (error) {
        console.log("Error fetching awards:", error);
      }
    };
    fetchUserAwards();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/user/packages/${packageid}/reviews`);
        setReviews(res.data.data || []);
        setAverageRating(res.data.averageRating || 0);
        setTotalReviews(res.data.totalReviews || 0);
      } catch (error) {
        console.log("Error fetching reviews:", error);
      }
    };
    if (packageid) {
      fetchReviews();
    }
  }, [packageid]);

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }
    setReviewLoading(true);
    try {
      const res = await api.post(`/user/packages/${packageid}/reviews`, {
        rating: newReview.rating,
        comment: newReview.comment,
      });
      setReviews([res.data.data, ...reviews]);
      setTotalReviews(totalReviews + 1);
      setAverageRating(
        (averageRating * totalReviews + newReview.rating) / (totalReviews + 1),
      );
      setNewReview({ rating: 5, comment: "" });
      toast.success("Review added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/user/reviews/${reviewId}`);
      const updatedReviews = reviews.filter((r) => r.id !== reviewId);
      setReviews(updatedReviews);
      setTotalReviews(totalReviews - 1);
      if (updatedReviews.length > 0) {
        const newAvg =
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
          updatedReviews.length;
        setAverageRating(newAvg);
      } else {
        setAverageRating(0);
      }
      toast.success("Review deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const calculateFinalPrice = () => {
    if (!pkg) return 0;
    const basePrice = pkg.price.discountedPrice || pkg.price.originalPrice || 0;

    if (selectedCoupon) {
      const discountMatch = selectedCoupon.awardWon.match(/(\d+)%/);
      if (discountMatch) {
        const discountPercent = parseInt(discountMatch[1]);
        return basePrice * (1 - discountPercent / 100);
      }
    }
    return basePrice;
  };

  const getDiscountAwards = () => {
    return userAwards.filter(
      (award) => award.awardWon.includes("% discount") && !award.isUsed,
    );
  };

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3ab19d] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading package details...
          </p>
        </div>
      </div>
    );
  }
  const handleBooking = async (data) => {
    console.log("handling booking submission ", data);
    try {
      const payload = {
        ...data,
        packageid,
        selectedCoupon: selectedCoupon ? selectedCoupon.id : null,
        finalPrice: calculateFinalPrice(),
      };
      const res = await api.post("/user/explorepackages/booking", payload);
      console.log(res.data?.data);

      // Show booking ticket popup with coupon number
      if (res.data.success) {
        setBookingCoupon(res.data.bookingCoupon);
        setBookingDetails(data);
        setShowBookingTicket(true);

        // If booking successful and coupon was used, mark it as used
        if (selectedCoupon) {
          try {
            await api.put(`/user/awards/${selectedCoupon.id}/use`);
            setSelectedCoupon(null);
          } catch (error) {
            console.log("Error marking coupon as used:", error);
          }
        }
      } else {
        toast.error(res.data?.message || "Booking failed");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message);
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
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          <div className="text-2xl font-bold text-gray-900">{pkg.title}</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pkg.images.tourist.map((img, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl shadow-md bg-white"
              >
                <img
                  src={`http://localhost:3000/${img}`}
                  className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={`Package view ${i + 1}`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-[#3ab19d] rounded-full"></div>
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              {pkg.description}
            </p>
          </section>

          <section className="bg-gradient-to-r from-[#3ab19d]/5 to-[#4cc9b4]/5 rounded-xl border border-[#3ab19d]/10 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-[#3ab19d] rounded-full"></div>
              Package Pricing
            </h2>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Complete travel package
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#3ab19d] mb-1">
                    {pkg.price.currency} {pkg.price.discountedPrice}
                  </div>
                  {pkg.price.originalPrice &&
                    pkg.price.originalPrice !== pkg.price.discountedPrice && (
                      <div className="text-sm text-gray-400 line-through">
                        {pkg.price.currency} {pkg.price.originalPrice}
                      </div>
                    )}
                  <p className="text-xs text-gray-500">per person</p>
                </div>
              </div>
              {pkg.price.originalPrice &&
                pkg.price.originalPrice !== pkg.price.discountedPrice && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-600">
                        You save:
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {pkg.price.currency}{" "}
                        {pkg.price.originalPrice - pkg.price.discountedPrice}
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </section>
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-[#3ab19d] rounded-full"></div>
              Trip Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-[#3ab19d]" />
                  <span className="text-sm font-medium text-gray-700">
                    Duration
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#3ab19d]">
                  {pkg.duration}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-[#3ab19d]" />
                  <span className="text-sm font-medium text-gray-700">
                    Booking Period
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {pkg.availability.startDate} - {pkg.availability.endDate}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#3ab19d]" />
                  <span className="text-sm font-medium text-gray-700">
                    Capacity
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#3ab19d]">
                  Up to {pkg.availability.maxBookings}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
              Tourist Attractions
            </h2>
            <div className="space-y-2">
              {pkg.touristSpots.map((spot, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenTourist(openTourist === idx ? null : idx)
                    }
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Map className="w-4 h-4 text-purple-500" />
                      <div>
                        <span className="font-medium text-sm text-gray-900">
                          {spot.spotname}
                        </span>
                        <p className="text-xs text-gray-500">{spot.location}</p>
                      </div>
                    </div>
                    {openTourist === idx ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {openTourist === idx && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <p className="pt-3 text-gray-600 leading-relaxed text-sm">
                        {spot.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          {/* ITINERARY */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-green-600 rounded-full"></div>
              Day by Day Itinerary
            </h2>

            <div className="space-y-2">
              {pkg.itinerary.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenItinerary(openItinerary === idx ? null : idx)
                    }
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-sm text-gray-900">
                        Day {idx + 1}: {item.title}
                      </span>
                    </div>
                    {openItinerary === idx ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {openItinerary === idx && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <p className="pt-3 text-gray-600 leading-relaxed text-sm">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* HOTELS */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
              Accommodations
            </h2>

            <div className="space-y-3">
              {pkg.hotels.map((hotel, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenHotel(openHotel === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Hotel className="w-4 h-4 text-indigo-600" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {hotel.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {hotel.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(hotel.rating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      {openHotel === idx ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {openHotel === idx && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-3 space-y-3">
                        <div>
                          <span className="text-xs font-medium text-gray-700">
                            Amenities:
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            {hotel.amenities}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs font-medium text-gray-700">
                              Location
                            </span>
                            <p className="text-sm text-gray-900">
                              {hotel.location}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-700">
                              Rating
                            </span>
                            <p className="text-sm text-gray-900">
                              {hotel.rating}/5 stars
                            </p>
                          </div>
                        </div>
                        {hotel.hotelImages && hotel.hotelImages.length > 0 && (
                          <div className="mt-4">
                            <span className="text-xs font-medium text-gray-700 mb-3 block">
                              Hotel Gallery
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {hotel.hotelImages.map((img, i) => (
                                <div key={i} className="relative group">
                                  <img
                                    src={`http://localhost:3000/${img}`}
                                    className="w-full h-20 object-cover rounded-lg shadow-sm border border-gray-200 group-hover:shadow-md transition-shadow duration-200"
                                    alt={`Hotel view ${i + 1}`}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      View
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                What's Included
              </h2>
              <div className="space-y-2">
                {pkg.inclusions?.length > 0 ? (
                  pkg.inclusions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2 bg-green-50 rounded-lg border border-green-100"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Details not provided
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                What's Excluded
              </h2>
              <div className="space-y-2">
                {pkg.exclusions?.length > 0 ? (
                  pkg.exclusions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2 bg-red-50 rounded-lg border border-red-100"
                    >
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Details not provided
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className=" bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#3ab19d]" />
                Reviews & Ratings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                See what other travelers are saying
              </p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({totalReviews} reviews)
              </span>
            </div>
          </div>

          {/* Add Review Form */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Write a Review</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition ${star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Share your experience with this package..."
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3ab19d] resize-none"
                rows={3}
              />
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmitReview}
                disabled={reviewLoading || !newReview.comment.trim()}
                className="flex items-center gap-2 bg-[#3ab19d] hover:bg-[#329b89] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#3ab19d]/10 rounded-full flex items-center justify-center overflow-hidden">
                        {review.user?.profileImage ? (
                          <img
                            src={`http://localhost:3000/${review.user.profileImage}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-[#3ab19d]" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.user?.username || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {user?.id === review.userId && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mt-3 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
        </div>

        <div className="space-y-5 sticky top-24 h-fit ">
          <form onSubmit={bookingsubmit(handleBooking)}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#3ab19d] rounded-full"></div>
                Book This Package
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...bookingregister("fullname")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none"
                  />
                  {bookingerror.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {bookingerror.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    {...bookingregister("email")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none"
                  />
                  {bookingerror.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {bookingerror.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...bookingregister("phone")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none"
                  />
                  {bookingerror.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {bookingerror.phone.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Travelers
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...bookingregister("travelers")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none"
                      placeholder="2"
                    />
                    {bookingerror.travelers && (
                      <p className="text-red-500 text-xs mt-1">
                        {bookingerror.travelers.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      {...bookingregister("date")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ab19d] focus:border-[#3ab19d] focus:outline-none"
                    />
                    {bookingerror.date && (
                      <p className="text-red-500 text-xs mt-1">
                        {bookingerror.date.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price Snapshot */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Price Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Original Price
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {pkg.price.currency}{" "}
                        {pkg.price.discountedPrice || pkg.price.originalPrice}
                      </span>
                    </div>
                    {selectedCoupon && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600">
                          Discount Applied ({selectedCoupon.awardWon})
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          -{pkg.price.currency}{" "}
                          {(pkg.price.discountedPrice ||
                            pkg.price.originalPrice) - calculateFinalPrice()}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-900">
                          Final Price
                        </span>
                        <span className="text-lg font-bold text-[#3ab19d]">
                          {pkg.price.currency} {calculateFinalPrice()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discount Coupon Section */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-3 rounded-lg font-semibold text-sm hover:from-yellow-500 hover:to-yellow-600 transition duration-200 shadow-sm hover:shadow-md"
                  >
                    <Ticket className="w-4 h-4" />
                    {selectedCoupon
                      ? `Applied: ${selectedCoupon.awardWon}`
                      : "Use Discount Coupon"}
                  </button>
                  {selectedCoupon && (
                    <button
                      type="button"
                      onClick={() => setSelectedCoupon(null)}
                      className="w-full text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove Coupon
                    </button>
                  )}
                </div>
              </div>
              <button
                className="w-full bg-[#3ab19d] mt-6 text-white px-4 py-3 rounded-lg font-semibold text-sm hover:bg-[#2d9b8a] transition duration-200 shadow-sm hover:shadow-md"
                type="submit"
              >
                Confirm Booking
              </button>
            </div>
          </form>
          <form onSubmit={bargainsubmit(handleBargain)}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#dda169] rounded-full"></div>
                Negotiate Price
              </h2>

              <div className="space-y-4">
                <div className="bg-[#dda169]/5 p-3 rounded-lg border border-[#dda169]/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Original Price
                    </span>
                    <span className="text-sm font-bold text-[#dda169]">
                      {pkg.price.currency} {pkg.price.originalPrice}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Offer
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your best offer"
                    {...bargainregister("offerprice")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#dda169] focus:border-[#dda169] focus:outline-none"
                  />
                  {bargainerror.offerprice && (
                    <p className="text-red-500 text-xs mt-1">
                      {bargainerror.offerprice.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Duration
                  </label>
                  <input
                    type="text"
                    placeholder={`Current: ${pkg.duration}`}
                    {...bargainregister("offerdate")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#dda169] focus:border-[#dda169] focus:outline-none"
                  />
                  {bargainerror.offerdate && (
                    <p className="text-red-500 text-xs mt-1">
                      {bargainerror.offerdate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    placeholder="Any special requests or changes..."
                    {...bargainregister("notes")}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#dda169] focus:border-[#dda169] focus:outline-none resize-none"
                  />
                  {bargainerror.notes && (
                    <p className="text-red-500 text-xs mt-1">
                      {bargainerror.notes.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                className="w-full bg-[#dda169] text-white px-4 py-3 rounded-lg font-semibold text-sm hover:bg-[#c48b4d] transition duration-200 shadow-sm hover:shadow-md mt-4"
                type="submit"
              >
                Submit Negotiation
              </button>
            </div>
          </form>

          {/* Coupon Modal */}
          {showCouponModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-xl">
                        <Ticket className="w-6 h-6 text-yellow-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Available Coupons
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowCouponModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {getDiscountAwards().length === 0 ? (
                      <div className="text-center py-8">
                        <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                          No discount coupons available
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Win challenges to earn discount coupons!
                        </p>
                      </div>
                    ) : (
                      getDiscountAwards().map((award) => (
                        <div
                          key={award.id}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedCoupon?.id === award.id
                              ? "border-yellow-400 bg-yellow-50"
                              : "border-gray-200 hover:border-yellow-300 hover:bg-yellow-25"
                          }`}
                          onClick={() => {
                            setSelectedCoupon(award);
                            setShowCouponModal(false);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {award.awardWon}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {award.challengeTitle}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {award.awardDescription}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-600">
                                {award.awardWon}
                              </div>
                              <div className="text-xs text-gray-500">
                                Won{" "}
                                {new Date(award.awardedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Booking Ticket Popup */}
      {showBookingTicket && bookingCoupon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 text-white text-center">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1">Booking Confirmed!</h2>
              <p className="text-white/90">Your adventure awaits</p>
            </div>

            {/* Ticket Content */}
            <div className="p-6">
              {/* Package Info */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {pkg.title}
                </h3>
                <p className="text-sm text-gray-600">{pkg.duration}</p>
              </div>

              {/* Coupon Section */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-300 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Ticket className="w-4 h-4 text-yellow-800" />
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Your Booking Coupon
                  </h4>
                  <div className="bg-white border-2 border-yellow-300 rounded-lg p-3 mb-2">
                    <p className="text-xl font-mono font-bold text-yellow-700 tracking-wider">
                      {bookingCoupon}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Keep this coupon number safe for your records
                  </p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Booking ID</span>
                  <span className="text-sm font-semibold text-gray-900">
                    #{Math.floor(Math.random() * 1000000)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Travelers</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {bookingDetails?.travelers || 1} person(s)
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Total Paid</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {pkg.price.currency}{" "}
                    {calculateFinalPrice() * (bookingDetails?.travelers || 1)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBookingTicket(false);
                    setBookingCoupon(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold text-sm transition duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowBookingTicket(false);
                    setBookingCoupon(null);
                    // Navigate to bookings page or refresh
                    window.location.href = "/mybookings";
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition duration-200"
                >
                  View Bookings
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/30 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}
export default PackageDetailsPage;
