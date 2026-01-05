import express from "express"
import { getPackage } from "../Controller/packageController.js";
const router = express.Router();
router.get("/explorepackages",getPackage)
export default router