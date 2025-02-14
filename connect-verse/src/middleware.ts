import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";
import User from "./db";
import { Request, Response } from "express";

export async function authMiddleware(
  req: Request,
  res: Response,
  next
): Promise<any> {
  try {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ message: "Unauthorized token" });

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const user = await User.findById(decode.userId);

    if (!user) 
      return res.status(401).json({ message: "User does not exist, please sign in" });
    

    res.locals.user = user;
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    } else if (error instanceof JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid token. Access denied." });
    } else {
      return res
        .status(500)
        .json({ message: "Server error during token verification" });
    }
  }
}
