import express from "express";
import {
  getactivePackage,
  getPackageByid,
  createPackageRequest,
} from "../Controller/packageController.js";
import {
  bargain,
  bookpackage,
  getUserBookings,
} from "../Controller/bookingController.js";
import {
  getUserPackageRequests,
  getUserBargainRequests,
} from "../Controller/packageController.js";
import init from "../Controller/initController.js";
import {
  getAllChallenges,
  getTopChallengeUsers,
  submitChallenge,
  getChallengeById,
} from "../Controller/ChallengeController.js";
import {
  getUserAwards,
  markAwardAsUsed,
} from "../Controller/awardController.js";
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
  updateUserProfile,
} from "../Controller/postController.js";
import {
  getPackageReviews,
  addReview,
  deleteReview,
} from "../Controller/reviewController.js";
import {
  toggleFavorite,
  getUserFavorites,
  getUserFavoriteIds,
} from "../Controller/favoriteController.js";
import { userHeartbeat } from "../Controller/dashboardController.js";
import upload from "../Config/multer.js";

const router = express.Router();

// Heartbeat for tracking active users
router.post("/heartbeat", userHeartbeat);

router.get("/init", init);
router.get("/explorepackages", getactivePackage);
router.get("/explorepackages/:id", getPackageByid);
router.post("/explorepackages/bargain", bargain);
router.post("/explorepackages/booking", bookpackage);
router.post("/explorepackages/request", createPackageRequest);
router.get("/mypackagerequests", getUserPackageRequests);
router.get("/mybargainpackages", getUserBargainRequests);
router.get("/mybookings", getUserBookings);

// ChallengesRoutes 
router.get("/getchallenges", getAllChallenges);
router.get("/getchallenges/:id", getChallengeById);
router.post("/getchallenges/:id", upload.any(), submitChallenge);
router.get("/gettopusers", getTopChallengeUsers);

// SocialFeedRoutes
router.post("/posts", upload.single("image"), createPost);
router.get("/posts", getAllPosts);
router.put("/posts/:postId", upload.single("image"), updatePost);
router.delete("/posts/:postId", deletePost);
router.post("/posts/:postId/like", toggleLike);
router.post("/posts/:postId/comment", addComment);
router.post("/users/:userId/follow", toggleFollow);
router.get("/topusers", getTopUsers);
router.get("/following", getFollowing);
router.get("/users/:userId", getUserProfile);
router.get("/followed-posts", getFollowedPosts);

// ProfileRoutes
router.get("/profile", getProfile);
router.put("/profile", upload.single("profileImage"), updateUserProfile);

// Award Routes
router.get("/awards", getUserAwards);
router.put("/awards/:awardId/use", markAwardAsUsed);

// Review Routes
router.get("/packages/:packageId/reviews", getPackageReviews);
router.post("/packages/:packageId/reviews", addReview);
router.delete("/reviews/:reviewId", deleteReview);

// Favorite Routes
router.post("/favorites/toggle", toggleFavorite);
router.get("/favorites", getUserFavorites);
router.get("/favorites/ids", getUserFavoriteIds);

export default router;
