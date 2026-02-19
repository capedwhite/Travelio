import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Trophy,
  MessageSquare,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Star,
  Plane,
  Mountain,
  Palmtree,
  Camera,
  Compass,
  Clock,
  ChevronRight,
  Lock,
} from "lucide-react";
import LandingNavbar from "../../components/LandingNavbar";
import api from "../../api/axios";

// Floating animation component
function FloatingElement({ children, delay = 0, duration = 3, y = 20 }) {
  return (
    <motion.div
      animate={{
        y: [0, -y, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// Animated plane that flies across screen
function FlyingPlane() {
  return (
    <motion.div
      className="absolute pointer-events-none z-10"
      initial={{ x: "-10%", y: "20%" }}
      animate={{
        x: ["0%", "110%"],
        y: ["20%", "10%", "25%", "15%"],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Plane className="w-8 h-8 sm:w-12 sm:h-12 text-[#3ab19d] rotate-45 drop-shadow-lg" />
      </motion.div>
    </motion.div>
  );
}

// Package Card Component
function PackageCard({ pkg, index }) {
  const handleClick = () => {
    alert("Please login to view package details and make bookings!");
  };

  const mainImage =
    pkg.images && pkg.images.length > 0
      ? `http://localhost:3000/${pkg.images[0]}`
      : "/images/placeholder-travel.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={mainImage}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Lock overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-full p-4"
          >
            <Lock className="w-6 h-6 text-[#3ab19d]" />
          </motion.div>
        </div>

        {/* Duration badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {pkg.duration}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-[#3ab19d] text-white px-3 py-1 rounded-lg font-bold text-sm">
            ₹{pkg.price?.discountedPrice || pkg.price?.originalPrice || "N/A"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {pkg.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 text-[#3ab19d]" />
          <span className="line-clamp-1">
            {pkg.locations?.slice(0, 2).join(", ") || "Multiple Destinations"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {pkg.availability?.maxBookings || 10} spots
            </span>
          </div>
          <span className="text-[#3ab19d] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Login to view overlay on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3ab19d] to-transparent h-0 group-hover:h-16 transition-all duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
        <span className="text-white text-sm font-semibold">
          Login to explore →
        </span>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/user/explorepackages");
        setPackages(res.data.data?.slice(0, 6) || []);
      } catch {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full overflow-hidden bg-white">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden ">
        {/* Animated Background */}
           <div
    className="absolute inset-0 bg-cover bg-center z-1"
    style={{
      backgroundImage: "url('/images/landing.jpg')",
    }}
  /><div className="absolute inset-0 bg-black/50 z-5" />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-[#e8fff9] via-white to-[#f2fffd]"
        />

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Blurred circles */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-[#3ab19d]/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute top-1/3 -right-32 w-80 h-80 bg-[#ffd166]/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 4 }}
            className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#3ab19d]/20 rounded-full blur-3xl"
          />

          {/* Flying plane */}
          <FlyingPlane />

          {/* Floating icons */}
          <div className="hidden lg:block">
            <FloatingElement delay={0} y={15}>
              <div className="absolute top-32 left-20 p-4 bg-white rounded-2xl shadow-lg">
                <Palmtree className="w-8 h-8 text-[#3ab19d]" />
              </div>
            </FloatingElement>
            <FloatingElement delay={1} y={20}>
              <div className="absolute top-40 right-32 p-4 bg-white rounded-2xl shadow-lg">
                <Mountain className="w-8 h-8 text-[#ffd166]" />
              </div>
            </FloatingElement>
            <FloatingElement delay={0.5} y={18}>
              <div className="absolute bottom-40 left-32 p-4 bg-white rounded-2xl shadow-lg">
                <Camera className="w-8 h-8 text-[#3ab19d]" />
              </div>
            </FloatingElement>
            <FloatingElement delay={1.5} y={12}>
              <div className="absolute bottom-32 right-20 p-4 bg-white rounded-2xl shadow-lg">
                <Compass className="w-8 h-8 text-[#ffd166]" />
              </div>
            </FloatingElement>
          </div>

          {/* Dotted pattern */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #3ab19d 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">


          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3ab19d]/10 text-[#2c9c8c] font-semibold text-sm mb-6"
            >
              <Plane className="w-4 h-4" />
              Travel • Challenges • Social Experiences
              <Sparkles className="w-4 h-4" />
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight"
            >
              Travel isn't just a trip.
              <motion.span
                className="block text-[#3ab19d] mt-2"
                animate={{
                  backgroundPosition: ["0%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                It's an experience.
              </motion.span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Discover curated travel packages, complete challenges, earn
              badges, share memories, and book unforgettable experiences — all
              in one place.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#3ab19d] text-white font-semibold shadow-lg shadow-[#3ab19d]/30 hover:bg-[#2c9c8c] transition-colors"
                >
                  Explore Packages <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition-colors font-semibold"
                >
                  <Trophy className="w-5 h-5 text-[#ffd166]" />
                  View Challenges
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16"
            >
              {[
                { value: "50+", label: "Destinations" },
                { value: "10K+", label: "Travelers" },
                { value: "4.9★", label: "Rating" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#3ab19d] rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#3ab19d] font-semibold text-sm uppercase tracking-wide">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              A smarter way to travel
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              We combine travel planning, social sharing, and gamified
              challenges into one beautifully designed platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe className="w-7 h-7" />,
                title: "Curated Packages",
                desc: "Handpicked destinations with flexible booking and bargaining options.",
                color: "bg-[#3ab19d]",
              },
              {
                icon: <Trophy className="w-7 h-7" />,
                title: "Challenges & Badges",
                desc: "Complete travel challenges and earn badges for every adventure.",
                color: "bg-[#ffd166]",
              },
              {
                icon: <MessageSquare className="w-7 h-7" />,
                title: "Social Travel Feed",
                desc: "Share experiences, post memories, and engage with fellow travelers.",
                color: "bg-[#3ab19d]",
              },
              {
                icon: <Sparkles className="w-7 h-7" />,
                title: "Personalized Journey",
                desc: "Save packages, track bookings, and build your travel profile.",
                color: "bg-[#ffd166]",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg`}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Preview Section */}
      <section className="py-24 bg-[#f9fffd] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3ab19d]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffd166]/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
          >
            <div>
              <span className="text-[#3ab19d] font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Popular Destinations
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                Trending Packages
              </h2>
            </div>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#3ab19d] font-semibold flex items-center gap-2 hover:gap-3 transition-all"
              >
                View all packages <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-[#3ab19d] border-t-transparent rounded-full"
              />
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Explore Bali Paradise",
                  location: "Bali, Indonesia",
                  duration: "5 Days",
                  price: "₹45,000",
                  image:
                    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
                },
                {
                  title: "Swiss Alps Adventure",
                  location: "Switzerland",
                  duration: "7 Days",
                  price: "₹1,20,000",
                  image:
                    "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
                },
                {
                  title: "Dubai Luxury Experience",
                  location: "Dubai, UAE",
                  duration: "4 Days",
                  price: "₹85,000",
                  image:
                    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
                },
                {
                  title: "Maldives Beach Escape",
                  location: "Maldives",
                  duration: "6 Days",
                  price: "₹95,000",
                  image:
                    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
                },
                {
                  title: "Japanese Culture Tour",
                  location: "Tokyo, Japan",
                  duration: "8 Days",
                  price: "₹1,10,000",
                  image:
                    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
                },
                {
                  title: "Kerala Backwaters",
                  location: "Kerala, India",
                  duration: "4 Days",
                  price: "₹25,000",
                  image:
                    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
                },
              ].map((pkg, index) => (
                <motion.div
                  key={pkg.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() =>
                    alert(
                      "Please login to view package details and make bookings!",
                    )
                  }
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        className="bg-white/90 backdrop-blur-sm rounded-full p-4"
                      >
                        <Lock className="w-6 h-6 text-[#3ab19d]" />
                      </motion.div>
                    </div>
                    <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pkg.duration}
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-[#3ab19d] text-white px-3 py-1 rounded-lg font-bold text-sm">
                        {pkg.price}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 text-[#3ab19d]" />
                      <span>{pkg.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#ffd166] fill-[#ffd166]" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                      <span className="text-[#3ab19d] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        View <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3ab19d] to-transparent h-0 group-hover:h-16 transition-all duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
                    <span className="text-white text-sm font-semibold">
                      Login to explore →
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-4">
              🔒 Login to view detailed packages, prices, and book your dream
              vacation
            </p>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#3ab19d] text-white rounded-xl font-semibold shadow-lg shadow-[#3ab19d]/30 hover:bg-[#2c9c8c] transition-colors"
              >
                Login to Explore
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#3ab19d] font-semibold text-sm uppercase tracking-wide">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              How it works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                number: "1",
                icon: <Compass className="w-8 h-8" />,
                title: "Explore",
                desc: "Browse curated travel packages and exciting challenges tailored for you.",
              },
              {
                number: "2",
                icon: <Calendar className="w-8 h-8" />,
                title: "Book & Share",
                desc: "Book your trip, negotiate prices, and share experiences with the community.",
              },
              {
                number: "3",
                icon: <Trophy className="w-8 h-8" />,
                title: "Earn & Repeat",
                desc: "Complete challenges, earn badges, and plan your next adventure.",
              },
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center relative"
              >
                {index < 2 && (
                  <div className="hidden sm:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#3ab19d] to-[#3ab19d]/30" />
                )}

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative w-24 h-24 mx-auto mb-6"
                >
                  <div className="absolute inset-0 bg-[#3ab19d]/10 rounded-full" />
                  <div className="absolute inset-2 bg-[#3ab19d]/20 rounded-full" />
                  <div className="absolute inset-4 bg-[#3ab19d] rounded-full flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#ffd166] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {step.number}
                  </div>
                </motion.div>

                <h3 className="font-bold text-xl mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#3ab19d] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-96 h-96 border border-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-72 h-72 border border-white/10 rounded-full"
          />
          <FloatingElement delay={0} y={10}>
            <Plane className="absolute top-20 left-20 w-12 h-12 text-white/20 rotate-45" />
          </FloatingElement>
          <FloatingElement delay={1} y={15}>
            <Globe className="absolute bottom-20 right-20 w-16 h-16 text-white/20" />
          </FloatingElement>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Plane className="w-16 h-16 text-white/80 rotate-45" />
            </motion.div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
              Your next adventure <br /> starts here
            </h2>
            <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
              Join a community of explorers and turn every journey into a story
              worth telling. Sign up now and get exclusive deals!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/Signup">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2c9c8c] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Already have an account? Login
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Plane className="w-6 h-6 text-[#3ab19d]" />
              <span className="text-xl font-bold text-white">Travelio</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link to="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link to="/login" className="hover:text-white transition-colors">
                Packages
              </Link>
              <Link to="/login" className="hover:text-white transition-colors">
                Challenges
              </Link>
            </div>
            <p className="text-sm">© 2026 Travelio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
