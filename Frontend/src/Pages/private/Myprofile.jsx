import { useState, useEffect, useRef } from "react";
import { Camera, Edit2, Save, X, User, Mail, FileText, MapPin } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/authContext";

function MyProfile() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    profileImage: null,
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      const profileData = res.data.data;
      setProfile(profileData);
      setFormData({
        name: profileData.name || "",
        username: profileData.username || "",
        email: profileData.email || "",
        bio: profileData.bio || "",
        profileImage: null,
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("bio", formData.bio || "");

      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const res = await api.put("/user/profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update local user state and profile
      login(localStorage.getItem("authtoken"));
      setProfile(res.data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      username: profile?.username || "",
      email: profile?.email || "",
      bio: profile?.bio || "",
      profileImage: null,
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <ClipLoader size={50} color="#8b5cf6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your travel persona and showcase your adventures
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {/* PROFILE HEADER */}
          <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-8 text-white">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* PROFILE IMAGE */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden shadow-2xl">
                    {formData.profileImage ? (
                      <img
                        src={URL.createObjectURL(formData.profileImage)}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : profile?.profileImage ? (
                      <img
                        src={`http://localhost:3000/${profile.profileImage}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center">
                        <User className="w-16 h-16 text-white/70" />
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-110"
                    >
                      <Camera className="w-5 h-5 text-purple-600" />
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* PROFILE INFO */}
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {isEditing ? formData.name || "Your Name" : profile?.name || profile?.username || "Your Name"}
                  </h2>
                  <p className="text-white/80 text-lg mb-4">
                    @{isEditing ? formData.username : profile?.username}
                  </p>

                  {/* BIO */}
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-white/90 text-base max-w-md">
                      {profile?.bio || "No bio added yet. Share your travel story!"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* EDIT BUTTON */}
            <div className="absolute top-4 right-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? <ClipLoader size={16} color="#8b5cf6" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* PROFILE DETAILS */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Profile Details
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* NAME */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-xl">
                    {profile?.name || "Not set"}
                  </p>
                )}
              </div>

              {/* USERNAME */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Choose a username"
                  />
                ) : (
                  <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-xl">
                    @{profile?.username}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Enter your email"
                  />
                ) : (
                  <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-xl">
                    {profile?.email}
                  </p>
                )}
              </div>

              {/* USER TYPE */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Account Type
                </label>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-3 rounded-xl">
                  <span className="text-purple-700 font-semibold capitalize">
                    {profile?.usertype || "User"}
                  </span>
                </div>
              </div>
            </div>

            {/* STATS SECTION */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Your Travel Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
                  <div className="text-sm text-blue-700">Posts</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">0</div>
                  <div className="text-sm text-green-700">Following</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
                  <div className="text-sm text-purple-700">Followers</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-pink-600 mb-1">0</div>
                  <div className="text-sm text-pink-700">Challenges Won</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
