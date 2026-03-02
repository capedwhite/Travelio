import {
  User,
  LogOut,
  BookOpen,
  LucideClipboardPen,
  Award,
  Save,
  Menu,
  X,
} from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";

function ProfileHoverMenu() {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  console.log(user);
  return (
    <div className="relative flex justify-center items-center gap-2">
      <img
        src={
          user?.profileImage
            ? `http://localhost:3000/${user.profileImage}`
            : "/images/user.png"
        }
        alt="Profile"
        className="w-10 h-10 rounded-full cursor-pointer object-cover border-white border-1"
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="
              absolute right-0 top-12
              w-56
              bg-white
              shadow-xl
              rounded-lg
              border
              z-50
              transition-all
              duration-200
            "
          >
            <ul className="py-2">
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                {" "}
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <User size={18} />
                  My Profile
                </li>
              </Link>

              <Link to="/mybookings" onClick={() => setIsOpen(false)}>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <BookOpen size={18} />
                  My Bookings
                </li>
              </Link>
              <Link to="/mypackagerequests" onClick={() => setIsOpen(false)}>
                {" "}
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <LucideClipboardPen size={18} />
                  My Requests
                </li>
              </Link>
              <Link to="/myawards" onClick={() => setIsOpen(false)}>
                {" "}
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Award size={18} />
                  Challenge badges
                </li>
              </Link>
              <Link to="/myfavourites" onClick={() => setIsOpen(false)}>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Save size={18} />
                  Saved Packages
                </li>
              </Link>
              <li
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
              >
                <LogOut size={18} />
                Logout
              </li>
            </ul>
          </div>
        </>
      )}

      <span
        className="m-0 hidden md:block cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.username}
      </span>
    </div>
  );
}
export default function NavBar({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const navItems = [
    { name: "Explorepackages", path: "/explorepackages" },
    { name: "Challenges", path: "/challenges" },
    { name: "Social feed", path: "/socialfeed" },
    { name: "About", path: "/about" },
  ];
  return (
    <div className="h-[100dvh] flex flex-col">
      <nav className="shadow-lg text-black flex justify-between items-center fixed w-full px-3 sm:px-6 md:px-10 z-50 bg-white">
        <img
          src="/images/Logo.png"
          className="w-20 sm:w-28 md:w-33 h-14 sm:h-16 md:h-20 drop-shadow-md hover:scale-105 transition"
        ></img>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2 lg:gap-4 p-1 font-semibold bg-[#3ab19d] rounded-full shadow-sm overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`w-28 lg:w-40 flex justify-center items-center rounded-full px-2 py-2 lg:py-3 text-sm lg:text-md transition-all duration-300 hover:bg-white/70 hover:text-[#2c9c8c] hover:shadow-lg whitespace-nowrap
                ${isActive(item.path) ? "bg-white/90 rounded-full shadow-md text-[#2c9c8c] font-bold transition" : "text-white"}`}
            >
              <h3>{item.name}</h3>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:block">
          <ProfileHoverMenu></ProfileHoverMenu>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 sm:top-16 left-0 right-0 bg-white shadow-lg z-40 border-t max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-[#3ab19d] text-white font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="border-t pt-4 mt-4 space-y-2">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg"
              >
                <User size={18} />
                My Profile
              </Link>
              <Link
                to="/mybookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg"
              >
                <BookOpen size={18} />
                My Bookings
              </Link>
              <Link
                to="/mypackagerequests"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg"
              >
                <LucideClipboardPen size={18} />
                My Requests
              </Link>
              <Link
                to="/myawards"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg"
              >
                <Award size={18} />
                Challenge badges
              </Link>
              <Link
                to="/myfavourites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg"
              >
                <Save size={18} />
                Saved Packages
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="mt-14 sm:mt-16 md:mt-20">{children}</main>
    </div>
  );
}
