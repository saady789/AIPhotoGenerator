import { z } from "zod";

export const TrainModel = z.object({
  name: z.string(),
  type: z.enum(["Man", "Woman", "Others"]),
  age: z.number(),
  ethinicity: z.enum([
    "White",
    "Black",
    "Hispanic",
    "Pacific",
    "AsianAmerican",
    "SouthAsian",
    "SouthEastAsian",
  ]),
  eyeColor: z.enum(["Brown", "Blue", "Hazel", "Gray"]),
  bald: z.boolean(),
  userId: z.string(),
  zipUrl: z.string(),
});

export const GenerateImage = z.object({
  prompt: z.string(),
  modelId: z.string(),
  num: z.number(),
  userId: z.string(),
});

export const GenerateImagesFromPack = z.object({
  modelId: z.string(),
  packId: z.string(),
});
