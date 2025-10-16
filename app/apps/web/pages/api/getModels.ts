import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";
import JSZip from "jszip";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const models = await prisma.model.findMany({
      where: { userId },
    });

    const updatedModels = await Promise.all(
      models.map(async (model) => {
        try {
          const zipRes = await fetch(model.zipUrl);
          if (!zipRes.ok) throw new Error("Failed to fetch zip");

          const arrayBuffer = await zipRes.arrayBuffer(); // ✅ modern, no warning
          const zip = await JSZip.loadAsync(arrayBuffer);

          for (const fileName of Object.keys(zip.files)) {
            const file = zip.files[fileName];

            if (file && !file.dir && /\.(png|jpe?g|webp)$/i.test(file.name)) {
              const ext = file.name.split(".").pop();
              const base64 = await file.async("base64");
              const dataUrl = `data:image/${ext};base64,${base64}`;

              return { ...model, previewImage: dataUrl };
            }
          }

          return { ...model, previewImage: null };
        } catch (err) {
          console.error(`Error processing zip for model ${model.id}`, err);
          return { ...model, previewImage: null };
        }
      })
    );

    return res.status(200).json(updatedModels);
  } catch (error) {
    console.error("API Error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
