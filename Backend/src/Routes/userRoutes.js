import express from "express"
import { getPackage, getPackageByid } from "../Controller/packageController.js";
const router = express.Router();
router.get("/explorepackages",getPackage)
router.get("/explorepackages/:id",getPackageByid)
export default router