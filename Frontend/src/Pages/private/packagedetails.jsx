import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Calendar, Hotel, Map } from "lucide-react"
import api from "../../api/axios";
import { useParams } from "react-router-dom";

function PackageDetailsPage() {
  
  const[pkg,setPackage]=useState()
  const [openItinerary, setOpenItinerary] = useState(null)
  const [ openTourist,setOpenTourist]=useState(null)
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


const {id: packageid}=useParams();
console.log(packageid)
useEffect(()=>{
const getPackagebyid=async()=>{
  console.log("function running")
  try{
  const res = await api.get(`/user/explorepackages/${packageid}`)
  console.log(res.data)
  console.log(res.data.message)
  setPackage(res.data.data)
  }
  catch(error){
    console.log(error.response.data.message)
  }
}
getPackagebyid()},[packageid])

if (!pkg) {
  return <div className="mt-20 text-center">Loading package details...</div>;
}
const handleBooking = () => {
    console.log("Booking submitted:", {  ...bookingData });
    alert(`Booking confirmed for ${pkg.title}!`);
    setBookingData({ name: "", email: "", phone: "", travelers: 1, date: "" });
  }
    const handleBargain = () => {
    console.log("Bargain submitted:", { package: pkg.title, ...bargainData });
    alert(`Bargain request submitted for ${pkg.title}! We'll get back to you soon.`);
    setBargainData({ offer: "", duration: "", notes: "" });
  };

  return (
    
    <div className="min-h-screen bg-[#f9fafb] p-6 mt-20 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-10">

          {/* HERO IMAGES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pkg.images.tourist.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:3000/${img}`}
                className="h-64 w-full object-cover rounded-2xl shadow-lg hover:scale-105 transition"
              />
            ))}
          </div>
          <section className="bg-white rounded-2xl shadow-xl p-6">
       <h2 className="text-2xl font-bold mb-4">Description</h2>
       <p>{pkg.description}</p>
          </section>
          <section className=" rounded-2xl p-2 flex gap-10 items-center">
            <div className="flex items-center gap-2">
            <span className="text-sm font-bold">Trip duration:</span>
<div className="p-2 bg-white shadow-md rounded-xl ">{pkg.duration}</div></div>
<div className="flex items-center gap-2">
<span className="text-sm font-bold">booking timeline:</span>
<div className="p-2 bg-white shadow-md  rounded-xl">{pkg.availability.startDate}</div>
<div className="p-2 bg-white shadow-md  rounded-xl">{pkg.availability.endDate}</div>
</div>
<div className="flex items-center gap-2 ">
<span className="text-sm font-bold">Max bookings:</span>
<div className="p-2 bg-white shadow-md rounded-xl">{pkg.availability.maxBookings}</div>
</div>
          </section>

<section className="bg-white rounded-2xl shadow-xl p-6">
<h2 className="text-2xl font-bold mb-4">Tourist Attractions</h2>
{pkg.touristSpots.map((spot,idx)=>(
<div key={idx} className="border-b last:border-none">
  <button onClick={()=>setOpenTourist(openTourist===idx? null:idx)}
  className="w-full flex justify-between items-center py-4 text-left"
  >
       <div className="flex items-center gap-3">
                    <Map className="text-purple-500" />
                    <span className="font-semibold">
                     Name : {spot.spotname}
                    </span>
                       <p className="text-sm text-gray-500">{spot.location}</p>
                  </div>
                  {openTourist ===idx?<ChevronUp /> : <ChevronDown />}
  </button>
  {openTourist === idx && (
                  <p className="pb-4 text-gray-600 leading-relaxed">
                    {spot.description}
                  </p>
                )}
</div>
))}
</section>
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
                      Day {idx+1}: {item.title}
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
                      <p className="text-sm text-gray-500">{hotel.location}</p>
                    </div>
                  </div>
                  {openHotel === idx ? <ChevronUp /> : <ChevronDown />}
                </button>

                {openHotel === idx && (
                  <div className="pb-4 space-y-3">
                    <p className="text-gray-600">{hotel.amenities}</p>
                    <span className="flex items-center gap-2 font-bold">Location:<p className="text-gray-600 font-medium">{hotel.location}</p></span>
                     <span className="flex items-center gap-2 font-bold">Rating:<p className="text-gray-600">{hotel.rating}</p></span> 
                    <div className="flex gap-3">
                      {hotel.hotelImages.map((img, i) => (
                        <img
                          key={i}
                          src={`http://localhost:3000/${img}`}
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
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={bookingData.email}
              onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={bookingData.phone}
              onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
            />
            <input
              type="number"
              min={1}
              value={bookingData.travelers}
              onChange={(e) => setBookingData({ ...bookingData, travelers: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
              placeholder="Number of Travelers"
            />
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
            />
          </div>
          <button
            className="mt-4 w-full bg-[#3ab19d] text-white px-4 py-2 rounded-lg hover:bg-[#4cc9b4] transition duration-300 shadow-md hover:shadow-xl"
            onClick={handleBooking}
          >
            Confirm Booking
          </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 ">
           <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200">
          Negotiate / Bargain
          </h2>
          <div className="flex flex-col gap-3 ">
          <input
            type="number"
            placeholder={`Your Offer (Original: $${pkg.price.originalprice})`}
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
          className="mt-4 bg-[#dda169] text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-300 shadow-md hover:shadow-xl"
          onClick={handleBargain}
        >
          Submit Request
        </button>
          </div>
        </div>
        <section className="bg-white rounded-2xl shadow-xl p-6 w-210">
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
export default PackageDetailsPage