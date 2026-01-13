import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Calendar, Hotel, Map } from "lucide-react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bargainSchema } from "./schema/bargainSchema";
import { bookingSchema } from "./schema/bookingSchema";

function PackageDetailsPage() {
  const [pkg, setPackage] = useState();
  const [openItinerary, setOpenItinerary] = useState(null);
  const [openTourist, setOpenTourist] = useState(null);
  const [openHotel, setOpenHotel] = useState(null);
  const {
    register: bookingregister,
    handleSubmit: bookingsubmit,
    formState: { errors: bookingerror },
  } = useForm({ resolver: zodResolver(bookingSchema) });
  const {
    register: bargainregister,
    handleSubmit: bargainsubmit,
    formState: { errors: bargainerror },
  } = useForm({ resolver: zodResolver(bargainSchema) });

  const { id: packageid } = useParams();
  console.log(packageid);
  useEffect(() => {
    const getPackagebyid = async () => {
      console.log("function running");
      try {
        const res = await api.get(`/user/explorepackages/${packageid}`);
        console.log(res.data);
        console.log(res.data.message);
        setPackage(res.data.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getPackagebyid();
  }, [packageid]);

  if (!pkg) {
    return <div className="mt-20 text-center">Loading package details...</div>;
  }
  const handleBooking = async (data) => {
    console.log("handling booking submission ", data);
    try {
      const payload = {
        ...data,
        packageid,
      };
      const res = await api.post("/user/explorepackages/booking", payload);
      console.log(res.data?.data);
      alert(res.data?.message);
    } catch (error) {
      console.log(error.message);
      alert(error.response?.data?.message);
    }
  };
  const handleBargain = async (data) => {
    try {
      const payload = {
        ...data,
        packageid,
      };
      const res = await api.post("/user/explorepackages/bargain", payload);
      console.log(res.data.data);
      alert(res.data.message);
    } catch (error) {
      console.log(error);
      alert(error.res.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6 mt-20 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
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
              <div className="p-2 bg-white shadow-md rounded-xl ">
                {pkg.duration}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">booking timeline:</span>
              <div className="p-2 bg-white shadow-md  rounded-xl">
                {pkg.availability.startDate}
              </div>
              <div className="p-2 bg-white shadow-md  rounded-xl">
                {pkg.availability.endDate}
              </div>
            </div>
            <div className="flex items-center gap-2 ">
              <span className="text-sm font-bold">Max bookings:</span>
              <div className="p-2 bg-white shadow-md rounded-xl">
                {pkg.availability.maxBookings}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Tourist Attractions</h2>
            {pkg.touristSpots.map((spot, idx) => (
              <div key={idx} className="border-b last:border-none">
                <button
                  onClick={() =>
                    setOpenTourist(openTourist === idx ? null : idx)
                  }
                  className="w-full flex justify-between items-center py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Map className="text-purple-500" />
                    <span className="font-semibold">
                      Name : {spot.spotname}
                    </span>
                    <p className="text-sm text-gray-500">{spot.location}</p>
                  </div>
                  {openTourist === idx ? <ChevronUp /> : <ChevronDown />}
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
                      Day {idx + 1}: {item.title}
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
                  onClick={() => setOpenHotel(openHotel === idx ? null : idx)}
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
                    <span className="flex items-center gap-2 font-bold">
                      Location:
                      <p className="text-gray-600 font-medium">
                        {hotel.location}
                      </p>
                    </span>
                    <span className="flex items-center gap-2 font-bold">
                      Rating:<p className="text-gray-600">{hotel.rating}</p>
                    </span>
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
          <form onSubmit={bookingsubmit(handleBooking)}>
            <div className="bg-white rounded-2xl shadow-xl p-6">
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
                {bookingerror.name && (
                  <p className="text-[red] text-sm ">
                    {bookingerror.name.message}
                  </p>
                )}
                <label>Email : </label>

                <input
                  type="email"
                  placeholder="Enter your Email"
                  {...bookingregister("email")}
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
                />
                {bookingerror.email && (
                  <p className="text-[red] text-sm">
                    {bookingerror.email.message}
                  </p>
                )}
                <label>Phone: </label>
                <input
                  type="tel"
                  placeholder="Enter your Phone no"
                  {...bookingregister("phone")}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
                />
                {bookingerror.phone && (
                  <p className="text-[red] text-sm">
                    {bookingerror.phone.message}
                  </p>
                )}
                <label>Travelers:</label>
                <input
                  type="number"
                  min={1}
                  {...bookingregister("travelers")}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
                  placeholder="Number of Travelers"
                />
                {bookingerror.travelers && (
                  <p className="text-[red] text-sm">
                    {bookingerror.travelers.message}
                  </p>
                )}
                <label>Date:</label>
                <input
                  type="date"
                  {...bookingregister("date")}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4cc9b4] focus:outline-none"
                />
                {bookingerror.date && (
                  <p className="text-[red] text-sm">
                    {bookingerror.date.message}
                  </p>
                )}
              </div>
              <button
                className="mt-4 w-full bg-[#3ab19d] text-white px-4 py-2 rounded-lg hover:bg-[#4cc9b4] transition duration-300 shadow-md hover:shadow-xl"
                type="submit"
              >
                Confirm Booking
              </button>
            </div>
          </form>
          <form onSubmit={bargainsubmit(handleBargain)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 ">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200">
                Negotiate / Bargain
              </h2>
              <div className="flex flex-col gap-3 ">
                <label className="text-lg font-semibold text-[#4cc9b4]">
                  Original price : {pkg.price.originalPrice}
                </label>
                <input
                  type="number"
                  placeholder={`Your Offer (Original: $${pkg.price.originalPrice})`}
                  {...bargainregister("offerprice")}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
                {bargainerror.offerprice && (
                  <p className="text-[red] text-sm">
                    {bargainerror.offerprice.message}
                  </p>
                )}
                <input
                  type="text"
                  placeholder={`Preferred Duration (Current: ${pkg.duration})`}
                  {...bargainregister("offerdate")}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
                {bargainerror.offerdate && (
                  <p className="text-[red] text-sm">
                    {bargainerror.offerdate.message}
                  </p>
                )}
                <input
                  type="text"
                  placeholder="Notes / Changes"
                  {...bargainregister("notes")}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
                {bargainerror.notes && (
                  <p className="text-[red] text-sm">
                    {bargainerror.notes.message}
                  </p>
                )}
              </div>
              <button
                className="mt-4 bg-[#dda169] text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-300 shadow-md hover:shadow-xl"
                type="submit"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-6 w-210">
          <h2 className="text-2xl font-bold mb-4">Inclusions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {pkg.inclusions?.length > 0 ? (
              pkg.inclusions.map((item, idx) => <li key={idx}>{item}</li>)
            ) : (
              <li>Details not provided</li>
            )}
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">Exclusions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {pkg.exclusions?.length > 0 ? (
              pkg.exclusions.map((item, idx) => <li key={idx}>{item}</li>)
            ) : (
              <li>Details not provided</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
export default PackageDetailsPage;
