import type { NextApiRequest, NextApiResponse } from "next";
import { S3Client, s3, write } from "bun";
import { authMiddleware } from "../../lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "Test route is working!" });
}

export default authMiddleware(handler);
