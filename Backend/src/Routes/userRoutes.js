import express from "express"
import { getPackage, getPackageByid } from "../Controller/packageController.js";
import { bargain, bookpackage } from "../Controller/bookingController.js";
const router = express.Router();
router.get("/explorepackages",getPackage)
router.get("/explorepackages/:id",getPackageByid)
router.post("/explorepackages/bargain",bargain)
router.post("/explorepackages/booking",bookpackage)
export default router