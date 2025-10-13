import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db"; // adjust import if you have a local prisma instance
import { TrainModel } from "common/types";
import { FalAIModel } from "../../lib/models/FalAiModel";
import { authMiddleware } from "../../lib/middleware";

const falAiModel = new FalAIModel();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("FAL_KEY loaded:", process.env.FAL_KEY);
    // ✅ Allow only POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    // ✅ Validate input body
    const parsedBody = TrainModel.safeParse(req.body);
    console.log("Parsed body:", parsedBody);

    if (!parsedBody.success) {
      return res.status(411).json({ message: "Input Incorrect" });
    }

    // ✅ Generate trigger word
    const triggerWord =
      parsedBody.data.name.toLowerCase().replace(/\s+/g, "") +
      "_" +
      Math.random().toString(36).substring(2, 7);

    // ✅ Start training request on Fal
    console.log("started training of the model");
    const request_id = await falAiModel.trainModel(
      parsedBody.data.zipUrl,
      triggerWord
    );
    console.log("training successful");
    // ✅ Save new model record in DB
    const data = await prisma.model.create({
      data: {
        name: parsedBody.data.name,
        age: parsedBody.data.age,
        type: parsedBody.data.type,
        ethnicity: parsedBody.data.ethinicity,
        eyeColor: parsedBody.data.eyeColor,
        bald: parsedBody.data.bald,
        userId: parsedBody.data.userId, // from client for now (later attach from JWT)
        triggerWord,
        tensorPath: "sdf", // will be replaced after webhook updates it
        trainingStatus: "Pending",
        falAiRequestId: request_id,
        zipUrl: parsedBody.data.zipUrl,
      },
    });
    console.log("stored in the db");

    // ✅ Respond with created model ID
    return res.status(200).json({ modelId: data.id });
  } catch (error: any) {
    console.error("Error in /api/ai/training:", error);
    return res.status(500).json({
      message: "Training failed",
      error: error.message || "Unknown error",
    });
  }
}

// ✅ Wrap with your all-in-one JWT middleware
export default authMiddleware(handler);
