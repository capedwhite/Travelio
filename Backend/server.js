import express from "express";
import { connection } from "./src/Database/db.js";
import authRoutes from "./src/Routes/authRoutes.js";
import "./src/Config/passport.js";
import cors from "cors";
import passport from "passport";
import { protect } from "./src/Middleware/authmiddleware.js";
import "./src/Model/index.js";
import adminRoutes from "./src/Routes/adminRoutes.js";
import userRoutes from "./src/Routes/userRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connection();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/uploads", express.static("uploads"));
app.use(passport.initialize());
app.use(express.json());
app.use("/auth", authRoutes);
app.use(protect);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.listen(port, () => {
  console.log(`server running in port ${port}`);
});
