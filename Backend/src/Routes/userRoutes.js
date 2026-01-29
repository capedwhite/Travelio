import express from "express"
import { getactivePackage, getPackageByid, createPackageRequest } from "../Controller/packageController.js";
import { bargain, bookpackage, getUserBookings } from "../Controller/bookingController.js";
import { getUserPackageRequests, getUserBargainRequests } from "../Controller/packageController.js";
import init from "../Controller/initController.js";
import { getAllChallenges, getTopChallengeUsers, submitChallenge, getChallengeById } from "../Controller/ChallengeController.js";
import { getUserAwards, markAwardAsUsed } from "../Controller/awardController.js";
import {
  createPost,
  getAllPosts,
  toggleLike,
  addComment,
  toggleFollow,
  getTopUsers,
  getFollowing,
  getUserProfile,
  getFollowedPosts,
  updatePost,
  deletePost,
  getProfile,
  updateUserProfile
} from "../Controller/postController.js";
import upload from "../Config/multer.js";

const router = express.Router();

router.get("/init",init)
router.get("/explorepackages",getactivePackage)
router.get("/explorepackages/:id",getPackageByid)
router.post("/explorepackages/bargain",bargain)
router.post("/explorepackages/booking",bookpackage)
router.post("/explorepackages/request", createPackageRequest)
router.get("/mypackagerequests", getUserPackageRequests)
router.get("/mybargainpackages", getUserBargainRequests)
router.get("/mybookings", getUserBookings)
router.get("/getchallenges",getAllChallenges)
router.get("/getchallenges/:id",getChallengeById)
router.post("/getchallenges/:id",upload.any(),submitChallenge)
router.get("/gettopusers",getTopChallengeUsers)

// Social Feed Routes
router.post("/posts", upload.single("image"), createPost)
router.get("/posts", getAllPosts)
router.put("/posts/:postId", upload.single("image"), updatePost)
router.delete("/posts/:postId", deletePost)
router.post("/posts/:postId/like", toggleLike)
router.post("/posts/:postId/comment", addComment)
router.post("/users/:userId/follow", toggleFollow)
router.get("/topusers", getTopUsers)
router.get("/following", getFollowing)
router.get("/users/:userId", getUserProfile)
router.get("/followed-posts", getFollowedPosts)

// Profile Routes
router.get("/profile", getProfile)
router.put("/profile", upload.single("profileImage"), updateUserProfile)

// Award Routes
router.get("/awards", getUserAwards)
router.put("/awards/:awardId/use", markAwardAsUsed)

export default router