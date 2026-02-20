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
import PackageRequest from "./packageRequest";
import { ClipLoader } from "react-spinners";

function ExplorePackages() {
  const [pkg, setPackage] = useState([]);
  const [packageid, setPackageid] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [togglingFavorite, setTogglingFavorite] = useState(null);




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
<div className="relative rounded-2xl mb-8 overflow-hidden text-center text-white">

  {/* Background Video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/images/travelvid.mp4" type="video/mp4" />
  </video>

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content */}
  <div className="relative z-10 p-8">
    <div className="flex justify-center mb-4">
      <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
        <Globe className="w-10 h-10" />
      </div>
    </div>

    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
      Explore Packages
    </h1>

    <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
      Discover extraordinary destinations and create unforgettable
      memories with our curated travel experiences
    </p>

    <div className="flex flex-wrap justify-center gap-4 text-sm">
      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
        <TrendingUp className="w-4 h-4" />
        <span>Trending Destinations</span>
      </div>

      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
        <Crown className="w-4 h-4" />
        <span>Luxury Experiences</span>
      </div>

      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
        <Gem className="w-4 h-4" />
        <span>Premium Service</span>
      </div>
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


          
                    </div>
                  </div>


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
