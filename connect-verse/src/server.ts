import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { authMiddleware } from "./middleware";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error(`❌ Missing environment variables`);
  process.exit(1);
}

// limit requests to 100 per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);

app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Server error, ${(error as Error).message}` });
  }
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Connection Error:", err));

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Server running on port 3000`));
