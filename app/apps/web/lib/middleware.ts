import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

/**
 * Universal JWT‑checking middleware for Next.js API routes.
 * Usage: export default authMiddleware(handler)
 */
export function authMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
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

      // Verify the JWT
      const decoded = jwt.verify(token, process.env.AUTH_JWT_KEY as string);

      console.log("✅ Token Decoded:", decoded);

      // Optionally attach user to req
      (req as any).user = decoded;

      // If everything is good → go to actual handler
      return handler(req, res);
    } catch (err) {
      console.error("❌ Token verification failed:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
}
