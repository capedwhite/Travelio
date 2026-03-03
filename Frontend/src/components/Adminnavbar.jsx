import {
  Home,
  Package,
  ClipboardList,
  DollarSign,
  Award,
  LogOut,
  Upload,
  HandHeart,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";

export default function AdminSidebar({ children }) {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/admin/dashboard" },
    {
      name: "Packages",
      icon: <Package size={18} />,
      path: "/admin/createpackages",
    },
    {
      name: "Bookings",
      icon: <ClipboardList size={18} />,
      path: "/admin/bookings",
    },
    {
      name: "Bargain Requests",
      icon: <DollarSign size={18} />,
      path: "/admin/bargainrequest",
    },
    {
      name: "Challenges",
      icon: <Award size={18} />,
      path: "/admin/addchallenges",
    },
    {
      name: "Submissions",
      icon: <Upload size={18} />,
      path: "/admin/viewchallenges",
    },
    {
      name: "packageRequests",
      icon: <HandHeart size={18} />,
      path: "/admin/viewuserrequests",
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#3ab19d] text-white h-14 flex items-center justify-between px-4 z-50">
        <span className="text-xl font-bold">Admin Panel</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-14 left-0 w-64 bg-[#3ab19d] h-[calc(100vh-3.5rem)] text-white flex flex-col z-50 transform transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="mt-4 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {navItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              onClick={() => setMobileMenuOpen(false)}
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
        </nav>
        <div className="mt-auto p-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-[#69d0ac9e] transition"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#3ab19d] h-screen text-white flex-col fixed">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
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

      {/* Main Content Wrapper */}
      {children && (
        <main className="min-h-screen pt-14 lg:pt-0 lg:ml-64">{children}</main>
      )}
    </>
  );
}
