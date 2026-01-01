import { User, LogOut, BookOpen, LucideClipboardPen,Award,Save} from "lucide-react";
import { Link, useLocation } from "react-router-dom";


 function ProfileHoverMenu() {
  return (
    <div className="relative group">
      <img
        src="/images/user.png"
        alt="Profile"
        className="w-10 h-10 rounded-full cursor-pointer"
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
          <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer">
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
    { name: "Home", path: "/home" },
    { name: "Explorepackages", path: "/explorepackages" },
    { name: "challenges", path: "/challenges" },
    { name: "Social feed", path: "/socialfeed" },
    { name: "About", path: "/about" },
  ];
  return (
    <div className="h-[100dvh] flex flex-col  ">
      <nav className=" backdrop-blur-lg bg-[#3ab19d]/40 shadow-md text-black flex justify-between items-center fixed w-full pt-1 pl-10 pr-10 z-50">
        <img src="/images/Logo.png" className="w-33 h-20"></img>
        <div className="flex gap-4 p-1 pt-2 rounded-lg  text-black font-semibold">
          {navItems.map((item)=>(
<Link key={item.name} to={item.path}
                className={`h-full w-40  flex justify-center align-center rounded-sm p-3 transition-all duration-300
                hover:bg-[#ffffff63] hover:shadow-md hover:-translate-y-1
                ${isActive(item.path) ? "bg-[#ffffff63] shadow-md" : ""}`}
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

