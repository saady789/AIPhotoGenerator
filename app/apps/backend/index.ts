import express from "express";
const PORT = process.env.PORT || 3001;
const app = express();
import {
  TrainModel,
  GenerateImage,
  GenerateImagesFromPack,
} from "common/types";

import { PrismaClient } from "db";

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("server is up and running");
});
