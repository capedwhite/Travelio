import express from "express"
import { connection } from "./src/Database/db.js";
import authRoutes from "./src/Routes/authRoutes.js"
const app = express();
const port="3000"


connection()

app.use(express.json())
app.use("/auth",authRoutes)
app.listen(port,()=>{
    console.log(`server running in port ${port}`)

})