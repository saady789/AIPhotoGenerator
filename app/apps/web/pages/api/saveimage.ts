import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db"; // make sure this points to your Prisma client
import { authMiddleware } from "../../lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { falRequestId, prompt, generatedImage, currentModel, user } =
      req.body;

    if (
      !falRequestId ||
      !prompt ||
      !generatedImage ||
      !currentModel?.id ||
      !user?.id
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // ✅ Prisma insert into OutputImages table
    const newImage = await prisma.outputImages.create({
      data: {
        imageUrl: generatedImage,
        prompt,
        falAiRequestId: falRequestId,
        modelId: currentModel.id,
        userId: user.id,
        status: "Generated", // ✅ from OutputEnum
      },
    });

    console.log("✅ Image saved successfully:", newImage);

    return res.status(200).json({
      message: "Image saved successfully",
      data: newImage,
    });
  } catch (error: any) {
    console.error("❌ Error in /api/saveimage:", error);
    return res.status(500).json({
      message: "Image save failed",
      error: error.message || "Unknown error",
    });
  }
}

// ✅ Protect with Clerk auth
export default authMiddleware(handler);
