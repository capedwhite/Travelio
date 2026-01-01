import AdminSidebar from "../../components/Adminnavbar";

export default function CreatePackage() {
  return (
    <>
<AdminSidebar></AdminSidebar>
    <div className="ml-64 p-8 bg-[#f8fafc] min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Create New Package</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Section Tabs */}
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
            "Publish"
          ].map(step => (
            <button
              key={step}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#3ab19d]/10 transition"
            >
              {step}
            </button>
          ))}
        </div>

        {/* Right Form Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow p-8">
          {/* Dynamic section goes here */}
          <BasicInfoSection />
        </div>

      </div>
    </div>
    </>
  );
}
function BasicInfoSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Basic Information</h2>

      <div>
        <label className="block text-sm font-medium">Package Title</label>
        <input
          type="text"
          placeholder="Explore Bali – 7 Days Luxury Trip"
          className="w-full mt-2 p-3 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          rows={5}
          placeholder="Describe the experience, highlights, and vibe..."
          className="w-full mt-2 p-3 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Tags</label>
        <div className="flex gap-2 flex-wrap mt-2">
          {[
            "Most Popular",
            "Budget Friendly",
            "Adventure Package",
            "Luxury",
            "Family Friendly",
            "Honeymoon Special"
          ].map(tag => (
            <span
              key={tag}
              className="px-3 py-1 border rounded-full text-sm cursor-pointer hover:bg-[#3ab19d]/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" />
        <span>Make this package active</span>
      </div>
    </div>
  );
}
function PricingSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Pricing & Discounts</h2>

      <div className="grid grid-cols-2 gap-4">
        <input className="p-3 border rounded-lg" placeholder="Original Price" />
        <input className="p-3 border rounded-lg" placeholder="Discounted Price" />
      </div>

      <select className="p-3 border rounded-lg w-40">
        <option>USD</option>
        <option>INR</option>
        <option>EUR</option>
      </select>

      <div className="border rounded-xl p-4 space-y-3">
        <h3 className="font-medium">Seasonal Discount</h3>
        <input className="p-3 border rounded-lg w-full" placeholder="Label (Summer Sale)" />
        <input className="p-3 border rounded-lg w-full" placeholder="Percentage %" />
      </div>
    </div>
  );
}
function HotelsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Hotel Details</h2>

      <div className="border rounded-xl p-4 space-y-3">
        <input className="p-3 border rounded-lg w-full" placeholder="Hotel Name" />
        <input className="p-3 border rounded-lg w-full" placeholder="Location" />
        <input className="p-3 border rounded-lg w-full" placeholder="Rating (1–5)" />
        <input className="p-3 border rounded-lg w-full" placeholder="Amenities (comma separated)" />
      </div>

      <button className="text-[#3ab19d] font-medium">+ Add Another Hotel</button>
    </div>
  );
}
function MediaSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Images</h2>

      <div className="border-2 border-dashed rounded-xl p-8 text-center">
        <p className="text-gray-500">Upload Cover Image</p>
      </div>

      <div className="border-2 border-dashed rounded-xl p-8 text-center">
        <p className="text-gray-500">Upload Gallery Images</p>
      </div>
    </div>
  );
}
function AvailabilitySection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Availability</h2>

      <div className="grid grid-cols-2 gap-4">
        <input type="date" className="p-3 border rounded-lg" />
        <input type="date" className="p-3 border rounded-lg" />
      </div>

      <input className="p-3 border rounded-lg w-full" placeholder="Max Bookings" />
    </div>
  );
}
function PublishSection() {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold">Ready to Publish?</h2>

      <button className="bg-[#3ab19d] text-white px-8 py-3 rounded-xl hover:bg-[#329b8a]">
        Create Package
      </button>
    </div>
  );
}
