import express from "express"
import upload from "../Config/multer.js";
import { createPackage, deletePackage, getPackageByid, updatePackage } from "../Controller/packageController.js"
import { getallbargains, getAllbookings } from "../Controller/bookingController.js";
const router = express.Router()
router.post("/addpackages",upload.any(),createPackage)
router.get("/packagebooking",getAllbookings)
router.get("/packagebargain",getallbargains)
router.delete("/addpackages/:id",deletePackage)
router.put("/addpackages",updatePackage)
router.get("/addpackages/:id",getPackageByid)
export default router