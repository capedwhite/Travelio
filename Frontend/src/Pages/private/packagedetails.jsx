import { useState } from "react"
import { ChevronDown, ChevronUp, Calendar, Hotel } from "lucide-react"

export default function PackageDetailsPage() {
  const [openItinerary, setOpenItinerary] = useState(null)
  const [openHotel, setOpenHotel] = useState(null)
   const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: 1,
    date: ""
  });

  const [bargainData, setBargainData] = useState({
    offer: "",
    duration: "",
    notes: ""
  });

const handleBooking = () => {
    console.log("Booking submitted:", { package: pkg.name, ...bookingData });
    alert(`Booking confirmed for ${pkg.name}!`);
    setBookingData({ name: "", email: "", phone: "", travelers: 1, date: "" });
  }
    const handleBargain = () => {
    console.log("Bargain submitted:", { package: pkg.name, ...bargainData });
    alert(`Bargain request submitted for ${pkg.name}! We'll get back to you soon.`);
    setBargainData({ offer: "", duration: "", notes: "" });
  };


  const pkg = {
    name: "Bali Paradise Escape",
    heroImages: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Beach Resort Check-in",
        description:
          "Arrive in Bali, private airport pickup, welcome drink, and relax at a beachfront resort."
      },
      {
        day: 2,
        title: "Island Hopping & Snorkeling",
        description:
          "Explore nearby islands with guided snorkeling, lunch on the boat, and sunset views."
      },
      {
        day: 3,
        title: "Ubud Cultural Tour",
        description:
          "Visit temples, rice terraces, traditional villages, and enjoy local cuisine."
      }
    ],
    hotels: [
      {
        type: "Luxury Resort",
        name: "Bali Beach Resort",
        details:
          "5-star resort with ocean views, spa, infinity pool, and private beach access.",
        images: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945"
        ]
      },
      {
        type: "Boutique Hotel",
        name: "Ubud Retreat",
        details:
          "Nature-surrounded boutique stay with yoga sessions and organic dining.",
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
        ]
      }
    ],
        inclusions: [
    "Airport pickup and drop-off",
    "Daily breakfast at the hotel",
    "Guided snorkeling tour on Day 2",
    "Cultural tour in Ubud with local guide",
    "All taxes and service charges included"
  ],
    exclusions: [
    "Airport pickup and drop-off",
    "Daily breakfast at the hotel",
    "Guided snorkeling tour on Day 2",
    "Cultural tour in Ubud with local guide",
    "All taxes and service charges included"
  ]
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-10">

          {/* HERO IMAGES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pkg.heroImages.map((img, i) => (
              <img
                key={i}
                src={img}
                className="h-64 w-full object-cover rounded-2xl shadow-lg hover:scale-105 transition"
              />
            ))}
          </div>

          {/* ITINERARY */}
          <section className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Itinerary</h2>

            {pkg.itinerary.map((item, idx) => (
              <div key={idx} className="border-b last:border-none">
                <button
                  onClick={() =>
                    setOpenItinerary(openItinerary === idx ? null : idx)
                  }
                  className="w-full flex justify-between items-center py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="text-green-600" />
                    <span className="font-semibold">
                      Day {item.day}: {item.title}
                    </span>
                  </div>
                  {openItinerary === idx ? <ChevronUp /> : <ChevronDown />}
                </button>
                {openItinerary === idx && (
                  <p className="pb-4 text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* HOTELS */}
          <section className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Hotels</h2>

            {pkg.hotels.map((hotel, idx) => (
              <div key={idx} className="border-b last:border-none">
                <button
                  onClick={() =>
                    setOpenHotel(openHotel === idx ? null : idx)
                  }
                  className="w-full flex justify-between items-center py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Hotel className="text-indigo-600" />
                    <div>
                      <p className="font-semibold">{hotel.name}</p>
                      <p className="text-sm text-gray-500">{hotel.type}</p>
                    </div>
                  </div>
                  {openHotel === idx ? <ChevronUp /> : <ChevronDown />}
                </button>

                {openHotel === idx && (
                  <div className="pb-4 space-y-3">
                    <p className="text-gray-600">{hotel.details}</p>
                    <div className="flex gap-3">
                      {hotel.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="h-32 w-48 object-cover rounded-lg shadow"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
{/* INCLUSIONS & EXCLUSIONS */}


        <div className="space-y-6 sticky top-24 h-fit">
          <div className="bg-white rounded-2xl shadow-xl p-6">
<h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200">
            Book This Package
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={bookingData.name}
              onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={bookingData.email}
              onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={bookingData.phone}
              onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              type="number"
              min={1}
              value={bookingData.travelers}
              onChange={(e) => setBookingData({ ...bookingData, travelers: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Number of Travelers"
            />
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
          <button
            className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 shadow-md hover:shadow-xl"
            onClick={handleBooking}
          >
            Confirm Booking
          </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
 <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200">
          Negotiate / Bargain
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder={`Your Offer (Original: $${pkg.price})`}
            value={bargainData.offer}
            onChange={(e) => setBargainData({ ...bargainData, offer: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder={`Preferred Duration (Current: ${pkg.duration})`}
            value={bargainData.duration}
            onChange={(e) => setBargainData({ ...bargainData, duration: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Notes / Changes"
            value={bargainData.notes}
            onChange={(e) => setBargainData({ ...bargainData, notes: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>
        <button
          className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-300 shadow-md hover:shadow-xl"
          onClick={handleBargain}
        >
          Submit Request
        </button>
          </div>
        </div>
        <section className="bg-white rounded-2xl shadow-xl p-6">
  <h2 className="text-2xl font-bold mb-4">Inclusions</h2>
  <ul className="list-disc list-inside space-y-2 text-gray-700">
    {pkg.inclusions?.length > 0 ? (
      pkg.inclusions.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))
    ) : (
      <li>Details not provided</li>
    )}
  </ul>

  <h2 className="text-2xl font-bold mt-6 mb-4">Exclusions</h2>
  <ul className="list-disc list-inside space-y-2 text-gray-700">
    {pkg.exclusions?.length > 0 ? (
      pkg.exclusions.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))
    ) : (
      <li>Details not provided</li>
    )}
  </ul>
</section>
      </div>
      
    </div>
  )
}
