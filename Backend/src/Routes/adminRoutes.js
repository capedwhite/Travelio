import express from "express"
import upload from "../Config/multer.js";
import { createPackage, deletePackage, getPackageByid, updatePackage } from "../Controller/packageController.js"
import { getallbargains, getAllbookings, updateBookingStatus } from "../Controller/bookingController.js";
import { createChallenge, getAllChallenges, getChallengeById, updateChallenge, deleteChallenge, getAllChallengesWithSubmissions, setChallengeWinner } from "../Controller/ChallengeController.js";

const router = express.Router()
router.post("/addpackages",upload.any(),createPackage)
router.get("/packagebooking",getAllbookings)
router.get("/packagebargain",getallbargains)
router.delete("/addpackages/:id",deletePackage)
router.put("/addpackages/:id",upload.any(),updatePackage)
router.get("/addpackages/:id",getPackageByid)
router.post("/addchallenges",createChallenge)
router.get("/getchallenges",getAllChallenges)
router.get("/getchallenges/:id",getChallengeById)
router.put("/getchallenges/:id",updateChallenge)
router.delete("/getchallenges/:id",deleteChallenge)
router.put("/booking/:bookingId/status", updateBookingStatus)
router.get("/challenges/submissions", getAllChallengesWithSubmissions)
router.put("/challenges/:challengeId/winner/:winnerId", setChallengeWinner)
export default router