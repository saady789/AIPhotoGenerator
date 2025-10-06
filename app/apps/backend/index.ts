import express from "express";
const PORT = process.env.PORT || 8000;
import cors from "cors";
import { S3Client, s3, write } from "bun";
import { authMiddleware } from "./middleware";
const app = express();
app.use(express.json());
const corsOptions = {
  origin: ["http://localhost:3000"], // Allowed origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Allow sending cookies/authorization headers
  optionsSuccessStatus: 200, // Status for preflight requests
};

app.use(cors(corsOptions));
import {
  TrainModel,
  GenerateImage,
  GenerateImagesFromPack,
} from "common/types";
import PrismaClient, { prisma } from "db";
import { FalAIModel } from "./models/FalAIModel";
const USER_ID = "123";

const falAiModel = new FalAIModel();

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.post("/ai/training", async (req, res) => {
  const parsedBody = TrainModel.safeParse(req.body);
  console.log("Parsed body is ", parsedBody);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Input Incorrect",
    });
    return;
  }
  // const request_id = await falAiModel.trainModel("", "");

  // const data = await PrismaClient.model.create({
  //   data: {
  //     name: parsedBody.data.name,
  //     age: parsedBody.data.age,
  //     type: parsedBody.data.type,
  //     ethnicity: parsedBody.data.ethinicity,
  //     eyeColor: parsedBody.data.eyeColor,
  //     bald: parsedBody.data.bald,
  //     // outputImages: parsedBody.data.images,
  //     userId: parsedBody.data.userId,
  //     triggerWord: "asbc",
  //     tensorPath: "sdf",
  //     falAiRequestId: request_id,
  //     zipUrl: parsedBody.data.zipUrl,
  //   },
  // });
  res.json({
    modelId: "modelId",
  });
});

app.post("/ai/generate", async (req, res) => {
  const parsedBody = GenerateImage.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({});
    return;
  }
  const model = await prisma.model.findUnique({
    where: {
      id: parsedBody.data.modelId,
    },
  });
  if (!model || !model.tensorPath) {
    res.status(411).json({
      message: "Model not found",
    });
    return;
  }
  const request_id = await falAiModel.generateImage(parsedBody.data.prompt, "");
  const data = await PrismaClient.outputImages.create({
    data: {
      prompt: parsedBody.data.prompt,
      userId: parsedBody.data.userId,
      modelId: parsedBody.data.modelId,
      imageUrl: "",
      status: "Failed",
    },
  });
  res.json({
    imageId: data.id,
  });
});

app.post("/pack/generate", async (req, res) => {
  const parsedBody = GenerateImagesFromPack.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Input incorrect",
    });
    return;
  }
  const prompts = await PrismaClient.packPrompts.findMany({
    where: {
      packId: parsedBody.data.packId,
    },
  });
  let requestIds: { requestId: string }[] = await Promise.all(
    prompts.map(async (prompt) => {
      const res = await falAiModel.generateImage(
        prompt.prompt,
        parsedBody.data.modelId
      );
      return { requestId: res.requestId };
    })
  );
  const images = await PrismaClient.outputImages.createManyAndReturn({
    data: prompts.map((prompt: any) => ({
      prompt: prompt.prompt,
      userId: USER_ID,
      modelId: parsedBody.data.modelId,
      imageUrl: "",
      status: "Failed",
    })),
  });
  res.json({
    images: images.map((image: any) => image.id),
  });
});

app.get("/pack/bulk", async (req, res) => {
  const packs = await PrismaClient.packs.findMany({});
  res.json({ packs });
});

app.get("/image/bulk", async (req, res) => {
  const images = req.query.images;
  const limit = req.query.limit as string;
  const offset = req.query.offset as string;
  // const imagesData = await PrismaClient.outputImages.findMany({
  //   where: {
  //     id: { in: images },
  //     userId: USER_ID,
  //   },
  //   skip: parseInt(offset),
  //   take: parseInt(limit),
  // });
  // res.json({
  //   images: imagesData,
  // });
  res.json({
    output: "success",
  });
});

app.post("/fal-ai/webhook/train", async (req, res) => {
  console.log(req.body);
  const requestId = req.body.request_id;
  await prisma.model.updateMany({
    where: {
      falAiRequestId: requestId,
    },
    data: {
      trainingStatus: "Generated",
      tensorPath: req.body.tensor_path,
    },
  });
  res.json({
    message: "webhook received",
  });
});

app.post("/fal-ai/webhook/image", async (req, res) => {
  console.log(req.body);
  const requestId = req.body.request_id;
  await prisma.outputImages.updateMany({
    where: {
      falAiRequestId: requestId,
    },
    data: {
      status: "Generated",
      imageUrl: req.body.image_url,
    },
  });
  res.json({
    message: "webhook received",
  });
});

app.get("/pre-signed-url", async (req, res) => {
  const key = `models/${Date.now()}_${Math.random()}.zip`;
  const url = await S3Client.presign(
    `models/${Date.now()}_${Math.random()}.zip`,
    {
      method: "PUT",
      bucket: process.env.BUCKET_NAME,
      endpoint: process.env.ENDPOINT,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      expiresIn: 60 * 5,
      type: "application/zip",
    }
  );
  res.json({ url, key });
});

app.listen(PORT, () => {
  console.log("server is up and running");
});
