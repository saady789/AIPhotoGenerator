import { BaseModel } from "./BaseModel";
import { fal } from "@fal-ai/client";

export class FalAIModel extends BaseModel {
  private devMode = process.env.DEV_MODE === "true";
  constructor() {
    super();
  }

  public override async generateImage(prompt: string, tensorPath: string) {
    const result = await fal.subscribe("fal-ai/flux-lora", {
      input: {
        prompt: prompt,
        loras: [{ path: tensorPath, scale: 1 }],
      },
      webhookUrl: `${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/image`,
    });
    return result;
  }
  public override async trainModel(zipUrl: string, triggerWord: string) {
    if (this.devMode) {
      console.log("[DEV MODE] Fake training started");
      return "fake-request-" + Date.now(); // Fake request ID
    }
    const { request_id } = await fal.queue.submit(
      "fal-ai/flux-lora-fast-training",
      {
        input: {
          images_data_url: zipUrl,
          trigger_word: triggerWord,
        },
        webhookUrl: `${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/train`,
      }
    );
    return request_id;
  }
}
