import { Globe, Users, Star, ShieldCheck, Plane } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-gray-50">

      {/* HERO */}
      <section className="bg-gradient-to-r from-[#3ab19d] to-[#1f7a6b] text-white py-20 px-6 text-center mt-[5%]">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
Turning Trips Into Memories 
        </h1>
        <p className="max-w-3xl mx-auto text-lg opacity-90">
          We don’t just plan trips — we create unforgettable memories,
          one destination at a time.
        </p>
      </section>

      {/* MISSION & VISION */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">🎯 Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to make travel simple, affordable, and magical.
            From curated vacation packages to seamless bookings, we ensure
            every journey feels personal and stress-free.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">🚀 Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To become the most trusted travel companion worldwide,
            connecting travelers to authentic experiences across cultures,
            landscapes, and lifestyles.
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Travel With Us?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Globe className="w-8 h-8 text-[#3ab19d]" />,
                title: "Global Destinations",
                desc: "Handpicked locations across the globe",
              },
              {
                icon: <Star className="w-8 h-8 text-[#3ab19d]" />,
                title: "Top Rated Experiences",
                desc: "Loved by thousands of happy travelers",
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-[#3ab19d]" />,
                title: "Secure & Trusted",
                desc: "Safe bookings & transparent pricing",
              },
              {
                icon: <Users className="w-8 h-8 text-[#3ab19d]" />,
                title: "Expert Support",
                desc: "Real people, real help, anytime",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Story 
        </h2>

        <div className="space-y-8">
          {[
            {
              year: "2022",
              text: "Started with a small idea to simplify travel planning.",
            },
            {
              year: "2023",
              text: "Expanded to international destinations and custom packages.",
            },
            {
              year: "2024",
              text: "Trusted by thousands of travelers worldwide.",
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="flex gap-6 items-start"
            >
              <div className="font-bold text-[#3ab19d] text-lg w-16">
                {step.year}
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm w-full">
                <p className="text-gray-700">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#1f7a6b] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50+", label: "Destinations" },
            { value: "10K+", label: "Happy Travelers" },
            { value: "500+", label: "Custom Packages" },
            { value: "4.9★", label: "Average Rating" },
          ].map((stat, idx) => (
            <div key={idx}>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Explore the World?
        </h2>
        <p className="text-gray-600 mb-6">
          Let us take care of the planning while you enjoy the journey.
        </p>
        <button className="bg-[#3ab19d] hover:bg-[#329b8a] text-white px-8 py-3 rounded-full font-semibold transition">
          Explore Packages ✈️
        </button>
      </section>

    </div>
  );
}
