import type { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authMiddleware } from "../../lib/middleware";

// ✅ Configure R2 S3 client
const s3 = new S3Client({
  region: "auto", // for R2 always "auto"
  endpoint: process.env.ENDPOINT, // e.g. "https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const key = `models/${Date.now()}_${Math.random()}.zip`;

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!, // your R2 bucket name
      Key: key,
      ContentType: "application/zip",
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

    return res.status(200).json({ url, key });
  } catch (error) {
    console.error("❌ R2 presign error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create R2 presigned URL" });
  }
}

export default authMiddleware(handler);
