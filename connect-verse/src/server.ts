import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { authMiddleware } from "./middleware";
import cookieParser from 'cookie-parser';

dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error(`❌ Missing environment variables`);
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.use("/", authRouter);

app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).json({ user });
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Server error"})
  }
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Connection Error:", err));

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Server running on port 3000`));
