import { User, LogOut, BookOpen, LucideClipboardPen,Award,Save} from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";


 function ProfileHoverMenu() {
  const {logout}=useAuth()
  return (
    <div className="relative group">
      <img
        src="/images/user.png"
        alt="Profile"
        className="w-10 h-10 rounded-full cursor-pointer border-white border-1"
      />

      <div
        className="
          absolute right-0 top-12
          w-56
          bg-white
          shadow-xl
          rounded-lg
          border
          opacity-0
          invisible
          group-hover:opacity-100
          group-hover:visible
          transition-all
          duration-200
        "
      >
        <ul className="py-2">
          <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <User size={18} />
            My Profile
        
          </li>
                 <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <BookOpen size={18} />
            My Bookings
        
          </li>
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <LucideClipboardPen size={18} />
            My Requests
          </li>
                              <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <Award size={18} />
            Challenge badges
          </li>
      <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <Save size={18} />
          Saved Packages
          </li>
          <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer" onClick={logout}>
            <LogOut size={18} />
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
}
export default function NavBar({ children }) 
{

    const location = useLocation();
       const isActive = (path) => location.pathname === path;
     const navItems = [
    { name: "Explorepackages", path: "/explorepackages" },
    { name: "Challenges", path: "/challenges" },
    { name: "Social feed", path: "/socialfeed" },
    { name: "About", path: "/about" },
  ];
  return (
    <div className="h-[100dvh] flex flex-col  ">
      <nav className=" 

  shadow-lg
  text-black
  flex
  justify-between
  items-center
  fixed
  w-full
  pl-10
  pr-10
  z-50
  bg-white
">
        <img src="/images/Logo.png" className="w-33 h-20 drop-shadow-md hover:scale-105 transition"></img>
        <div className="flex gap-4 prounded-lg p-1  font-semibold  bg-[#3ab19d] rounded-full shadow-sm">
          {navItems.map((item)=>(
<Link key={item.name} to={item.path}
                className={` w-40
                  
    flex justify-center items-center
    rounded-full

    px-2 py-3
    text-md
    transition-all duration-300
    hover:bg-white/70
    hover:text-[#2c9c8c]
    hover:shadow-lg
    hover:-translate-y-0.5

                ${isActive(item.path) ? "bg-white/90 rounded-full shadow-md text-[#2c9c8c] font-bold transition" : "text-    text-white"}`}
              >
                <h3>{item.name}</h3>
          </Link>
          ))
          }

        </div>
        <ProfileHoverMenu></ProfileHoverMenu>
      </nav>

      {children}
    </div>
  );
}

