import { ArrowRight, Globe, Trophy, MessageSquare, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/authContext"

export default function Landing() {
  return (
    <div className="w-full overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8fff9] via-white to-[#f2fffd]">
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-[#3ab19d]/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[25rem] h-[25rem] bg-[#ffd166]/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-[#3ab19d]/10 text-[#2c9c8c] font-semibold text-sm mb-4">
            Travel • Challenges • Social Experiences
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
            Travel isn’t just a trip.  
            <span className="block text-[#3ab19d]">It’s an experience.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover curated travel packages, complete challenges, earn badges,
            share memories, and book unforgettable experiences — all in one place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3ab19d] text-white font-semibold shadow-lg hover:bg-[#2c9c8c] transition"
            replace >
              Explore Packages <ArrowRight />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition"
           replace >
              View Challenges
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            A smarter way to travel
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We combine travel planning, social sharing, and gamified challenges
            into one beautifully designed platform — so every journey becomes
            memorable, meaningful, and rewarding.
          </p>
        </div>
      </section>

      <section className="py-24 bg-[#f9fffd]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            <FeatureCard
              icon={<Globe />}
              title="Curated Packages"
              desc="Handpicked destinations with flexible booking and bargaining options."
            />

            <FeatureCard
              icon={<Trophy />}
              title="Challenges & Badges"
              desc="Complete travel challenges and earn badges for every adventure."
            />

            <FeatureCard
              icon={<MessageSquare />}
              title="Social Travel Feed"
              desc="Share experiences, post memories, and engage with fellow travelers."
            />

            <FeatureCard
              icon={<Sparkles />}
              title="Personalized Journey"
              desc="Save packages, track bookings, and build your travel profile."
            />

          </div>
        </div>
      </section>
      
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How it works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            <Step number="1" title="Explore" desc="Browse curated travel packages and challenges." />
            <Step number="2" title="Book & Share" desc="Book trips, negotiate prices, and post experiences." />
            <Step number="3" title="Earn & Repeat" desc="Complete challenges, earn badges, and travel again." />
          </div>
        </div>
      </section>


      <section className="py-24 bg-gradient-to-r from-[#3ab19d] to-[#2c9c8c] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your next adventure starts here
          </h2>
          <p className="text-white/90 mb-8">
            Join a community of explorers and turn every journey into a story worth telling.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#2c9c8c] font-bold rounded-xl hover:bg-gray-100 transition"
          >
            Get Started <ArrowRight />
          </Link>
        </div>
      </section>

    </div>
  )
}


function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#3ab19d]/10 text-[#3ab19d] mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  )
}

function Step({ number, title, desc }) {
  return (
    <div>
      <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-[#3ab19d] text-white font-bold mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  )
}
