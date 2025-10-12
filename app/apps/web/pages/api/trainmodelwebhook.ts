import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
    const requestId = req.body.request_id;
    if (!requestId || !req.body.tensor_path) {
      return res
        .status(400)
        .json({ message: "Missing request_id or tensor_path" });
    }

    console.log("Fal.ai training webhook received:", req.body);

    const result = await prisma.model.updateMany({
      where: {
        falAiRequestId: requestId,
      },
      data: {
        trainingStatus: "Generated",
        tensorPath: req.body.tensor_path,
      },
    });

    if (result.count === 0) {
      return res
        .status(404)
        .json({ message: "No model found for this request ID" });
    }

    return res.status(200).json({ message: "Model updated successfully" });
  } catch (err: any) {
    console.error("Error in Fal webhook (train):", err);
    return res
      .status(500)
      .json({ message: "Internal error", error: err.message });
  }
}
