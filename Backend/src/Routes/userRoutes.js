import express from "express"
import { getactivePackage, getPackageByid } from "../Controller/packageController.js";
import { bargain, bookpackage } from "../Controller/bookingController.js";
import init from "../Controller/initController.js";
import { getAllChallenges, getTopChallengeUsers, submitChallenge, getChallengeById } from "../Controller/ChallengeController.js";
import upload from "../Config/multer.js";

const router = express.Router();

router.get("/init",init)
router.get("/explorepackages",getactivePackage)
router.get("/explorepackages/:id",getPackageByid)
router.post("/explorepackages/bargain",bargain)
router.post("/explorepackages/booking",bookpackage)
router.get("/getchallenges",getAllChallenges)
router.get("/getchallenges/:id",getChallengeById)
router.post("/getchallenges/:id",upload.any(),submitChallenge)
router.get("/gettopusers",getTopChallengeUsers)
export default router