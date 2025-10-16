import { z } from "zod";

// export const TrainModel = z.object({
//   name: z.string(),
//   type: z.enum(["Man", "Woman", "Others"]),
//   age: z.number(),
//   ethinicity: z.enum([
//     "White",
//     "Black",
//     "Hispanic",
//     "Pacific",
//     "AsianAmerican",
//     "SouthAsian",
//     "SouthEastAsian",
//   ]),
//   eyeColor: z.enum(["Brown", "Blue", "Hazel", "Gray"]),
//   bald: z.boolean(),
//   userId: z.string(),
//   zipUrl: z.string(),
// });

export const TrainModel = z.object({
  name: z.string().min(1, "Name is required"),
  type: z
    .enum(["Man", "Woman", "Others"])
    .refine((val) => !!val, { message: "Type is required" }),
  age: z.number().min(1, "Age must be greater than 0"),
  ethnicity: z
    .enum([
      "White",
      "Black",
      "Hispanic",
      "Pacific",
      "AsianAmerican",
      "SouthAsian",
      "SouthEastAsian",
    ])
    .refine((val) => !!val, { message: "Ethnicity is required" }),
  eyeColor: z
    .enum(["Brown", "Blue", "Hazel", "Gray"])
    .refine((val) => !!val, { message: "Eye Color is required" }),
  bald: z.boolean(),
  userId: z.string().min(1, "UserId is required"),
  zipUrl: z.string().min(1, "Zip URL is required"),
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
