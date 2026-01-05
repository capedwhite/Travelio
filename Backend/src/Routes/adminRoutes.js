import express from "express"
import upload from "../Config/multer.js";
import { createPackage } from "../Controller/packageController.js"
const router = express.Router()
router.post("/addpackages",upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'hotelImages', maxCount: 10 },
    { name: 'touristImages', maxCount: 10 }
]),createPackage)
export default router