import React, { Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import NavBar from "../components/Usernavbar"
import AboutPage from "../Pages/public/aboutpage"
import ProtectedRoute from "./protectedroute"

const ExplorePackages = React.lazy(()=>import("../Pages/private/ExplorePackages"))
const CreatePackage=React.lazy(()=>import("../Pages/private/CreatePackage"))
const PackageDetailsPage=React.lazy(()=>import("../Pages/private/packagedetails"))
const PackageSocialFeed=React.lazy(()=>import("../Pages/private/SocialFeed"))
const TravelChallenges=React.lazy(()=>import("../Pages/private/ChallengesPage"))
const AdminDashboard=React.lazy(()=>import("../Pages/private/admindashboard"))
const AdminBookingsPage =React.lazy(()=>import("../Pages/private/viewbookings"))
const PrivateRoutes=()=>{
    return(
    <Suspense fallback={<div>Loading</div>}>

        <Routes>

           <Route path="/explorepackages" element={ <ProtectedRoute allowedroles={["User"]}><NavBar><ExplorePackages></ExplorePackages></NavBar></ProtectedRoute>}></Route>
     <Route path="/explorepackages/:id" element={<ProtectedRoute allowedroles={["User"]}><NavBar><PackageDetailsPage></PackageDetailsPage></NavBar></ProtectedRoute>}></Route>
    <Route path="/socialfeed" element={<NavBar><PackageSocialFeed></PackageSocialFeed></NavBar>}></Route>
     <Route path="/Challenges" element={<NavBar><TravelChallenges></TravelChallenges></NavBar>}></Route>
     <Route path="/about" element={<NavBar><AboutPage></AboutPage></NavBar>}></Route>
        <Route path="*" element={<ProtectedRoute allowedroles={["User"]}><Navigate to="/explorepackages" replace></Navigate></ProtectedRoute>}></Route>
     <Route path="admin/dashboard" element={<ProtectedRoute allowedroles={["Admin"]}> <AdminDashboard></AdminDashboard></ProtectedRoute>}/>
     <Route path="admin/createpackages" element={<CreatePackage></CreatePackage>}/>
       <Route path="admin/bookings" element={<AdminBookingsPage></AdminBookingsPage>}/> 
                      <Route path="/unauthorized" element={<p className="flex items-center justify-center text-4xl h-[100dvh] font-bold ">Unauthorized page</p>}></Route>
 </Routes>
 



    </Suspense>
    )
}
export default PrivateRoutes