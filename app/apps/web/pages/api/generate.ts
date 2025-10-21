import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";
import { FalAIModel } from "../../lib/models/FalAiModel";
import { authMiddleware } from "../../lib/middleware";

const falAiModel = new FalAIModel();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
    console.log("body is ", req.body);
    const tensorPath = req.body.model.tensorPath;
    const prompt = req.body.prompt;
    const request_id = falAiModel.generateImage(prompt, tensorPath);
    console.log("training successful");

    return res.status(200).json({ message: "api hit was successful" });
  } catch (error: any) {
    console.error("Error in /api/ai/training:", error);
    return res.status(500).json({
      message: "Training failed",
      error: error.message || "Unknown error",
    });
  }
}

// ✅ Wrap with your all-in-one JWT middleware
// export default handler;
export default authMiddleware(handler);
