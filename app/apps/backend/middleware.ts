import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    console.log("🔐 Auth Header:", authHeader);
    console.log("🔑 Token:", token);

    if (!token) {
      console.log("⛔ No token found.");
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.AUTH_JWT_KEY as string);
    console.log("✅ Token Decoded:", decoded);

    // (req as any).user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
