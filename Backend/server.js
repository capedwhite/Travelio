import express from "express"
import { connection } from "./src/Database/db.js";
import authRoutes from "./src/Routes/authRoutes.js"
import "./src/Config/passport.js";
import cors from "cors"
import passport from "passport";
const app = express();
const port="3000"


connection()
app.use(cors({
  origin:"http://localhost:5173",
  credentials: true,
}))
app.use(passport.initialize());
app.use(express.json())
app.use("/auth",authRoutes)
app.listen(port,()=>{
    console.log(`server running in port ${port}`)

})
