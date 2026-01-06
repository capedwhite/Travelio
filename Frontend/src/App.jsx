import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import LoginPage, { GoogleSuccess } from "./Pages/public/Login";
import ForgetPassword from "./Pages/private/Forgetpassword";
import PackageSocialFeed from "./Pages/private/SocialFeed";
import TravelChallenges from "./Pages/private/ChallengesPage";
import SignupPage from "./Pages/public/Signup";
import NavBar from "./components/Usernavbar"
import ExplorePackages from "./Pages/private/ExplorePackages";
import AdminSidebar from "./components/Adminnavbar";
import AdminDashboard from "./Pages/private/admindashboard";
import CreatePackage from "./Pages/private/CreatePackage";
import { AuthProvider } from "./context/authContext";
import Landing from "./Pages/public/LandingPage";
import PackageDetailsPage from "./Pages/private/packagedetails";
import AdminBookingsPage from "./Pages/private/viewbookings";
import AboutPage from "./Pages/public/aboutpage";

function App() {
  return(
    <AuthProvider>
<BrowserRouter>
<Routes >
    <Route path="/landing" element={<Landing></Landing>}></Route>
  <Route path="/login" element={<LoginPage></LoginPage>}></Route>
    <Route path="/Signup" element={<SignupPage></SignupPage>}></Route>
        <Route path="/about" element={<AboutPage></AboutPage>}></Route>
    <Route path="/explorepackages" element={<NavBar><ExplorePackages></ExplorePackages></NavBar>}></Route>
     <Route path="/explorepackages/:id" element={<NavBar><PackageDetailsPage></PackageDetailsPage></NavBar>}></Route>
    <Route path="/forgetpassword" element={<ForgetPassword></ForgetPassword>}></Route>
    <Route path="auth/google/callback/google-success" element={<GoogleSuccess/>} />
    <Route path="/socialfeed" element={<NavBar><PackageSocialFeed></PackageSocialFeed></NavBar>}></Route>
     <Route path="/Challenges" element={<NavBar><TravelChallenges></TravelChallenges></NavBar>}></Route>
     <Route path="admin/dashboard" element={<AdminDashboard></AdminDashboard>}/>
     <Route path="admin/createpackages" element={<CreatePackage></CreatePackage>}/>
       <Route path="admin/bookings" element={<AdminBookingsPage></AdminBookingsPage>}/>
</Routes>
  </BrowserRouter>
  </AuthProvider>
  )
}


export default App
