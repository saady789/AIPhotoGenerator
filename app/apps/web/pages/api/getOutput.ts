import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";
import JSZip from "jszip";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const output = await prisma.outputImages.findMany({
      where: { userId },
    });
    return res.status(200).json(output);
  } catch (error) {
    console.error("API Error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
