import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // ✅ get the real token part

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // ✅ verify the token using your secret key
    const decoded = jwt.verify(token, process.env.AUTH_JWT_KEY as string);
    console.log(decoded);
    // (req as any).user = decoded; // attach user info to request
    next(); // ✅ move to the next middleware / route
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
