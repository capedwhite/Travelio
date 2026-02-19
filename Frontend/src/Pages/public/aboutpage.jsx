import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Globe,
  Users,
  Star,
  ShieldCheck,
  Plane,
  MapPin,
  Heart,
  Award,
  Compass,
  Mountain,
  Camera,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";



function FloatingElement({ children, delay = 0, y = 15 }) {
  return (
    <motion.div
      animate={{
        y: [0, -y, 0],
      }}
      transition={{
        duration: 3,
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

// Counter animation
function AnimatedCounter({ value, suffix = "" }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {value}
      {suffix}
    </motion.span>
  );
}

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Adventure",
      icon: <Mountain className="w-8 h-8" />,
      color: "bg-[#3ab19d]",
    },
    {
      name: "Discovery",
      icon: <Compass className="w-8 h-8" />,
      color: "bg-[#ffd166]",
    },
    {
      name: "Memories",
      icon: <Camera className="w-8 h-8" />,
      color: "bg-[#3ab19d]",
    },
    {
      name: "Community",
      icon: <Heart className="w-8 h-8" />,
      color: "bg-[#ffd166]",
    },
  ];

  return (
    <div className="bg-white overflow-hidden">


      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}

          <div
    className="absolute inset-0 bg-cover bg-center z-1"
    style={{
      backgroundImage: "url('/images/aboutbg.png')",
    }}
  />


        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-[#3ab19d]/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#ffd166]/20 rounded-full blur-3xl"
          />

          {/* Floating icons */}
          <div className="hidden lg:block">
            <FloatingElement delay={0}>
              <div className="absolute top-32 left-20 p-4 bg-white rounded-2xl shadow-lg">
                <Plane className="w-6 h-6 text-[#3ab19d] rotate-45" />
              </div>
            </FloatingElement>
            <FloatingElement delay={0.5}>
              <div className="absolute top-40 right-32 p-4 bg-white rounded-2xl shadow-lg">
                <Globe className="w-6 h-6 text-[#ffd166]" />
              </div>
            </FloatingElement>
            <FloatingElement delay={1}>
              <div className="absolute bottom-32 left-32 p-4 bg-white rounded-2xl shadow-lg">
                <MapPin className="w-6 h-6 text-[#3ab19d]" />
              </div>
            </FloatingElement>
          </div>

        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3ab19d]/10 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#3ab19d]" />
              <span className="text-[#3ab19d] font-semibold text-sm">
                Our Story
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#51b3a1] leading-tight mb-6"
            >
              Turning Trips Into
              <motion.span
                className="block text-white "
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Unforgettable Memories
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto"
            >
              We don't just plan trips — we create unforgettable memories, one
              destination at a time. Join thousands of adventurers who trust us.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap justify-center gap-8"
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`w-16 h-16 ${member.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}
                  >
                    {member.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {member.name}
                  </span>
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

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#3ab19d]/10 rounded-2xl" />
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-14 h-14 bg-[#3ab19d] rounded-2xl flex items-center justify-center mb-6"
                >
                  <Compass className="w-7 h-7 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🎯 Our Mission
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Our mission is to make travel simple, affordable, and magical.
                  From curated vacation packages to seamless bookings, we ensure
                  every journey feels personal and stress-free. We believe
                  everyone deserves to explore the world.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#ffd166]/10 rounded-2xl" />
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <motion.div
                  whileHover={{ rotate: -10 }}
                  className="w-14 h-14 bg-[#ffd166] rounded-2xl flex items-center justify-center mb-6"
                >
                  <Plane className="w-7 h-7 text-white rotate-45" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🚀 Our Vision
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  To become the most trusted travel companion worldwide,
                  connecting travelers to authentic experiences across cultures,
                  landscapes, and lifestyles. We're building a community of
                  explorers united by wanderlust.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#f9fffd] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3ab19d]/5 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#3ab19d] font-semibold text-sm uppercase tracking-wide">
              Why Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Why Travel With Us?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Destinations",
                desc: "Handpicked locations across the globe",
                color: "bg-[#3ab19d]",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Top Rated",
                desc: "Loved by thousands of happy travelers",
                color: "bg-[#ffd166]",
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Secure & Trusted",
                desc: "Safe bookings & transparent pricing",
                color: "bg-[#3ab19d]",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Support",
                desc: "Real people, real help, anytime",
                color: "bg-[#ffd166]",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}
                >
                  {item.icon}
                </motion.div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#3ab19d] font-semibold text-sm uppercase tracking-wide">
              Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Our Story ✨
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3ab19d] via-[#ffd166] to-[#3ab19d]" />

            {[
              {
                year: "2022",
                title: "The Beginning",
                text: "Started with a small idea to simplify travel planning for everyone.",
                icon: <Sparkles className="w-5 h-5" />,
              },
              {
                year: "2023",
                title: "Going Global",
                text: "Expanded to international destinations and custom packages.",
                icon: <Globe className="w-5 h-5" />,
              },
              {
                year: "2024",
                title: "Community Growth",
                text: "Launched social features and travel challenges.",
                icon: <Users className="w-5 h-5" />,
              },
              {
                year: "2025",
                title: "10K+ Travelers",
                text: "Trusted by thousands of travelers worldwide.",
                icon: <Award className="w-5 h-5" />,
              },
            ].map((step, idx) => (
              <motion.div
                key={step.year}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex items-center gap-8 mb-12 ${
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Year badge */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-8 h-8 bg-[#3ab19d] rounded-full flex items-center justify-center text-white z-10"
                >
                  {step.icon}
                </motion.div>

                {/* Content */}
                <div
                  className={`flex-1 ml-16 md:ml-0 ${idx % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 inline-block"
                  >
                    <span className="text-[#3ab19d] font-bold text-lg">
                      {step.year}
                    </span>
                    <h3 className="font-bold text-xl text-gray-900 mt-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{step.text}</p>
                  </motion.div>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#3ab19d] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-80 h-80 border border-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-60 h-60 border border-white/10 rounded-full"
          />
          <FloatingElement delay={0} y={10}>
            <Plane className="absolute top-10 left-20 w-10 h-10 text-white/20 rotate-45" />
          </FloatingElement>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50", suffix: "+", label: "Destinations" },
              { value: "10K", suffix: "+", label: "Happy Travelers" },
              { value: "500", suffix: "+", label: "Custom Packages" },
              { value: "4.9", suffix: "★", label: "Average Rating" },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.h3
                  className="text-4xl sm:text-5xl font-extrabold text-white"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.2, type: "spring" }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </motion.h3>
                <p className="text-white/80 mt-2 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#3ab19d] font-semibold text-sm uppercase tracking-wide">
              What We Believe
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Adventure First",
                desc: "We believe every trip should be an adventure worth remembering.",
                icon: <Mountain className="w-6 h-6" />,
              },
              {
                title: "Community Driven",
                desc: "Travel is better together. We build connections that last.",
                icon: <Heart className="w-6 h-6" />,
              },
              {
                title: "Trust & Transparency",
                desc: "No hidden fees, no surprises. Just honest, reliable service.",
                icon: <CheckCircle className="w-6 h-6" />,
              },
            ].map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-16 h-16 bg-[#3ab19d]/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <span className="text-[#3ab19d]">{value.icon}</span>
                </motion.div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#f9fffd] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#3ab19d]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#ffd166]/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Plane className="w-16 h-16 text-[#3ab19d] mx-auto mb-6 rotate-45" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ready to Explore the World?
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              Let us take care of the planning while you enjoy the journey.
              Start your adventure today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/Signup">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#3ab19d] text-white font-bold rounded-xl hover:bg-[#2c9c8c] transition-colors shadow-lg shadow-[#3ab19d]/30"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/landing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-200 bg-white font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back to Home
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
              <Link
                to="/landing"
                className="hover:text-white transition-colors"
              >
                Home
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
