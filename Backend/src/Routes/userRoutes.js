import express from "express"
import { getactivePackage, getPackageByid } from "../Controller/packageController.js";
import { bargain, bookpackage } from "../Controller/bookingController.js";
import init from "../Controller/initController.js";
import { getAllChallenges, getTopChallengeUsers, submitChallenge, getChallengeById } from "../Controller/ChallengeController.js";
import {
  createPost,
  getAllPosts,
  toggleLike,
  addComment,
  toggleFollow,
  getTopUsers,
  getFollowing,
  getUserProfile
} from "../Controller/postController.js";
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

// Social Feed Routes
router.post("/posts", upload.single("image"), createPost)
router.get("/posts", getAllPosts)
router.post("/posts/:postId/like", toggleLike)
router.post("/posts/:postId/comment", addComment)
router.post("/users/:userId/follow", toggleFollow)
router.get("/topusers", getTopUsers)
router.get("/following", getFollowing)
router.get("/users/:userId", getUserProfile)

export default router