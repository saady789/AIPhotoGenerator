import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("the trainmodelwebhook was called by fal.ai");
    console.log("the request body is ", req.body);

    if (req.method !== "POST") {
      console.log("the req is not a post req so returning");
      return res.status(405).json({ message: "Method not allowed" });
    }

    const reqId = req.body.request_id;
    if (!reqId) {
      console.log("Missing request_id in body");
      return res.status(400).json({ message: "Missing request_id" });
    }

    const model = await prisma.model.findFirst({
      where: { falAiRequestId: reqId },
    });

    if (!model) {
      console.log("Model not found returning back ");
      return res.status(404).json({ message: "Model not found" });
    }

    // handle OK case
    if (req.body.status === "OK") {
      const tensorPath = req.body?.payload?.diffusers_lora_file?.url;
      if (!tensorPath) {
        console.log("Missing diffusers_lora_file.url in payload");
        return res.status(400).json({ message: "Missing tensor path" });
      }

      console.log("The status is OK, updating model to Generated...");
      await prisma.model.update({
        where: { id: model.id },
        data: {
          trainingStatus: "Generated",
          tensorPath,
        },
      });

      return res.status(200).json({ message: "Status changed to Generated" });
    }

    // handle ERROR case
    if (req.body.status === "ERROR") {
      console.log("The status is ERROR, updating model to Failed...");
      await prisma.model.update({
        where: { id: model.id },
        data: { trainingStatus: "Failed" },
      });

      return res.status(200).json({ message: "Status changed to Failed" });
    }

    console.log("No recognized status in webhook, ignoring.");
    return res.status(200).json({ message: "Webhook received but ignored" });
  } catch (err: any) {
    console.error("Error in Fal webhook (train):", err);
    return res
      .status(500)
      .json({ message: "Internal error", error: err.message });
  }
}
