import { Navigate, Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import NavBar from "../components/Usernavbar";
import ForgetPassword from "../Pages/public/Forgetpassword";
import ResetPassword from "../Pages/public/ResetPassword";
import { GoogleSuccess } from "../Pages/public/Login";
import LandingNavbar from "../components/LandingNavbar";

const Landing = React.lazy(() => import("../Pages/public/LandingPage"));
const LoginPage = React.lazy(() => import("../Pages/public/Login"));
const SignupPage = React.lazy(() => import("../Pages/public/Signup"));
const AboutPage = React.lazy(() => import("../Pages/public/aboutpage"));
const Publicroutes = () => {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <Routes>
        <Route path="/landing" element={<LandingNavbar><Landing /></LandingNavbar>}></Route>
        <Route path="/login" element={<LandingNavbar><LoginPage></LoginPage></LandingNavbar>}></Route>
        <Route path="/Signup" element={<LandingNavbar><SignupPage></SignupPage></LandingNavbar>}></Route>
        <Route
          path="auth/google/callback/google-success"
          element={<GoogleSuccess />}
        />
        <Route
          path="/about"
          element={
<LandingNavbar>
              <AboutPage></AboutPage>
</LandingNavbar>
          }
        ></Route>
        <Route
          path="/forgetpassword"
          element={<ForgetPassword></ForgetPassword>}
        ></Route>
        <Route
          path="/reset-password/:token"
          element={<ResetPassword></ResetPassword>}
        ></Route>
        <Route
          path="*"
          element={<Navigate to="/landing" replace></Navigate>}
        ></Route>
      </Routes>
    </Suspense>
  );
};

export default Publicroutes;
