import { useEffect, useMemo, useState } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import AdminSidebar from "../../components/Adminnavbar";
import api from "../../api/axios";
import { Check, Edit2, Eye, Filter, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";
import { ClipLoader } from "react-spinners";
import Modal from "../../components/Modal";

function buildPackageFormData(data, mode) {
  const formData = new FormData();

  formData.append("basicInfo", JSON.stringify(data.basicInfo));
  formData.append("pricing", JSON.stringify(data.pricing));
  formData.append("locations", JSON.stringify(data.locations));
  formData.append("touristSpots", JSON.stringify(data.touristSpots));
  formData.append("itinerary", JSON.stringify(data.itinerary));
  console.log(data.availability);
  const hotelsData = data.hotels.map((hotel) => ({
    name: hotel.name,
    location: hotel.location,
    rating: hotel.rating,
    amenities: hotel.amenities,
  }));
  formData.append("hotels", JSON.stringify(hotelsData));

  data.hotels.forEach((hotel, index) => {
    if (hotel.hotelImages && hotel.hotelImages.length > 0) {
      hotel.hotelImages.forEach((image) => {
        if (image instanceof File) {
          formData.append(`hotelImages[${index}]`, image);
        }
      });
    }
  });

  formData.append("availability", JSON.stringify(data.availability));

  if (data.media.coverImage instanceof File) {
    formData.append("coverImage", data.media.coverImage);
  }

  if (
    data.media.touristLocationImages &&
    data.media.touristLocationImages.length > 0
  ) {
    data.media.touristLocationImages.forEach((image) => {
      if (image instanceof File) {
        formData.append("touristImages", image);
      }
    });
  }
  console.log(formData);
  return formData;
}

const defaultValues = {
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
  locations: { country: "", city: "", pickup: "", notes: "" },
  touristSpots: [{ spotname: "", location: "", description: "" }],
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

function PackageForm({
  mode = "create",
  packageId = null,
  packageData,
  onSuccess,
  refetch,
  key,
  preFilledData = null,
  visibility = "public",
  specificUserId = null,
  bargainid = null,
  requestId = null,
}) {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const methods = useForm({
    defaultValues: preFilledData || defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, watch, control, reset } = methods;
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const formData = watch();

  useEffect(() => {
    if (mode === "edit" && packageId) {
      fetchPackageData();
    }
  }, [mode, packageId]);

  const fetchPackageData = async () => {
    try {
      setLoading(true);
      const transformedData = transformPackageToForm(packageData);
      setInitialData(transformedData);
      reset(transformedData);
      setFormKey(key);
      setCompletedSteps(new Set(steps.slice(0, -1)));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load package data");
    } finally {
      setLoading(false);
    }
  };

  const transformPackageToForm = (data) => {
    return {
      basicInfo: {
        title: data.title || "",
        description: data.description || "",
        tag: data.tag || "Budget Friendly",
        duration: data.duration || "",
      },
      pricing: {
        originalPrice: data.price.originalPrice || "",
        discountedPrice: data.price.discountedPrice || "",
        currency: data.price.currency || "USD",
        label: data.seasonalDiscount.label || "",
        discountpercentage: data.seasonalDiscount.percentage || "",
      },
      locations: {
        country: data.locations.country || "",
        city: data.locations.city || "",
        pickup: data.locations.pickup || "",
        notes: data.locations.notes || "",
      },
      touristSpots:
        data.touristSpots?.length > 0
          ? data.touristSpots
          : [{ spotname: "", location: "", description: "" }],
      itinerary:
        data.itinerary?.length > 0
          ? data.itinerary
          : [{ title: "", description: "" }],
      hotels:
        data.hotels?.length > 0
          ? data.hotels.map((hotel) => ({
              name: hotel.name || "",
              location: hotel.location || "",
              rating: hotel.rating || "",
              amenities: hotel.amenities || "",
              hotelImages: hotel.hotelImages || [],
              existingImages: hotel.hotelImages || [],
            }))
          : [
              {
                name: "",
                location: "",
                rating: "",
                amenities: "",
                hotelImages: [],
              },
            ],
      availability: {
        startDate: data.availability.startDate
          ? formatDateForInput(data.availability.startDate)
          : "",
        endDate: data.availability.endDate
          ? formatDateForInput(data.availability.endDate)
          : "",
        maxBookings: data.availability.maxBookings || "",
        inclusion: data.inclusions.join("\n") || "",
        exclusion: data.exclusions.join("\n") || "",
      },
      media: {
        coverImage: data.images.coverImage || null,
        touristLocationImages: data.images.tourist || [],
        existingCoverImage: data.images.coverImage || null,
        existingTouristImages: data.images.tourist || [],
      },
    };
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const validateSection = (stepName) => {
    switch (stepName) {
      case "Basic Info":
        return (
          formData.basicInfo.title &&
          formData.basicInfo.description &&
          formData.basicInfo.duration
        );
      case "Pricing":
        return (
          formData.pricing.originalPrice && formData.pricing.discountedPrice
        );
      case "Locations":
        return formData.locations.country && formData.locations.city;
      case "Tourist Spots":
        return formData.touristSpots.every(
          (spot) => spot.spotname && spot.location,
        );
      case "Itinerary":
        return formData.itinerary.every((day) => day.title && day.description);
      case "Hotels":
        return formData.hotels.every((hotel) => hotel.name && hotel.location);
      case "Availability":
        return (
          formData.availability.startDate &&
          formData.availability.endDate &&
          formData.availability.maxBookings
        );
      case "Media":
        return (
          (formData.media.coverImage || formData.media.existingCoverImage) &&
          (formData.media.touristLocationImages?.length > 0 ||
            formData.media.existingTouristImages?.length > 0)
        );
      default:
        return true;
    }
  };

  const currentStepValid = validateSection(steps[activeIndex]);

  const handleNext = () => {
    if (currentStepValid && activeIndex < steps.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, steps[activeIndex]]));
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
    if (mode === "edit") return true;
    for (let i = 0; i < index; i++) {
      if (!completedSteps.has(steps[i])) return false;
    }
    return true;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log(data);
      const formData = buildPackageFormData(data, mode);

      // Add visibility and specificUserId and bargain id
      formData.append("visibility", visibility);
      if (specificUserId) {
        formData.append("specificUserId", specificUserId);
      }
      if (requestId) {
        formData.append("requestId", requestId);
      }
      if (bargainid) {
        formData.append("bargainId", bargainid);
      }

      let res;
      if (mode === "edit") {
        console.log(packageId);
        console.log(formData);
        res = await api.put(`/admin/addpackages/${packageId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data.message);
        if (refetch) {
          await refetch();
        }
      } else {
        res = await api.post("/admin/addpackages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data.message);
        if (refetch) {
          await refetch();
        }
      }
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || `Failed to ${mode} package`);
    } finally {
      setLoading(false);
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
        return <HotelsSection mode={mode} />;
      case "Availability":
        return <AvailabilitySection />;
      case "Media":
        return <MediaSection mode={mode} />;
      case "Publish":
        return (
          <PublishSection
            onSubmit={handleSubmit(onSubmit)}
            mode={mode}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  if (loading && mode === "edit" && !initialData) {
    return <div className="p-8 text-center">Loading package data...</div>;
  }

  return (
    <div className="pl-8 pr-8 pt-8 pb-6 bg-gray-50 min-h-screen">
      <h1 className="text-gray-500 mt-1 text-lg mb-6">
        {mode === "edit" ? "Edit Package" : "Create New Package"}
      </h1>
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
                {isCompleted && <Check className="w-5 h-5 text-teal-600" />}
              </button>
            );
          })}
        </div>

        <FormProvider {...methods} key={formKey}>
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
  );
}

function CreatePackage() {
  const [allpackages, setAllpackages] = useState([]);

  const getallpackages = async () => {
    try {
      const res = await api.get("/admin/packages");
      setAllpackages(res.data.data);
      console.log(res.data.data);
      console.log(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    getallpackages();
  }, []);

  return (
    <>
      <AdminSidebar />

      <div className="p-8 pt-2 bg-gray-50 min-h-screen ml-64">
        <PackageForm refetch={getallpackages} />

        <AdminPackagesTable packages={allpackages} refetch={getallpackages} />
      </div>
    </>
  );
}

function BasicInfoSection() {
  const { register, setValue, control, watch } = useFormContext();
  const tags = [
    "Budget Friendly",
    "Adventure Package",
    "Luxury",
    "Family Friendly",
    "Honeymoon Special",
  ];
  const selectedTag = useWatch({
    control,
    name: "basicInfo.tag",
  });
  const titleValue = watch("basicInfo.title");
  console.log("Current title value:", titleValue);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Basic Info</h2>
      <input
        className="w-full p-3 border rounded-lg"
        placeholder="Title *"
        {...register("basicInfo.title")}
      />
      <input
        className="w-full p-3 border rounded-lg"
        placeholder="Duration *"
        {...register("basicInfo.duration")}
      />
      <textarea
        className="w-full p-3 border rounded-lg"
        rows={5}
        placeholder="Description *"
        {...register("basicInfo.description")}
      />
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`px-3 py-1 border rounded-full text-sm cursor-pointer ${
              selectedTag === tag
                ? "bg-teal-500/40 border-teal-500"
                : "hover:bg-gray-100"
            }`}
            onClick={() =>
              setValue("basicInfo.tag", tag, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function PricingSection() {
  const { register, setValue, control } = useFormContext();
  const original = useWatch({
    control,
    name: "pricing.originalPrice",
  });
  const discount = useWatch({
    control,
    name: "pricing.discountpercentage",
  });

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
        <input
          placeholder="Discounted Price *"
          className="p-3 border rounded-lg"
          {...register("pricing.discountedPrice")}
          readOnly
        />
      </div>
      <select
        className="p-3 border rounded-lg w-40"
        {...register("pricing.currency")}
      >
        <option>USD</option>
        <option>INR</option>
        <option>EUR</option>
      </select>
      <input
        placeholder="Label"
        className="p-3 border rounded-lg w-full"
        {...register("pricing.label")}
      />
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
      <input
        placeholder="Country *"
        className="w-full p-3 border rounded-lg"
        {...register("locations.country")}
      />
      <input
        placeholder="City *"
        className="w-full p-3 border rounded-lg"
        {...register("locations.city")}
      />
      <input
        placeholder="Pickup"
        className="w-full p-3 border rounded-lg"
        {...register("locations.pickup")}
      />
      <textarea
        placeholder="Notes"
        rows={4}
        className="p-3 border rounded-lg w-full"
        {...register("locations.notes")}
      />
    </div>
  );
}

function TouristSpotsSection() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "touristSpots",
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Tourist Spots</h2>
      {fields.map((f, i) => (
        <div key={f.id} className="border rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Spot {i + 1}</h3>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
          <input
            placeholder="Spot Name *"
            className="w-full p-3 border rounded-lg"
            {...register(`touristSpots.${i}.spotname`)}
          />
          <input
            placeholder="Location *"
            className="w-full p-3 border rounded-lg"
            {...register(`touristSpots.${i}.location`)}
          />
          <textarea
            placeholder="Description"
            rows={3}
            className="w-full p-3 border rounded-lg"
            {...register(`touristSpots.${i}.description`)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ spotname: "", location: "", description: "" })}
        className="text-teal-600 hover:text-teal-700 font-medium"
      >
        + Add Spot
      </button>
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
          <input
            placeholder={`Day ${i + 1} Title *`}
            className="w-full p-3 border rounded-lg"
            {...register(`itinerary.${i}.title`)}
          />
          <textarea
            placeholder="Description *"
            rows={3}
            className="w-full p-3 border rounded-lg"
            {...register(`itinerary.${i}.description`)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ title: "", description: "" })}
        className="text-teal-600 hover:text-teal-700 font-medium"
      >
        + Add Day
      </button>
    </div>
  );
}

function HotelsSection({ mode }) {
  const { control, register, setValue, watch } = useFormContext();
  const hotels = watch("hotels");
  const { fields, append, remove } = useFieldArray({ control, name: "hotels" });
  const [hotelPreviews, setHotelPreviews] = useState({});

  useEffect(() => {
    if (mode === "edit" && hotels) {
      const previews = {};
      hotels.forEach((hotel, index) => {
        if (hotel.existingImages && hotel.existingImages.length > 0) {
          // Fix: Check if it's a string (URL) or File object
          previews[index] = hotel.existingImages.map((img) => {
            if (typeof img === "string") {
              // It's an existing image URL from server
              return `http://localhost:3000/${img}`;
            } else if (img instanceof File || img instanceof Blob) {
              // It's a newly uploaded file
              return URL.createObjectURL(img);
            }
            return img;
          });
        }
      });
      setHotelPreviews(previews);
    }
  }, [mode]); // Remove hotels from dependencies to avoid infinite loop

  const handleFiles = (index, files) => {
    const newFiles = Array.from(files);
    const currentImages = hotels[index]?.hotelImages || [];
    setValue(`hotels.${index}.hotelImages`, [...currentImages, ...newFiles]);

    setHotelPreviews((prev) => ({
      ...prev,
      [index]: [
        ...(prev[index] || []),
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ],
    }));
  };

  const removeHotelImage = (hotelIndex, imgIndex) => {
    const hotel = hotels[hotelIndex];
    const existingCount = hotel.existingImages?.length || 0;

    // Check if we're removing an existing image or a new upload
    if (imgIndex < existingCount) {
      // Removing an existing image
      const updatedExisting = [...(hotel.existingImages || [])];
      updatedExisting.splice(imgIndex, 1);
      setValue(`hotels.${hotelIndex}.existingImages`, updatedExisting);
    } else {
      // Removing a newly uploaded image
      const newImageIndex = imgIndex - existingCount;
      const updatedFiles = [...(hotel.hotelImages || [])];
      updatedFiles.splice(newImageIndex, 1);
      setValue(`hotels.${hotelIndex}.hotelImages`, updatedFiles);
    }

    // Update previews
    setHotelPreviews((prev) => {
      const updatedPreviews = [...(prev[hotelIndex] || [])];
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
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
          <input
            placeholder="Name *"
            className="w-full p-3 border rounded-lg"
            {...register(`hotels.${i}.name`)}
          />
          <input
            placeholder="Location *"
            className="w-full p-3 border rounded-lg"
            {...register(`hotels.${i}.location`)}
          />
          <input
            placeholder="Rating"
            className="w-full p-3 border rounded-lg"
            {...register(`hotels.${i}.rating`)}
          />
          <input
            placeholder="Amenities"
            className="w-full p-3 border rounded-lg"
            {...register(`hotels.${i}.amenities`)}
          />
          <input
            type="file"
            multiple
            onChange={(e) => handleFiles(i, e.target.files)}
            className="w-full"
          />
          {hotelPreviews[i]?.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {hotelPreviews[i].map((src, imgIndex) => (
                <div
                  key={imgIndex}
                  className="relative w-32 h-24 border rounded-xl overflow-hidden"
                >
                  <img
                    src={src}
                    alt="Hotel preview"
                    className="w-full h-full object-cover"
                  />
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
        onClick={() =>
          append({
            name: "",
            location: "",
            rating: "",
            amenities: "",
            hotelImages: [],
            existingImages: [],
          })
        }
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
        <input
          type="date"
          className="w-full p-3 border rounded-lg"
          {...register("availability.startDate")}
        />
      </div>
      <div>
        <label className="block mb-2 font-medium">End Date *</label>
        <input
          type="date"
          className="w-full p-3 border rounded-lg"
          {...register("availability.endDate")}
        />
      </div>
      <input
        type="number"
        placeholder="Max Bookings *"
        className="w-full p-3 border rounded-lg"
        {...register("availability.maxBookings")}
      />
      <textarea
        placeholder="Inclusion"
        rows={3}
        className="w-full p-3 border rounded-lg"
        {...register("availability.inclusion")}
      />
      <textarea
        placeholder="Exclusion"
        rows={3}
        className="w-full p-3 border rounded-lg"
        {...register("availability.exclusion")}
      />
    </div>
  );
}

function MediaSection({ mode }) {
  const { watch, setValue } = useFormContext();
  const media = watch("media");
  const [coverPreview, setCoverPreview] = useState(null);
  const [touristPreviews, setTouristPreviews] = useState([]);

  useEffect(() => {
    if (mode === "edit") {
      if (media.existingCoverImage && !coverPreview) {
        const imageUrl =
          typeof media.existingCoverImage === "string"
            ? `http://localhost:3000/${media.existingCoverImage}`
            : URL.createObjectURL(media.existingCoverImage);
        setCoverPreview(imageUrl);
      }

      if (
        media.existingTouristImages?.length > 0 &&
        touristPreviews.length === 0
      ) {
        const previews = media.existingTouristImages.map((img) => {
          if (typeof img === "string") {
            return `http://localhost:3000/${img}`;
          } else if (img instanceof File || img instanceof Blob) {
            return URL.createObjectURL(img);
          }
          return img;
        });
        setTouristPreviews(previews);
      }
    }
  }, [mode, media.existingCoverImage, media.existingTouristImages]);

  const handleCoverChange = (file) => {
    if (file) {
      setValue("media.coverImage", file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleTouristChange = (files) => {
    const newFiles = Array.from(files);
    const currentImages = media.touristLocationImages || [];

    setValue("media.touristLocationImages", [...currentImages, ...newFiles]);

    setTouristPreviews([
      ...touristPreviews,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeTourist = (index) => {
    const existingCount = media.existingTouristImages?.length || 0;

    if (index < existingCount) {
      // Removing an existing image
      const updatedExisting = [...(media.existingTouristImages || [])];
      updatedExisting.splice(index, 1);
      setValue("media.existingTouristImages", updatedExisting);
    } else {
      // Removing a newly uploaded image
      const newImageIndex = index - existingCount;
      const updatedFiles = [...(media.touristLocationImages || [])];
      updatedFiles.splice(newImageIndex, 1);
      setValue("media.touristLocationImages", updatedFiles);
    }

    const updatedPreviews = [...touristPreviews];
    updatedPreviews.splice(index, 1);
    setTouristPreviews(updatedPreviews);
  };

  const removeCover = () => {
    setValue("media.coverImage", null);
    setValue("media.existingCoverImage", null);
    setCoverPreview(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Media</h2>

      {/* Cover Image */}
      <div className="space-y-2">
        <label className="block font-medium">Cover Image *</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleCoverChange(e.target.files[0])}
          className="w-full border p-2 rounded-lg cursor-pointer"
        />
        {coverPreview && (
          <div className="mt-2 relative w-64 h-40 border rounded-xl shadow overflow-hidden">
            <img
              src={coverPreview}
              alt="Cover Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeCover}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Tourist Location Images */}
      <div className="space-y-2">
        <label className="block font-medium">
          Tourist Location Images *
          {mode === "edit" && touristPreviews.length > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              ({touristPreviews.length} images)
            </span>
          )}
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleTouristChange(e.target.files)}
          className="w-full border p-2 rounded-lg cursor-pointer"
        />
        {touristPreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {touristPreviews.map((src, i) => (
              <div
                key={i}
                className="relative w-32 h-24 border rounded-xl shadow overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Tourist ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeTourist(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PublishSection({ onSubmit, mode, loading }) {
  return (
    <div className="text-center mt-6 space-y-4">
      <p className="text-gray-600">
        Review all sections and click the button below to{" "}
        {mode === "edit" ? "update" : "create"} your package.
      </p>
      <button
        onClick={onSubmit}
        disabled={loading}
        className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl transition disabled:bg-gray-400"
      >
        {loading ? (
          <ClipLoader />
        ) : mode === "edit" ? (
          "Update Package"
        ) : (
          "Create Package"
        )}
      </button>
    </div>
  );
}

function AdminPackagesTable({ packages, refetch }) {
  const [showdialog, setShowdialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedpackageId, setPackageid] = useState(null);
  const [editPackage, setEditPackage] = useState(null);

  const tags = [
    "All",
    "Budget Friendly",
    "Adventure Package",
    "Luxury",
    "Family Friendly",
    "Honeymoon Special",
  ];
  const statuses = ["All", "Active", "Inactive"];

  const handleEdit = async (id) => {
    try {
      const res = await api.get(`/admin/addpackages/${id}`);
      setEditPackage(res.data.data);
      console.log("Edit package:", id);
      setPackageid(id);
      setShowdialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("Delete package:", id);
      const res = await api.delete(`/admin/addpackages/${id}`);
      toast.success(res.data.message);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
    }
  };

  const columns = [
    {
      name: "Package",
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          <img
            src={`http://localhost:3000/${row.images?.coverImage}`}
            alt={row.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900">{row.title}</p>
            <p className="text-sm text-gray-500">ID: #{row.id}</p>
          </div>
        </div>
      ),
      minWidth: "280px",
    },
    {
      name: "Destination",
      selector: (row) => row.locations.city,
      sortable: true,
      cell: (row) => <p className="text-gray-700">{row.locations.city}</p>,
      minWidth: "180px",
    },
    {
      name: "Duration",
      selector: (row) => row.duration,
      sortable: true,
      cell: (row) => <p className="text-gray-700">{row.duration}</p>,
      minWidth: "150px",
    },
    {
      name: "Tag",
      selector: (row) => row.tags?.[0],
      sortable: true,
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            row.tags?.[0] === "Luxury"
              ? "bg-purple-100 text-purple-700"
              : row.tags?.[0] === "Budget Friendly"
                ? "bg-green-100 text-green-700"
                : row.tags?.[0] === "Adventure Package"
                  ? "bg-orange-100 text-orange-700"
                  : row.tags?.[0] === "Family Friendly"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-pink-100 text-pink-700"
          }`}
        >
          {row.tags?.[0]}
        </span>
      ),
      minWidth: "160px",
    },
    {
      name: "Price",
      selector: (row) => row.discountedPrice,
      sortable: true,
      cell: (row) => (
        <div>
          {Number(row.price.discountedPrice) === 0 ? (
            <p className="font-semibold text-green-600">Free</p>
          ) : (
            <>
              <p className="font-semibold text-gray-900">
                ${row.price.discountedPrice}
              </p>
              <p className="text-sm text-gray-400 line-through">
                ${row.price.originalPrice}
              </p>
            </>
          )}
        </div>
      ),
      minWidth: "120px",
    },
    {
      name: "Bookings",
      selector: (row) => row.bookings.length,
      sortable: true,
      cell: (row) => (
        <p className="font-medium text-gray-700">{row.bookings.length}</p>
      ),
      minWidth: "100px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.status}
        </span>
      ),
      minWidth: "110px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row.id)}
            className="p-2 hover:bg-teal-50 text-teal-600 rounded-lg transition"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      minWidth: "130px",
      right: true,
    },
  ];

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.locations?.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = filterTag === "All" || pkg.tags?.[0] === filterTag;
      const matchesStatus =
        filterStatus === "All" || pkg.status === filterStatus;
      return matchesSearch && matchesTag && matchesStatus;
    });
  }, [packages, searchTerm, filterTag, filterStatus]);

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#F9FAFB",
        borderBottom: "1px solid #E5E7EB",
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
      },
    },
    headCells: {
      style: {
        paddingLeft: "24px",
        paddingRight: "24px",
      },
    },
    cells: {
      style: {
        paddingLeft: "24px",
        paddingRight: "24px",
        fontSize: "14px",
      },
    },
    rows: {
      style: {
        minHeight: "72px",
        "&:hover": {
          backgroundColor: "#F9FAFB",
          cursor: "pointer",
        },
      },
    },
  };

  return (
    <div className="pr-8 pl-8 pt-6 pb-8 bg-gray-50 min-h-screen">
      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-500 mt-1 text-lg">
            Manage all your travel packages
          </p>
        </div>
      </div>
      {showdialog && editPackage && (
        <Modal
          isOpen={showdialog}
          onClose={() => setShowdialog(false)}
          title="Edit Package"
        >
          <PackageForm
            key={selectedpackageId}
            mode="edit"
            packageData={editPackage}
            packageId={selectedpackageId}
            onSuccess={() => setShowdialog(false)}
            refetch={refetch}
          />
        </Modal>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Packages
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {packages.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-teal-600 rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Active Packages
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {packages.filter((p) => p.status === "Active").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-green-600 rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Bookings
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {packages.reduce(
                  (sum, p) => sum + (p.bookings?.length || 0),
                  0,
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Revenue (Est.)
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {packages.reduce((sum, p) => {
                  const price = Number(p.price?.discountedPrice || 0);
                  return sum + price * (p.bookings?.length || 0);
                }, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-purple-600 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages by title or destination..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            >
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredPackages}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          highlightOnHover
          customStyles={customStyles}
          noDataComponent={
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No packages found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}

export { PackageForm };
export default CreatePackage;
