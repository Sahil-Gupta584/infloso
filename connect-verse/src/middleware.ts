import jwt, { JwtPayload } from "jsonwebtoken";
import User from "./models";
import { Request, Response } from "express";

export async function authMiddleware(req:Request, res:Response, next):Promise<any> {
  try {
    const token = req.cookies?.token;
    console.log('token',token);
    
    if (!token) return res.status(401).json({ message: "Unauthorized token" });

    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await User.findOne({ _id: decode.userId });

    if (!user)
      res.status(400).json({ message: "User does not exists, please signIn" });

    res.locals.user = user;
    next();
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Server Error" });
  }
}
