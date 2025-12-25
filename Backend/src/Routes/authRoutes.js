import express from "express"
import { getUser, login, signUp } from "../Controller/Authcontroller.js"
const router = express.Router()
router.post("/login",login)
router.post("/signup",signUp)
router.get("user",getUser)
export default router