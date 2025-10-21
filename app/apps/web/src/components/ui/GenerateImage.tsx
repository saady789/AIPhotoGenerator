"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { TrainModel } from "common/types";
import axios from "axios";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Loader2 } from "lucide-react";

// interface Model {
//   id: string;
//   name: string;
// }

export function GenerateImage() {
  type ModelType = z.infer<typeof TrainModel>;
  const { user } = useUser();
  const { getToken } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [models, setModels] = useState<ModelType[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        console.log("api call made now ");
        const token = await getToken();
        const res = await axios.get(`/api/getModels?userId=${user?.id}`);
        console.log("the models are ", res.data);
        setModels(res.data);
      } catch (err) {
        console.error("Failed to fetch models:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchModels();
  }, [user]);

  const handleGenerate = async () => {
    console.log("prompt is ", prompt);
    console.log("model is ", selectedModel);
    console.log("the model is also ", models);
    if (!prompt || !selectedModel) return alert("plz fill the form correctly ");
    setLoading(true);
    setGeneratedImage(null);
    let SendModel: ModelType | null = null;
    models.map((m) => {
      if (m.name == selectedModel) {
        SendModel = m;
        return;
      }
    });
    const token = await getToken();

    try {
      const res = await axios.post(
        `/api/generate`,
        { prompt, model: SendModel, user },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGeneratedImage(res.data.imageUrl);
    } catch (err) {
      console.error("Generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Generate Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <Select onValueChange={(value) => setSelectedModel(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleGenerate}
            disabled={loading || !selectedModel || !prompt}
          >
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Generate
          </Button>
        </CardContent>
      </Card>

      {generatedImage && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Generated Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-96 rounded overflow-hidden">
              <Image
                src={generatedImage}
                alt="Generated"
                fill
                className="object-contain"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
