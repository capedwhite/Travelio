import { Home, Package, ClipboardList, DollarSign, Award, LogOut, Upload, HandHeart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function AdminSidebar({children}) {
  const{logout}=useAuth()
  const navItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/admin/dashboard" },
    { name: "Packages", icon: <Package size={18} />, path: "/admin/createpackages" },
    { name: "Bookings", icon: <ClipboardList size={18} />, path: "/admin/bookings" },
    { name: "Bargain Requests", icon: <DollarSign size={18} />, path: "/admin/bargainrequest" },
    { name: "Challenges", icon: <Award size={18} />, path: "/admin/addchallenges" },
    { name: "Submissions", icon: <Upload size={18} />, path: "/admin/viewchallenges" },
    { name: "packageRequests", icon: <HandHeart size={18} />, path: "/admin/viewuserrequests" },
   
  ];

  return (
    <div className="w-64 bg-[#3ab19d] h-screen text-white flex flex-col fixed">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">Admin Panel</div>
      <nav className="mt-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 mx-2 rounded-md hover:bg-[#69d0ac9e] transition ${
                isActive ? "bg-[#69d0ac9e]" : ""
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
          
        ))}
       <div className="mt-auto p-3">
  <button
    onClick={logout}
    className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-[#69d0ac9e] transition"
  >
    <LogOut />
    <span>Logout</span>
  </button>
</div>
      </nav>
    </div>

  );
}
