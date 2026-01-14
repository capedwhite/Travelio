import { useEffect, useState } from "react";
import { useForm, FormProvider, useFormContext, useFieldArray, useWatch} from "react-hook-form";
import AdminSidebar from "../../components/Adminnavbar";
import api from "../../api/axios";
import { Check } from "lucide-react";
import toast from "react-hot-toast";

const buildPackageFormData = (data) => {
  const formData = new FormData();
  formData.append("basicInfo", JSON.stringify(data.basicInfo));
  formData.append("pricing", JSON.stringify(data.pricing));
  formData.append("locations", JSON.stringify(data.locations));
  formData.append("touristSpots", JSON.stringify(data.touristSpots));
  formData.append("itinerary", JSON.stringify(data.itinerary));
  formData.append("hotels", JSON.stringify(data.hotels));
  formData.append("availability", JSON.stringify(data.availability));

  if (data.media.coverImage) formData.append("coverImage", data.media.coverImage);
  data.media.touristLocationImages.forEach((file) => formData.append("touristImages", file));
  data.hotels.forEach((hotel) =>
    hotel.hotelImages.forEach((file) =>
      formData.append("hotelImages", file)
    )
  );
  return formData;
};

const defaultValues = {
  basicInfo: { title: "", description: "", tag: "Budget Friendly", duration: "" },
  pricing: { originalPrice: "", discountedPrice: "", currency: "USD", label: "", discountpercentage: "" },
  locations: { country: "", city: "", pickup: "", notes: "" },
  touristSpots: [{ spotname: "", location: "", description: "" }],
  itinerary: [{ title: "", description: "" }],
  hotels: [{ name: "", location: "", rating: "", amenities: "", hotelImages: [] }],
  availability: { startDate: "", endDate: "", maxBookings: "", inclusion: "", exclusion: "" },
  media: { coverImage: null, touristLocationImages: [] },
};

const steps = [
  "Basic Info",
  "Pricing",
  "Locations",
  "Tourist Spots",
  "Itinerary",
  "Hotels",
  "Availability",
  "Media",
  "Publish",
];

function CreatePackage() {
  const methods = useForm({ defaultValues, mode: "onChange" });
  const { handleSubmit, watch, control } = methods;
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const formData = watch();

  const validateSection = (stepName) => {
    switch (stepName) {
      case "Basic Info":
        return formData.basicInfo.title && formData.basicInfo.description && formData.basicInfo.duration;
      case "Pricing":
        return formData.pricing.originalPrice && formData.pricing.discountedPrice;
      case "Locations":
        return formData.locations.country && formData.locations.city;
      case "Tourist Spots":
        return formData.touristSpots.every(spot => spot.spotname && spot.location);
      case "Itinerary":
        return formData.itinerary.every(day => day.title && day.description);
      case "Hotels":
        return formData.hotels.every(hotel => hotel.name && hotel.location);
      case "Availability":
        return formData.availability.startDate && formData.availability.endDate && formData.availability.maxBookings;
      case "Media":
        return formData.media.coverImage && formData.media.touristLocationImages.length > 0;
      default:
        return true;
    }
  };

  const currentStepValid = validateSection(steps[activeIndex]);

  const handleNext = () => {
    if (currentStepValid && activeIndex < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, steps[activeIndex]]));
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const canNavigateTo = (index) => {
    if (index === 0) return true;
    for (let i = 0; i < index; i++) {
      if (!completedSteps.has(steps[i])) return false;
    }
    return true;
  };

  const onSubmit = async (data) => {
    try {
      const formData = buildPackageFormData(data);
      const res = await api.post("/admin/addpackages", formData, { headers: { "Content-Type": "multipart/form-data" }, });
      console.log("Package created:", data);
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message)
    }
  };

  const renderSection = () => {
    switch (steps[activeIndex]) {
      case "Basic Info":
        return <BasicInfoSection />;
      case "Pricing":
        return <PricingSection />;
      case "Locations":
        return <LocationsSection />;
      case "Tourist Spots":
        return <TouristSpotsSection />;
      case "Itinerary":
        return <ItinerarySection />;
      case "Hotels":
        return <HotelsSection />;
      case "Availability":
        return <AvailabilitySection />;
      case "Media":
        return <MediaSection />;
      case "Publish":
        return <PublishSection onSubmit={handleSubmit(onSubmit)} />;
      default:
        return null;
    }
  };

  return (
   <>
   <AdminSidebar/>
    <div className="p-8 bg-gray-50 min-h-screen ml-64">
   
      <h1 className="text-3xl font-semibold mb-6">Create New Package</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow p-4 space-y-2">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step);
            const isActive = activeIndex === index;
            const canAccess = canNavigateTo(index);

            return (
              <button
                key={step}
                className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center justify-between ${
                  isActive
                    ? "bg-teal-500 text-white"
                    : isCompleted
                    ? "bg-teal-100 text-teal-700"
                    : canAccess
                    ? "hover:bg-gray-100"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => canAccess && setActiveIndex(index)}
                disabled={!canAccess}
              >
                <span>{step}</span>
                {isCompleted && (
                  <Check className="w-5 h-5 text-teal-600 animate-[scale-in_0.3s_ease-out]" />
                )}
              </button>
            );
          })}
        </div>

        <FormProvider {...methods}>
          <div className="lg:col-span-3 bg-white rounded-2xl shadow p-8">
            {renderSection()}
            
            {steps[activeIndex] !== "Publish" && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={activeIndex === 0}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    activeIndex === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Previous
                </button>
                
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!currentStepValid}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    currentStepValid
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </FormProvider>
      </div>
    </div>
    </>
  );
}

function BasicInfoSection() {
  const { register,setValue,control } = useFormContext();
  const tags = ["Budget Friendly", "Adventure Package", "Luxury", "Family Friendly", "Honeymoon Special"];
  const selectedTag = useWatch({
  control,
  name: "basicInfo.tag",
});

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Basic Info</h2>
      <input className="w-full p-3 border rounded-lg" placeholder="Title *" {...register("basicInfo.title")} />
      <input className="w-full p-3 border rounded-lg" placeholder="Duration *" {...register("basicInfo.duration")} />
      <textarea className="w-full p-3 border rounded-lg" rows={5} placeholder="Description *" {...register("basicInfo.description")} />
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`px-3 py-1 border rounded-full text-sm cursor-pointer ${
              selectedTag === tag ? "bg-teal-500/40 border-teal-500" : "hover:bg-gray-100"
            }`}
            onClick={() => setValue("basicInfo.tag", tag,{    shouldDirty: true,
    shouldTouch: true,
    shouldValidate: true,})}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function PricingSection() {
  const { register, setValue ,control} = useFormContext();
  const original = useWatch({
    control,
    name:"pricing.originalPrice"});
  const discount = useWatch({
    control,
    name:"pricing.discountpercentage"});

  const calcDiscount = (orig, disc) => {
    const o = parseFloat(orig);
    const d = parseFloat(disc);
    if (isNaN(o) || isNaN(d)) return "";
    return (o - (o * d) / 100).toFixed(2);
  };

  useEffect(() => {
    const discounted = calcDiscount(original, discount);
    setValue("pricing.discountedPrice", discounted, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [original, discount]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Pricing</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Original Price *"
          className="p-3 border rounded-lg"
          {...register("pricing.originalPrice")}
        />
        <input placeholder="Discounted Price *" className="p-3 border rounded-lg" {...register("pricing.discountedPrice")} readOnly />
      </div>
      <select className="p-3 border rounded-lg w-40" {...register("pricing.currency")}>
        <option>USD</option>
        <option>INR</option>
        <option>EUR</option>
      </select>
      <input placeholder="Label" className="p-3 border rounded-lg w-full" {...register("pricing.label")} />
      <input
        placeholder="Discount %"
        className="p-3 border rounded-lg w-full"
        {...register("pricing.discountpercentage")}
      />
    </div>
  );
}

function LocationsSection() {
  const { register } = useFormContext();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Locations</h2>
      <input placeholder="Country *" className="w-full p-3 border rounded-lg" {...register("locations.country")} />
      <input placeholder="City *" className="w-full p-3 border rounded-lg" {...register("locations.city")} />
      <input placeholder="Pickup" className="w-full p-3 border rounded-lg" {...register("locations.pickup")} />
      <textarea placeholder="Notes" rows={4} className="p-3 border rounded-lg w-full" {...register("locations.notes")} />
    </div>
  );
}

function TouristSpotsSection() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "touristSpots" });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Tourist Spots</h2>
      {fields.map((f, i) => (
        <div key={f.id} className="border rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Spot {i + 1}</h3>
            {fields.length > 1 && <button type="button" onClick={() => remove(i)} className="text-red-500 hover:text-red-700">Remove</button>}
          </div>
          <input placeholder="Spot Name *" className="w-full p-3 border rounded-lg" {...register(`touristSpots.${i}.spotname`)} />
          <input placeholder="Location *" className="w-full p-3 border rounded-lg" {...register(`touristSpots.${i}.location`)} />
          <textarea placeholder="Description" rows={3} className="w-full p-3 border rounded-lg" {...register(`touristSpots.${i}.description`)} />
        </div>
      ))}
      <button type="button" onClick={() => append({ spotname: "", location: "", description: "" })} className="text-teal-600 hover:text-teal-700 font-medium">+ Add Spot</button>
    </div>
  );
}

function ItinerarySection() {
  const { control, register } = useFormContext();
  const { fields, append } = useFieldArray({ control, name: "itinerary" });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Itinerary</h2>
      {fields.map((f, i) => (
        <div key={f.id} className="border rounded-xl p-4 space-y-3">
          <h3 className="font-medium">Day {i + 1}</h3>
          <input placeholder={`Day ${i + 1} Title *`} className="w-full p-3 border rounded-lg" {...register(`itinerary.${i}.title`)} />
          <textarea placeholder="Description *" rows={3} className="w-full p-3 border rounded-lg" {...register(`itinerary.${i}.description`)} />
        </div>
      ))}
      <button type="button" onClick={() => append({ title: "", description: "" })} className="text-teal-600 hover:text-teal-700 font-medium">+ Add Day</button>
    </div>
  );
}

function HotelsSection() {
  const { control, register, setValue, watch } = useFormContext();
  const hotels = watch("hotels");
  const { fields, append, remove } = useFieldArray({ control, name: "hotels" });
  const [hotelPreviews, setHotelPreviews] = useState({});

  const handleFiles = (index, files) => {
    const newFiles = Array.from(files);
    setValue(`hotels.${index}.hotelImages`, [
      ...(hotels[index]?.hotelImages || []),
      ...newFiles,
    ]);
    setHotelPreviews((prev) => ({
      ...prev,
      [index]: [
        ...(prev[index] || []),
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ],
    }));
  };

  const removeHotelImage = (hotelIndex, imgIndex) => {
    const updatedFiles = [...hotels[hotelIndex].hotelImages];
    updatedFiles.splice(imgIndex, 1);
    setValue(`hotels.${hotelIndex}.hotelImages`, updatedFiles);
    setHotelPreviews((prev) => {
      const updatedPreviews = [...prev[hotelIndex]];
      updatedPreviews.splice(imgIndex, 1);
      return { ...prev, [hotelIndex]: updatedPreviews };
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Hotels</h2>
      {fields.map((hotel, i) => (
        <div key={hotel.id} className="border rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Hotel {i + 1}</h3>
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="text-red-500 hover:text-red-700">Remove</button>
            )}
          </div>
          <input placeholder="Name *" className="w-full p-3 border rounded-lg" {...register(`hotels.${i}.name`)} />
          <input placeholder="Location *" className="w-full p-3 border rounded-lg" {...register(`hotels.${i}.location`)} />
          <input placeholder="Rating" className="w-full p-3 border rounded-lg" {...register(`hotels.${i}.rating`)} />
          <input placeholder="Amenities" className="w-full p-3 border rounded-lg" {...register(`hotels.${i}.amenities`)} />
          <input type="file" multiple onChange={(e) => handleFiles(i, e.target.files)} className="w-full" />
          {hotelPreviews[i]?.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {hotelPreviews[i].map((src, imgIndex) => (
                <div key={imgIndex} className="relative w-32 h-24 border rounded-xl overflow-hidden">
                  <img src={src} alt="Hotel preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeHotelImage(i, imgIndex)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ name: "", location: "", rating: "", amenities: "", hotelImages: [] })}
        className="text-teal-600 hover:text-teal-700 font-medium"
      >
        + Add Hotel
      </button>
    </div>
  );
}

function AvailabilitySection() {
  const { register } = useFormContext();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Availability</h2>
      <div>
        <label className="block mb-2 font-medium">Start Date *</label>
        <input type="date" className="w-full p-3 border rounded-lg" {...register("availability.startDate")} />
      </div>
      <div>
        <label className="block mb-2 font-medium">End Date *</label>
        <input type="date" className="w-full p-3 border rounded-lg" {...register("availability.endDate")} />
      </div>
      <input type="number" placeholder="Max Bookings *" className="w-full p-3 border rounded-lg" {...register("availability.maxBookings")} />
      <textarea placeholder="Inclusion" rows={3} className="w-full p-3 border rounded-lg" {...register("availability.inclusion")} />
      <textarea placeholder="Exclusion" rows={3} className="w-full p-3 border rounded-lg" {...register("availability.exclusion")} />
    </div>
  );
}

function MediaSection() {
  const { watch, setValue } = useFormContext();
  const media = watch("media");
  const [coverPreview, setCoverPreview] = useState(null);
  const [touristPreviews, setTouristPreviews] = useState([]);

  const handleCoverChange = (file) => {
    setValue("media.coverImage", file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleTouristChange = (files) => {
    const newFiles = Array.from(files);
    setValue("media.touristLocationImages", [
      ...media.touristLocationImages,
      ...newFiles,
    ]);
    setTouristPreviews([
      ...touristPreviews,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeTourist = (index) => {
    const updatedFiles = [...media.touristLocationImages];
    updatedFiles.splice(index, 1);
    setValue("media.touristLocationImages", updatedFiles);
    const updatedPreviews = [...touristPreviews];
    updatedPreviews.splice(index, 1);
    setTouristPreviews(updatedPreviews);
  };

  const removeCover = () => {
    setValue("media.coverImage", null);
    setCoverPreview(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Media</h2>
      <div className="space-y-2">
        <label className="block font-medium">Cover Image *</label>
        <input type="file" accept="image/*" onChange={(e) => handleCoverChange(e.target.files[0])} className="w-full border p-2 rounded-lg cursor-pointer" />
        {coverPreview && (
          <div className="mt-2 relative w-64 h-40 border rounded-xl shadow overflow-hidden">
            <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
            <button type="button" onClick={removeCover} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">✕</button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label className="block font-medium">Tourist Location Images *</label>
        <input type="file" accept="image/*" multiple onChange={(e) => handleTouristChange(e.target.files)} className="w-full border p-2 rounded-lg cursor-pointer" />
        {touristPreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {touristPreviews.map((src, i) => (
              <div key={i} className="relative w-32 h-24 border rounded-xl shadow overflow-hidden">
                <img src={src} alt={`Tourist ${i}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeTourist(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PublishSection({ onSubmit }) {
  return (
    <div className="text-center mt-6 space-y-4">
      <p className="text-gray-600">Review all sections and click the button below to create your package.</p>
      <button onClick={onSubmit} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl transition">Create Package</button>
    </div>
  );
}

export default CreatePackage;