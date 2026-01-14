import { useState} from "react"
import { MapPin, Clock, Sparkles, MessageSquare } from "lucide-react"
import api from "../../api/axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingSchema } from "./schema/bookingSchema"
import { bargainSchema } from "./schema/bargainSchema"

function ExplorePackages() {

  const[pkg,setPackage]=useState([])
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bargainOpen, setBargainOpen] = useState(false)
  const [packageid,setPackageid]=useState(null)
  const[activeFilter,setActiveFilter]=useState(null)
const {register:bookingregister,handleSubmit:bookingsubmit,formState:{errors:bookingerror},reset:bookingreset}=useForm({resolver:zodResolver(bookingSchema)})
  const {register:bargainregister,handleSubmit:bargainsubmit,formState:{errors:bargainerror},reset:bargainreset}=useForm({resolver:zodResolver(bargainSchema)})



const handleBooking = async(data) => {
console.log("handling booking submission ",data)
try {
  const payload={
    ...data,
    packageid
  }
  const res = await api.post("/user/explorepackages/booking",payload)
console.log(res.data?.data)
alert(res.data?.message)
bookingreset()
} catch (error) {
  console.log(error.message)
  alert(error.response?.data?.message)
}

  }
    const handleBargain = async(data) => {
  try {
      const payload={
    ...data,
    packageid
  }
    const res = await api.post("/user/explorepackages/bargain",payload)
    console.log(res.data.data)
    alert(res.data.message)
bargainreset()
  } catch (error) {
    console.log(error)
    alert(error.res.data.message)
  }

  };

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
const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 sm:p-6 ">
      <div className="max-w-7xl mx-auto mt-[5%] pb-10">
    
        <div className="h-80 rounded-3xl mb-10 bg-white shadow-md">
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
      <div className="group border border-1 border-[#3ab19d]/50 rounded-lg overflow-hidden shadow-sm hover:shadow-2xl hover:scale-103 transition duration-300 bg-white" 
     >
        <div className="relative overflow-hidden w-full" style={{ paddingTop: "56%" }}>
          <img
            src={`http://localhost:3000/${pkg.images.coverImage}`}
            alt={pkg.title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
             onClick={()=>{navigate(`/explorepackages/${pkg.id}`)}}
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
            <div className="flex items-center gap-1 text-base font-bold text-green-600">
              <span>{pkg.price.currency}</span>
              <span>{pkg.price.originalPrice}</span>

            </div>
          </div>

          <div className="flex gap-1.5 pt-1">
            <button
              className="flex-1 bg-[#3ab19d] text-white px-2 py-1.5 rounded text-xs flex items-center justify-center gap-1 hover:bg-[#3ab19d]/70 transition"
              onClick={() => {setBookingOpen(true),console.log(pkg.id),setPackageid(pkg.id)}}
            >
              <Sparkles className="w-3 h-3" /> Book
            </button>
            <button
              className="flex-1 border border-gray-300 text-gray-700 px-2 py-1.5 rounded text-xs flex items-center justify-center gap-1 hover:bg-gray-100 transition"
              onClick={() => {setBargainOpen(true),console.log(pkg.id),setPackageid(pkg.id)}}
            >
              <MessageSquare className="w-3 h-3" /> Bargain
            </button>
          </div>
        </div>
      </div>  

      {bookingOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 " onClick={()=>{setBookingOpen(false)}}>
             <div className="bg-white rounded-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"  onClick={e=>e.stopPropagation()}>
              <form onSubmit={bookingsubmit(handleBooking)}>

            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200">
            Book This Package
          </h2>
          <div className="space-y-3">
            <label>Full name : </label>
            <input
              type="text"
              placeholder="Enter your Full Name"
              {...bookingregister("fullname")}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
            />
            {bookingerror.name && <p className="text-[red] text-sm ">{bookingerror.name.message}</p>}
                     <label>Email : </label>
            
            <input
              type="email"
              placeholder="abc@gmail.com"
            {...bookingregister("email")}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
            />
            {bookingerror.email && <p className="text-[red] text-sm">{bookingerror.email.message}</p>}
             <label>Phone: </label>
            <input
              type="tel"
              placeholder="Enter your Phone no"
               {...bookingregister("phone")}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
            />
            {bookingerror.phone && <p className="text-[red] text-sm">{bookingerror.phone.message}</p>}
              <label>Travelers:</label>
            <input
              type="number"
              min={1}
  {...bookingregister("travelers")}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
              placeholder="Number of Travelers"
            />
                     {bookingerror.travelers && <p className="text-[red] text-sm">{bookingerror.travelers.message}</p>}
                        <label>Date:</label>
            <input
              type="date"
        {...bookingregister("date")}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
            />
                            {bookingerror.date && <p className="text-[red] text-sm" >{bookingerror.date.message}</p>}
          </div>
          <button
            className="mt-4 w-full bg-[#3ab19d] text-white px-4 py-2 rounded-lg hover:bg-[#4cc9b4] transition duration-300 shadow-md hover:shadow-xl"
           type="submit"
          >
            Confirm Booking
          </button>
      
</form>
    </div>
        </div>
      )}


      {bargainOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4" onClick={()=>{setBargainOpen(false)}}>
           <div className="bg-white rounded-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto " onClick={(e) => e.stopPropagation()}>
<form onSubmit={bargainsubmit(handleBargain)}>
           <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200">
          Negotiate / Bargain
          </h2>
          <div className="flex flex-col gap-3 ">
            <label className="text-lg font-semibold text-[#4cc9b4]">Original price : {pkg.price.originalPrice}</label> 
          <input
            type="number"
            placeholder={`Your Offer (Original: $${pkg.price.originalPrice})`}
            {...bargainregister("offerprice")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          {bargainerror.offerprice && <p className="text-[red] text-sm">{bargainerror.offerprice.message}</p>}
          <input
            type="text"
            placeholder={`Preferred Duration (Current: ${pkg.duration})`}
     {...bargainregister("offerdate")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
             {bargainerror.offerdate && <p className="text-[red] text-sm">{bargainerror.offerdate.message}</p>}
          <input
            type="text"
            placeholder="Notes / Changes"
            {...bargainregister("notes")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          {bargainerror.notes && <p className="text-[red] text-sm">{bargainerror.notes.message}</p>}
        </div>
        <button
          className="mt-4 bg-[#dda169] text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-300 shadow-md hover:shadow-xl"
        type="submit"
        >
          Submit Request
        </button>
          </form>
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