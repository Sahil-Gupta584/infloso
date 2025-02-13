import express from "express";
import User from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res): Promise<any> => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res): Promise<any> => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) res.status(400).json({ message: "User does not exists" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) res.status(400).json({ message: "Invalid Credentials." });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export { router as authRouter };
