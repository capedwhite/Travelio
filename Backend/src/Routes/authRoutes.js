import express from "express";
import {
  googleCallback,
  login,
  signUp,
  forgotPassword,
  resetPassword,
} from "../Controller/authcontroller.js";
import passport from "passport";
import { getactivePackage } from "../Controller/packageController.js";
const router = express.Router();
router.post("/login", login);
router.post("/signup", signUp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// router.get("/Getuser",getUser)
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  googleCallback,
);
router.get("/explorepackages", getactivePackage);
export default router;
