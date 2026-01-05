import { useState } from "react"
import { MapPin, Clock, DollarSign, Sparkles, MessageSquare } from "lucide-react"
import api from "../../api/axios"
import { useEffect } from "react"

function ExplorePackages() {
  const[pkg,setPackage]=useState([])
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
    const [activeFilter, setActiveFilter] = useState("All");
  const handleBargain = () => {
    console.log("Bargain submitted:", { package: pkg.name, ...bargainData })
    alert(`Bargain request submitted for ${pkg.name}! We'll get back to you soon.`)
    setBargainOpen(false)
    setBargainData({ offer: "", duration: "", notes: "" })

  }
  useEffect(()=>{
  const getallpackages= async()=>{
    try {
          const res = await api.get("/user/explorepackages")
          console.log(res.data.data)
          console.log(res.data.message)
          setPackage(res.data.data)
    } catch (error) {
      console.log(error)
      console.log(error.res.data.message)
    }
  }
getallpackages()},[])

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 sm:p-6 ">
      <div className="max-w-7xl mx-auto mt-[5%] pb-10">
    
        <div className="h-80 rounded-3xl mb-10 bg-amber-900">
<img></img>
        </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Explore Packages</h1>
        <p className="text-gray-600 mb-6">Discover amazing travel destinations and book your dream vacation</p>
        <div className="w-200 rounded-xl h-9 bg-gray-100  border-1 border-gray-200 mb-4 p-1 gap-2 flex justify-center items-center ">
 {["All", "Adventure", "Popular", "Luxury", "Budget"].map((filter) => (
    <div
      key={filter}
      onClick={() => setActiveFilter(filter)}
      className={`w-[20%] h-full rounded-lg flex justify-center items-center p-3 cursor-pointer transition
        ${
          activeFilter === filter
            ? "bg-white text-[#3ab19d] shadow font-bold"
            : "hover:bg-white text-gray-700"
        }
      `}
    >
      <span className="text-sm">{filter}</span>
    </div>
  ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pkg.map((pkg) => (
   <>
      <div className="group border border-1 border-[#3ab19d]/50 rounded-lg overflow-hidden shadow-sm hover:shadow-2xl hover:scale-103 transition duration-300 bg-white">
        <div className="relative overflow-hidden w-full" style={{ paddingTop: "56%" }}>
          <img
            src={`http://localhost:3000/${pkg.images.coverImage}`}
            alt={pkg.title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {pkg.seasonalDiscount.label && (
            <>
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
              {pkg.seasonalDiscount.label}
            </div>
                    <div className="absolute top-8 right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
              {pkg.seasonalDiscount.percentage+"%"}
            </div>
            </>
            
          )}
          {pkg.tags && (
            <div className="absolute top-2 left-2 bg-[#ffea00] text-black text-xs px-1.5 py-0.5 rounded ">
              {pkg.tags.map((tag)=>(
              tag
              ))}
            </div>
          )}
        </div>

        <div className="p-3 space-y-2">
          <div>
            <h3 className="text-sm font-semibold leading-tight line-clamp-1">{pkg.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{pkg.locations.city}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{pkg.duration}</span>
            </div>
            <div className="flex items-center gap-0.5 text-base font-bold text-green-600">
              <DollarSign className="w-4 h-4" />
              <span>{pkg.price.originalPrice}</span>

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