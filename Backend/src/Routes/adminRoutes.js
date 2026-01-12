import express from "express"
import upload from "../Config/multer.js";
import { createPackage } from "../Controller/packageController.js"
import { getallbargains, getAllbookings } from "../Controller/bookingController.js";
const router = express.Router()
router.post("/addpackages",upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'hotelImages', maxCount: 10 },
    { name: 'touristImages', maxCount: 10 }
]),createPackage)
router.get("/packagebooking",getAllbookings)
router.get("/packagebargain",getallbargains)
export default router