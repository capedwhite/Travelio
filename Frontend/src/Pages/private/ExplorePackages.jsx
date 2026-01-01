import { useState } from "react"
import { MapPin, Clock, DollarSign, Sparkles, MessageSquare } from "lucide-react"

// Fake Database
const pkg = [
  {
    id: 1,
    name: "Bali Paradise Escape",
    location: "Bali, Indonesia",
    duration: "5 Days 4 Nights",
    price: 899,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop",
    discount: "20% OFF",
    tag: "Popular"
  },
  {
    id: 2,
    name: "Swiss Alps Adventure",
    location: "Interlaken, Switzerland",
    duration: "7 Days 6 Nights",
    price: 1599,
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop",
    discount: "15% OFF",
    tag: "Premium"
  },
  {
    id: 3,
    name: "Maldives Beach Resort",
    location: "Male, Maldives",
    duration: "4 Days 3 Nights",
    price: 1299,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop",
    tag: "Luxury"
  },
  {
    id: 4,
    name: "Tokyo Culture Tour",
    location: "Tokyo, Japan",
    duration: "6 Days 5 Nights",
    price: 1099,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop",
    discount: "10% OFF",
    tag: "Cultural"
  },
  {
    id: 5,
    name: "Santorini Sunset Getaway",
    location: "Santorini, Greece",
    duration: "5 Days 4 Nights",
    price: 1199,
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&auto=format&fit=crop",
    tag: "Romantic"
  },
  {
    id: 6,
    name: "Safari Wildlife Experience",
    location: "Serengeti, Tanzania",
    duration: "8 Days 7 Nights",
    price: 2199,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop",
    discount: "25% OFF",
    tag: "Adventure"
  },
  {
    id: 7,
    name: "Paris City Lights",
    location: "Paris, France",
    duration: "4 Days 3 Nights",
    price: 1049,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
    tag: "Romantic"
  },
  {
    id: 8,
    name: "Dubai Luxury Tour",
    location: "Dubai, UAE",
    duration: "5 Days 4 Nights",
    price: 1399,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop",
    discount: "18% OFF",
    tag: "Luxury"
  }
]

function ExplorePackages() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bargainOpen, setBargainOpen] = useState(false)
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: 1,
    date: ""
  })
  const [bargainData, setBargainData] = useState({
    offer: "",
    duration: "",
    notes: ""
  })

  const handleBooking = () => {
    console.log("Booking submitted:", { package: pkg.name, ...bookingData })
    alert(`Booking confirmed for ${pkg.name}!`)
    setBookingOpen(false)
    setBookingData({ name: "", email: "", phone: "", travelers: 1, date: "" })
  }

  const handleBargain = () => {
    console.log("Bargain submitted:", { package: pkg.name, ...bargainData })
    alert(`Bargain request submitted for ${pkg.name}! We'll get back to you soon.`)
    setBargainOpen(false)
    setBargainData({ offer: "", duration: "", notes: "" })
  }
  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 sm:p-6 ">
      <div className="max-w-7xl mx-auto mt-[5%] pb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Explore Packages</h1>
        <p className="text-gray-600 mb-6">Discover amazing travel destinations and book your dream vacation</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pkg.map((pkg) => (
   <>
      <div className="group border border-1 border-[#3ab19d]/50 rounded-lg overflow-hidden shadow-sm hover:shadow-2xl hover:scale-103 transition duration-300 bg-white">
        <div className="relative overflow-hidden w-full" style={{ paddingTop: "56%" }}>
          <img
            src={pkg.image}
            alt={pkg.name}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {pkg.discount && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
              {pkg.discount}
            </div>
          )}
          {pkg.tag && (
            <div className="absolute top-2 left-2 bg-[#ffea00] text-black text-xs px-1.5 py-0.5 rounded">
              {pkg.tag}
            </div>
          )}
        </div>

        <div className="p-3 space-y-2">
          <div>
            <h3 className="text-sm font-semibold leading-tight line-clamp-1">{pkg.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{pkg.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{pkg.duration}</span>
            </div>
            <div className="flex items-center gap-0.5 text-base font-bold text-green-600">
              <DollarSign className="w-4 h-4" />
              <span>{pkg.price}</span>
            </div>
          </div>

          <div className="flex gap-1.5 pt-1">
            <button
              className="flex-1 bg-[#3ab19d] text-white px-2 py-1.5 rounded text-xs flex items-center justify-center gap-1 hover:bg-[#3ab19d]/70 transition"
              onClick={() => setBookingOpen(true)}
            >
              <Sparkles className="w-3 h-3" /> Book
            </button>
            <button
              className="flex-1 border border-gray-300 text-gray-700 px-2 py-1.5 rounded text-xs flex items-center justify-center gap-1 hover:bg-gray-100 transition"
              onClick={() => setBargainOpen(true)}
            >
              <MessageSquare className="w-3 h-3" /> Bargain
            </button>
          </div>
        </div>
      </div>  

      {bookingOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">Book {pkg.name}</h2>
            <p className="text-gray-600 mb-4">Fill out your details to book this amazing package</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={bookingData.name}
                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={bookingData.email}
                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={bookingData.phone}
                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Number of Travelers"
                min={1}
                value={bookingData.travelers}
                onChange={(e) => setBookingData({ ...bookingData, travelers: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100 transition"
                onClick={() => setBookingOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#369d8c] text-white px-4 py-2 rounded hover:bg-[#369d8c]/20 transition"
                onClick={handleBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bargain Modal */}
      {bargainOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">Negotiate Package</h2>
            <p className="text-gray-600 mb-4">Request a custom price or package modification</p>
            <div className="space-y-3">
              <input
                type="number"
                placeholder={`Your Offer (Original: $${pkg.price})`}
                value={bargainData.offer}
                onChange={(e) => setBargainData({ ...bargainData, offer: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder={`Preferred Duration (Current: ${pkg.duration})`}
                value={bargainData.duration}
                onChange={(e) => setBargainData({ ...bargainData, duration: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                placeholder="Any specific changes you'd like to make..."
                value={bargainData.notes}
                onChange={(e) => setBargainData({ ...bargainData, notes: e.target.value })}
                className="w-full border rounded px-3 py-2 min-h-[6rem]"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100 transition"
                onClick={() => setBargainOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={handleBargain}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
          ))}
        </div>
      </div>
    </div>
  )
}
export default ExplorePackages