import { Navigate, Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import NavBar from "../components/Usernavbar";
import ForgetPassword from "../Pages/public/Forgetpassword";
import ResetPassword from "../Pages/public/ResetPassword";
import { GoogleSuccess } from "../Pages/public/Login";

const Landing = React.lazy(() => import("../Pages/public/LandingPage"));
const LoginPage = React.lazy(() => import("../Pages/public/Login"));
const SignupPage = React.lazy(() => import("../Pages/public/Signup"));
const AboutPage = React.lazy(() => import("../Pages/public/aboutpage"));
const Publicroutes = () => {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <Routes>
        <Route path="/landing" element={<Landing />}></Route>
        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        <Route path="/Signup" element={<SignupPage></SignupPage>}></Route>
        <Route
          path="auth/google/callback/google-success"
          element={<GoogleSuccess />}
        />
        <Route
          path="/about"
          element={
            <NavBar>
              <AboutPage></AboutPage>
            </NavBar>
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
