import { useState } from "react";
import AdminSidebar from "../../components/Adminnavbar";
import api from "../../api/axios";
const buildPackageFormData = (packageData) => {
  const formData = new FormData();

  formData.append("basicInfo", JSON.stringify(packageData.basicInfo));
  formData.append("pricing", JSON.stringify(packageData.pricing));
  formData.append("locations", JSON.stringify(packageData.locations));
  formData.append("hotels", JSON.stringify(packageData.hotels));
  formData.append("touristSpots", JSON.stringify(packageData.touristSpots));
  formData.append("itinerary", JSON.stringify(packageData.itinerary));
  formData.append("availability", JSON.stringify(packageData.availability));

  if (packageData.media.coverImage) {
    formData.append("coverImage", packageData.media.coverImage);
  }

packageData.hotels?.forEach((hotel,hotelIndex) => {
  hotel.hotelImages?.forEach((file) => {
    formData.append(`hotelImages[${hotelIndex}]`, file);
  })});

  packageData.media.touristLocationImages.forEach((file) => {
    formData.append("touristImages", file);
  });

  return formData;
};
 function CreatePackage() {
  const [active, setActive] = useState("Basic Info");
  const [packageData, setPackageData] = useState({
    basicInfo: {
      title: "",
      description: "",
      tag: "Budget Friendly",
      duration: "",
    },
    pricing: {
      originalPrice: "",
      discountedPrice: "",
      currency: "USD",
      label: "",
      discountpercentage: "",
    },
    locations: {
      country: "",
      city: "",
      pickup: "",
      notes: "",
    },
    touristSpots: [
      { spotname: "", location: "", description: ""},
    ],
    itinerary: [{ title: "", description: "" }],
    hotels: [
      { name: "", location: "", rating: "", amenities: "", hotelImages: [] },
    ],
    availability: {
      startDate: "",
      endDate: "",
      maxBookings: "",
      inclusion: "",
      exclusion: "",
    },
    media: {
      coverImage: null,
      touristLocationImages: [],
    },
  });

  const renderSection = () => {
    switch (active) {
      case "Basic Info":
        return (
          <BasicInfoSection
            data={packageData.basicInfo}
            setPackageData={setPackageData}
          />
        );
      case "Pricing":
        return (
          <PricingSection
            price={packageData.pricing}
            setPackageData={setPackageData}
          />
        );
      case "Locations":
        return (
          <LocationsSection
            data={packageData.locations}
            setPackageData={setPackageData}
          />
        );
      case "Hotels":
        return (
          <HotelsSection
            hotels={packageData.hotels}
            setPackageData={setPackageData}
          />
        );
      case "Tourist Spots":
        return (
          <TouristSpotsSection
            spots={packageData.touristSpots}
            setPackageData={setPackageData}
          />
        );
      case "Itinerary":
        return (
          <ItinerarySection
            itinerary={packageData.itinerary}
            setPackageData={setPackageData}
          />
        );
      case "Media":
        return (
          <MediaSection
            data={packageData.media}
            setPackageData={setPackageData}
          />
        );
      case "Availability":
        return (
          <AvailabilitySection
            data={packageData.availability}
            setPackageData={setPackageData}
          />
        );
      case "Publish":
        return <PublishSection packageData={packageData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <AdminSidebar />
      <div className="ml-64 p-8 bg-[#f8fafc] min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Create New Package</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow p-4 space-y-2">
            {[
              "Basic Info",
              "Pricing",
              "Locations",
              "Hotels",
              "Tourist Spots",
              "Itinerary",
              "Media",
              "Availability",
              "Publish",
            ].map((step) => (
              <button
                key={step}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  active === step ? "bg-[#3ab19d]/10" : "hover:bg-[#3ab19d]/10"
                }`}
                onClick={() => setActive(step)}
              >
                {step}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl shadow p-8">
            {renderSection()}
          </div>
        </div>
      </div>
    </>
  );
}
function BasicInfoSection({ data, setPackageData }) {
  const tags = [
    "Budget Friendly",
    "Adventure Package",
    "Luxury",
    "Family Friendly",
    "Honeymoon Special",
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Basic Information</h2>

      <input
        className="w-full p-3 border rounded-lg"
        placeholder="Package Title"
        value={data.title}
        onChange={(e) =>
          setPackageData((prev) => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, title: e.target.value },
          }))
        }
      />
      <input
        className="w-full p-3 border rounded-lg"
        placeholder="Package Time duration"
        value={data.duration}
        onChange={(e) =>
          setPackageData((prev) => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, duration: e.target.value },
          }))
        }
      />

      <textarea
        rows={5}
        className="w-full p-3 border rounded-lg"
        placeholder="Description"
        value={data.description}
        onChange={(e) =>
          setPackageData((prev) => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, description: e.target.value },
          }))
        }
      />

      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            onClick={() =>
              setPackageData((prev) => ({
                ...prev,
                basicInfo: { ...prev.basicInfo, tag },
              }))
            }
            className={`px-3 py-1 border rounded-full text-sm cursor-pointer ${
              data.tag === tag ? "bg-[#3ab19d]/40" : ""
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
function AvailabilitySection({ data, setPackageData }) {
  const updateAvailability = (field, value) => {
    setPackageData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Availability</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            className="p-3 border rounded-lg w-full mt-2"
            value={data.startDate}
            onChange={(e) => updateAvailability("startDate", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            className="p-3 border rounded-lg w-full mt-2"
            value={data.endDate}
            onChange={(e) => updateAvailability("endDate", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Max Bookings</label>
        <input
          type="number"
          className="p-3 border rounded-lg w-full mt-2"
          placeholder="Max number of bookings"
          value={data.maxBookings}
          onChange={(e) => updateAvailability("maxBookings", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Inclusion</label>
        <textarea
          rows={3}
          className="p-3 border rounded-lg w-full mt-2"
          placeholder="What's included in the package"
          value={data.inclusion}
          onChange={(e) => updateAvailability("inclusion", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Exclusion</label>
        <textarea
          rows={3}
          className="p-3 border rounded-lg w-full mt-2"
          placeholder="What's not included in the package"
          value={data.exclusion}
          onChange={(e) => updateAvailability("exclusion", e.target.value)}
        />
      </div>
    </div>
  );
}

function ItinerarySection({ itinerary, setPackageData }) {
  const addDay = () => {
    setPackageData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { title: "", description: "" }],
    }));
  };

  const updateDay = (index, field, value) => {
    setPackageData((prev) => {
      const updated = [...prev.itinerary];
      updated[index][field] = value;
      return { ...prev, itinerary: updated };
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Itinerary</h2>

      {itinerary.map((day, index) => (
        <div key={index} className="border rounded-xl p-4 space-y-3">
          <input
            className="p-3 border rounded-lg w-full"
            placeholder={`Day ${index + 1} Title`}
            value={day.title}
            onChange={(e) => updateDay(index, "title", e.target.value)}
          />

          <textarea
            rows={4}
            className="p-3 border rounded-lg w-full"
            placeholder="Describe activities..."
            value={day.description}
            onChange={(e) => updateDay(index, "description", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addDay} className="text-[#3ab19d] font-medium">
        + Add Another Day
      </button>
    </div>
  );
}
function TouristSpotsSection({ spots, setPackageData }) {
  const addSpot = () => {
    setPackageData((prev) => ({
      ...prev,
      touristSpots: [
        ...prev.touristSpots,
        { spotname: "", location: "", description: "" },
      ],
    }));
  };
  const removetourist = (index) => {
    setPackageData((prev) => ({
      ...prev,
      touristSpots: prev.touristSpots.filter((_, i) => i !== index),
    }));
  };
  const updateSpot = (index, field, value) => {
    setPackageData((prev) => {
      const updated = [...prev.touristSpots];
      updated[index][field] = value;
      return { ...prev, touristSpots: updated };
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Tourist Spots</h2>

      {spots.map((spot, index) => (
        <div key={index} className="border rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">tourist spot{index + 1}</h3>
            {spots.length > 1 && (
              <button
                className="text-red-500 text-sm"
                onClick={() => removetourist(index)}
              >
                Remove
              </button>
            )}
          </div>
          <input
            className="p-3 border rounded-lg w-full"
            placeholder="Spot Name"
            value={spot.spotname}
            onChange={(e) => updateSpot(index, "spotname", e.target.value)}
          />

          <input
            className="p-3 border rounded-lg w-full"
            placeholder="Location"
            value={spot.location}
            onChange={(e) => updateSpot(index, "location", e.target.value)}
          />
          <textarea
            rows={3}
            className="p-3 border rounded-lg w-full"
            placeholder="Description"
            value={spot.description}
            onChange={(e) => updateSpot(index, "description", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addSpot} className="text-[#3ab19d] font-medium">
        + Add Another Tourist Spot
      </button>
    </div>
  );
}
function MediaSection({ data, setPackageData }) {
  const removeImage = (type, index) => {
    setPackageData((prev) => {
      const updated = [...prev.media[type]];
      updated.splice(index, 1);

      return {
        ...prev,
        media: {
          ...prev.media,
          [type]: updated,
        },
      };
    });
  };

  const addMultipleImages = (type, files) => {
    setPackageData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        [type]: [...prev.media[type], ...Array.from(files)],
      },
    }));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Media</h2>
      <div className="border rounded-xl p-4 space-y-3">
        <h3 className="font-medium">Cover Image</h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setPackageData((prev) => ({
              ...prev,
              media: {
                ...prev.media,
                coverImage: e.target.files[0],
              },
            }))
          }
        />

        {data.coverImage && (
          <div className="relative">
            <img
              src={URL.createObjectURL(data.coverImage)}
              alt="Cover Preview"
              className="h-48 w-full object-cover rounded-lg mt-2"
            />
            <button
              onClick={() =>
                setPackageData((prev) => ({
                  ...prev,
                  media: { ...prev.media, coverImage: null },
                }))
              }
              className="absolute top-2 right-2 bg-white text-red-500 px-2 py-1 rounded shadow"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="border rounded-xl p-4 space-y-3">
        <h3 className="font-medium">Tourist Location Images</h3>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            addMultipleImages("touristLocationImages", e.target.files)
          }
        />

        {data.touristLocationImages.length > 0 && (
          <ul className="space-y-2 mt-3">
            {data.touristLocationImages.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center border px-3 py-2 rounded-lg text-sm"
              >
                <span className="truncate">{file.name}</span>
                <button
                  onClick={() => removeImage("touristLocationImages", index)}
                  className="text-red-500 font-medium"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function HotelsSection({ hotels, setPackageData }) {
  const addHotel = () =>
    setPackageData((prev) => ({
      ...prev,
      hotels: [
        ...prev.hotels,
        { name: "", location: "", rating: "", amenities: "", hotelImages: [] },
      ],
    }));
  const removeHotel = (index) =>
    setPackageData((prev) => ({
      ...prev,
      hotels: prev.hotels.filter((_, i) => i !== index),
    }));
  const updateHotel = (index, field, value) =>
    setPackageData((prev) => {
      const updatedHotels = [...prev.hotels];
      updatedHotels[index] = { ...updatedHotels[index], [field]: value };
      return { ...prev, hotels: updatedHotels };
    });
  const addHotelImages = (hotelIndex, files) =>
    setPackageData((prev) => {
      const updatedHotels = [...prev.hotels];
      updatedHotels[hotelIndex].hotelImages.push(...Array.from(files));
      return { ...prev, hotels: updatedHotels };
    });
  const removeHotelImage = (hotelIndex, imageIndex) =>
    setPackageData((prev) => {
      const updatedHotels = [...prev.hotels];
      const updatedImages = [...updatedHotels[hotelIndex].hotelImages];
      updatedImages.splice(imageIndex, 1);
      updatedHotels[hotelIndex] = {
        ...updatedHotels[hotelIndex],
        hotelImages: updatedImages,
      };
      return { ...prev, hotels: updatedHotels };
    });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Hotels</h2>
      {hotels.map((hotel, index) => (
        <div key={index} className="border rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Hotel {index + 1}</h3>
            {hotels.length > 1 && (
              <button
                className="text-red-500 text-sm"
                onClick={() => removeHotel(index)}
              >
                Remove
              </button>
            )}
          </div>
          <input
            className="p-3 border rounded-lg w-full"
            placeholder="Hotel Name"
            value={hotel.name}
            onChange={(e) => updateHotel(index, "name", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              className="p-3 border rounded-lg"
              placeholder="Location"
              value={hotel.location}
              onChange={(e) => updateHotel(index, "location", e.target.value)}
            />
            <input
              className="p-3 border rounded-lg"
              placeholder="Rating (5 Star)"
              value={hotel.rating}
              onChange={(e) => updateHotel(index, "rating", e.target.value)}
            />
          </div>
          <input
            className="p-3 border rounded-lg w-full"
            placeholder="Room Type / Amenities"
            value={hotel.amenities}
            onChange={(e) => updateHotel(index, "amenities", e.target.value)}
          />
          <div className="border rounded-xl p-4 space-y-3">
            <h3 className="font-medium">Hotel Images</h3>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => addHotelImages(index, e.target.files)}
            />
            {hotel.hotelImages.length > 0 && (
              <ul className="space-y-2 mt-3">
                {hotel.hotelImages.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center border px-3 py-2 rounded-lg text-sm"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      onClick={() => removeHotelImage(index, idx)}
                      className="text-red-500 font-medium"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
      <button className="text-[#3ab19d] font-medium" onClick={addHotel}>
        + Add Another Hotel
      </button>
    </div>
  );
}

function PublishSection({ packageData }) {
  const handlePublish = async () => {
    try {
      const formData = buildPackageFormData(packageData);

      const res = await api.post("admin/addpackages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert(res.data.message);
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create package");
    }
  };

  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-semibold">Ready to Publish?</h2>
      <button
        onClick={handlePublish}
        className="bg-[#3ab19d] text-white px-8 py-3 rounded-xl"
      >
        Create Package
      </button>
    </div>
  );
}
function LocationsSection({ data, setPackageData }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Locations</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="p-3 border rounded-lg"
          placeholder="Country"
          value={data.country}
          onChange={(e) =>
            setPackageData((prev) => ({
              ...prev,
              locations: {
                ...prev.locations,
                country: e.target.value,
              },
            }))
          }
        />

        <input
          className="p-3 border rounded-lg"
          placeholder="City / Region"
          value={data.city}
          onChange={(e) =>
            setPackageData((prev) => ({
              ...prev,
              locations: {
                ...prev.locations,
                city: e.target.value,
              },
            }))
          }
        />
      </div>

      <input
        className="p-3 border rounded-lg w-full"
        placeholder="Pickup Location"
        value={data.pickup}
        onChange={(e) =>
          setPackageData((prev) => ({
            ...prev,
            locations: {
              ...prev.locations,
              pickup: e.target.value,
            },
          }))
        }
      />

      <textarea
        rows={4}
        className="p-3 border rounded-lg w-full"
        placeholder="Additional notes"
        value={data.notes}
        onChange={(e) =>
          setPackageData((prev) => ({
            ...prev,
            locations: {
              ...prev.locations,
              notes: e.target.value,
            },
          }))
        }
      />
    </div>
  );
}

function PricingSection({ price, setPackageData }) {
  const calculateDiscountedPrice = (original, percent) => {
    const orig = parseFloat(original);
    const discount = parseFloat(percent);
    if (isNaN(orig) || isNaN(discount)) return "";
    return (orig - (orig * discount) / 100).toFixed(2);
  };
   const handleOriginalPriceChange = (value) => {
    setPackageData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        originalPrice: value,
        // recalc discounted price if discount percentage exists
        discountedPrice: calculateDiscountedPrice(value, prev.pricing.discountpercentage)
      }
    }));
  };
    const handleDiscountPercentageChange = (value) => {
    setPackageData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        discountpercentage: value,
        discountedPrice: calculateDiscountedPrice(prev.pricing.originalPrice, value)
      }
    }));
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Pricing & Discounts</h2>{" "}
      <div className="grid grid-cols-2 gap-4">
        <input
          className="p-3 border rounded-lg"
          placeholder="Original Price"
          value={price.originalPrice}
          onChange={e => handleOriginalPriceChange(e.target.value)}
        />
        <input
          className="p-3 border rounded-lg"
          placeholder="Discounted Price"
          value={price.discountedPrice}
 readOnly
        />
      </div>
      <select
        className="p-3 border rounded-lg w-40"
        value={price.currency}
        onChange={(e) => {
          setPackageData((prev) => ({
            ...prev,
            pricing: { ...prev.pricing, currency: e.target.value },
          }));
        }}
      >
        <option>USD</option> <option>INR</option> <option>EUR</option>{" "}
      </select>
      <div className="border rounded-xl p-4 space-y-3">
        <h3 className="font-medium">Seasonal Discount</h3>
        <input
          className="p-3 border rounded-lg w-full"
          placeholder="Label (Summer Sale)"
          value={price.label}
          onChange={(e) => {
            setPackageData((prev) => ({
              ...prev,
              pricing: { ...prev.pricing, label: e.target.value },
            }));
          }}
        />
        <input
          className="p-3 border rounded-lg w-full"
          placeholder="Percentage %"
          value={price.discountpercentage}
          onChange={e => handleDiscountPercentageChange(e.target.value)}
        />
      </div>
    </div>
  );
}
export default CreatePackage