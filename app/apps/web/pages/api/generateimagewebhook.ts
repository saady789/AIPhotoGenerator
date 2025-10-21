import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      console.log("post is not allowed so returning ");
      return res.status(405).json({ message: "Method not allowed" });
    }

    console.log("Image generation webhook hit:", req.body);

    // Optional: process image URL and save to DB
    return res.status(200).json({ message: "Image webhook received" });
  } catch (err: any) {
    console.error("Error in image webhook:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}
