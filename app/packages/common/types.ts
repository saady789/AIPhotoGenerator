import { z } from "zod";

export const TrainModel = z.object({
  name: z.string(),
  type: z.enum(["Man", "Woman", "Other"]),
  age: z.number(),
  ethinicity: z.enum([
    "White",
    "Black",
    "Hispanic",
    "Pacific",
    "Asian American",
    "South Asian",
    "South East Asian",
  ]),
  eyeColor: z.enum(["Brown", "Blue", "Hazel", "Gray"]),
  bald: z.boolean(),
  images: z.array(z.string()),
});

export const GenerateImage = z.object({
  prompt: z.string(),
  modelId: z.string(),
  num: z.number(),
});

export const GenerateImagesFromPack = z.object({
  modelId: z.string(),
  packId: z.string(),
});
