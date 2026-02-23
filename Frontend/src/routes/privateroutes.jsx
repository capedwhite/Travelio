import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "../components/Usernavbar";
import AboutPage from "../Pages/public/aboutpage";
import ProtectedRoute from "./protectedroute";
import { ClipLoader } from "react-spinners";
import RoleRedirect from "./roleRedirect";
import MyChallengeAwards from "../Pages/private/Mychallengebadges";

const ExplorePackages = React.lazy(
  () => import("../Pages/private/ExplorePackages"),
);
const CreatePackage = React.lazy(
  () => import("../Pages/private/CreatePackage"),
);
const PackageDetailsPage = React.lazy(
  () => import("../Pages/private/packagedetails"),
);
const PackageSocialFeed = React.lazy(
  () => import("../Pages/private/SocialFeed"),
);
const TravelChallenges = React.lazy(
  () => import("../Pages/private/ChallengesPage"),
);
const MyProfile = React.lazy(() => import("../Pages/private/Myprofile"));
const MyBookingStatus = React.lazy(
  () => import("../Pages/private/Mybookingstatus"),
);
const AdminDashboard = React.lazy(
  () => import("../Pages/private/admindashboard"),
);
const AdminBookingsPage = React.lazy(
  () => import("../Pages/private/viewbookings"),
);
const BargainRequests = React.lazy(
  () => import("../Pages/private/adminbargainpage"),
);
const AddChallenges = React.lazy(() => import("../Pages/private/AddChalleges"));
const ViewChallenges = React.lazy(
  () => import("../Pages/private/viewChallenges"),
);
const ViewUserRequests = React.lazy(
  () => import("../Pages/private/viewuserRequests"),
);
const Mypackagerequests = React.lazy(
  () => import("../Pages/private/Mypackagerequests"),
);
const MyFavourites = React.lazy(() => import("../Pages/private/myfavourties"));
const PrivateRoutes = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><ClipLoader size={50} /></div>}>
      <Routes>
        <Route
          path="/explorepackages"
          element={
            <ProtectedRoute allowedroles={["User"]}>
              <NavBar>
                <ExplorePackages></ExplorePackages>
              </NavBar>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/explorepackages/:id"
          element={
            <ProtectedRoute allowedroles={["User"]}>
              <NavBar>
                <PackageDetailsPage></PackageDetailsPage>
              </NavBar>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/socialfeed"
          element={
            <ProtectedRoute allowedroles={["User"]}>
            <NavBar>
              <PackageSocialFeed></PackageSocialFeed>
            </NavBar>
            </ProtectedRoute>
          }
        ></Route>
                <Route
                  path="/about"
                  element={
        <ProtectedRoute allowedroles={["User"]}>
        <NavBar>
                      <AboutPage></AboutPage>
        </NavBar>
        </ProtectedRoute>
                  }
                ></Route>
        <Route
          path="/challenges"
          element={
            <NavBar>
              <TravelChallenges></TravelChallenges>
            </NavBar>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <NavBar>
              <MyProfile></MyProfile>
            </NavBar>
          }
        ></Route>
        <Route
          path="/mybookings"
          element={
            <NavBar>
              <MyBookingStatus></MyBookingStatus>
            </NavBar>
          }
        ></Route>
        <Route
          path="/myawards"
          element={
            <NavBar>
              <MyChallengeAwards />
            </NavBar>
          }
        ></Route>
        <Route
          path="/mypackagerequests"
          element={
            <NavBar>
              <Mypackagerequests></Mypackagerequests>
            </NavBar>
          }
        ></Route>
        <Route
          path="/myfavourites"
          element={
            <NavBar>
              <MyFavourites></MyFavourites>
            </NavBar>
          }
        ></Route>
        <Route
          path="/about"
          element={
            <NavBar>
              <AboutPage></AboutPage>
            </NavBar>
          }
        ></Route>

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedroles={["Admin"]}>
              <AdminDashboard></AdminDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/createpackages"
          element={
            <ProtectedRoute allowedroles={["Admin"]}>
              <CreatePackage></CreatePackage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedroles={["Admin"]}>
              <AdminBookingsPage></AdminBookingsPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bargainrequest"
          element={
            <ProtectedRoute allowedroles={["Admin"]}>
              <BargainRequests></BargainRequests>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addchallenges"
          element={
            <ProtectedRoute allowedroles={["Admin"]}>
              <AddChallenges></AddChallenges>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/viewchallenges"
          element={
            <ProtectedRoute allowedroles={["Admin"]}>
              <ViewChallenges></ViewChallenges>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/viewuserrequests"
          element={
            <ProtectedRoute allowedroles={["Admin"]}>
              <ViewUserRequests></ViewUserRequests>
            </ProtectedRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={
            <p className="flex items-center justify-center text-4xl h-[100dvh] font-bold ">
              Unauthorized page
            </p>
          }
        ></Route>

        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </Suspense>
  );
};
export default PrivateRoutes;
