  import nodeMailer from "nodemailer";
  import express from "express";
  import User from "../db";
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";

  const router = express.Router();

  router.post("/signup", async (req, res): Promise<any> => {
    try {
      console.log("body", req.body);

      const { username, email, password, name, profileImg, acceptTnC } = req.body;
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });

      if (existingUser) {
        res.status(400).json({ message: "Username or Email already exists" });
        return;
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        acceptTnC,
        name,
        profileImg,
      });

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post("/login", async (req, res): Promise<any> => {
    try {
      console.log('body',req.body);
      
      const { username, email, password } = req.body;
      const user = await User.findOne({ $or: [{ username }, { email }] });
      console.log('user',user);
      
      if (!user) res.status(400).json({ message: "User does not exists" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) res.status(400).json({ message: "Invalid Credentials." });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,{expiresIn:'60d'});

      res
        .status(200)
        .cookie("token", token, {
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 24 * 60 * 60 * 1000,
        })
        .json({ message: "logged in successfully",token });
    } catch (error) {
      res.status(500).json({ message: `Server error, ${(error as Error).message}` });
    }
  });

  router.post("/verify-email", async (req, res): Promise<any> => {
    try {
      const { email } = req.body;
      
      const ogOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
        from: "guptas3067@gmail.com",
      });

      const options = {
        to: email.toString(),
        subject: "Your Verification Code",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
        <p style="font-size: 16px; color: #333;">Dear User,</p>
        <p style="font-size: 16px; color: #333;">Your verification code is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
            ${ogOtp}
          </span>
        </div>
        <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
        <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
          <p>Thank you,<br>Your Company Team</p>
          <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
        </footer>
      </div>
    `,
      };

      await transporter.sendMail(options);
      res.status(200).json({ ogOtp });
    } catch (error) {
      res.status(500).json({ message: `Server error, ${(error as Error).message}` });
    }
  });

  export { router as authRouter };
