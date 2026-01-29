import { useState } from "react";
import { MapPin, Clock, Users, IndianRupee, Calendar, Send, Sparkles } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

function PackageRequest() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    travelers: "",
    budget: "",
    travelDate: "",
    specialRequests: "",
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.destination || !formData.duration || !formData.travelers || !formData.budget || !formData.travelDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/user/explorepackages/request", formData);
      toast.success(res.data.message);

      // Reset form
      setFormData({
        destination: "",
        duration: "",
        travelers: "",
        budget: "",
        travelDate: "",
        specialRequests: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 sticky top-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-4 py-2 rounded-full mb-3">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span className="text-sm font-semibold text-teal-700">Custom Package</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Can't find what you're looking for?
        </h3>
        <p className="text-sm text-gray-600">
          Tell us your dream destination and we'll create the perfect package for you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Destination */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            Destination *
          </label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => handleInputChange("destination", e.target.value)}
            placeholder="e.g., Bali, Maldives, Switzerland"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
            required
          />
        </div>

        {/* Duration & Travelers */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Duration *
            </label>
            <select
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
              required
            >
              <option value="">Select duration</option>
              <option value="2-3 days">2-3 days</option>
              <option value="4-5 days">4-5 days</option>
              <option value="6-7 days">6-7 days</option>
              <option value="8-10 days">8-10 days</option>
              <option value="11-14 days">11-14 days</option>
              <option value="15+ days">15+ days</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Travelers *
            </label>
            <select
              value={formData.travelers}
              onChange={(e) => handleInputChange("travelers", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
              required
            >
              <option value="">Select travelers</option>
              <option value="1">1 person</option>
              <option value="2">2 people</option>
              <option value="3">3 people</option>
              <option value="4">4 people</option>
              <option value="5">5 people</option>
              <option value="6">6+ people</option>
            </select>
          </div>
        </div>

        {/* Budget & Travel Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-teal-600" />
              Budget Range *
            </label>
            <select
              value={formData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
              required
            >
              <option value="">Select budget</option>
              <option value="₹15,000 - ₹25,000">₹15,000 - ₹25,000</option>
              <option value="₹25,000 - ₹40,000">₹25,000 - ₹40,000</option>
              <option value="₹40,000 - ₹60,000">₹40,000 - ₹60,000</option>
              <option value="₹60,000 - ₹1,00,000">₹60,000 - ₹1,00,000</option>
              <option value="₹1,00,000+">₹1,00,000+</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              Preferred Date *
            </label>
            <input
              type="date"
              value={formData.travelDate}
              onChange={(e) => handleInputChange("travelDate", e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
              required
            />
          </div>
        </div>

        {/* Special Requests */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Special Requests (Optional)
          </label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => handleInputChange("specialRequests", e.target.value)}
            placeholder="Any specific preferences? (e.g., hotel type, activities, dietary requirements...)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full  border-2 border-teal-500 bg-teal-100 text-black py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Request Custom Package</span>
            </>
          )}
        </button>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Our travel experts will create a personalized package just for you within 24 hours!
          </p>
        </div>
      </form>
    </div>
  );
}

export default PackageRequest;
