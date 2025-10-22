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
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Loader2 } from "lucide-react";

export function GenerateImage() {
  type ModelType = z.infer<typeof TrainModel>;
  const { user } = useUser();
  const { getToken } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [currentModel, setCurrentModel] = useState<ModelType | null>(null);

  const [models, setModels] = useState<ModelType[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // NEW: track attempts and requestId to save later
  const [attempts, setAttempts] = useState(0);
  const [falRequestId, setFalRequestId] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        console.log("api call made now ");
        const token = await getToken();

        const res = await axios.get(`/api/getModels?userId=${user?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("the models are ", res.data);
        setModels(res.data);
      } catch (err) {
        console.error("Failed to fetch models:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchModels();
  }, [user, getToken]);

  const handleGenerate = async () => {
    console.log("prompt is ", prompt);
    console.log("model is ", selectedModel);
    console.log("the model is also ", models);
    if (!prompt || !selectedModel) return alert("plz fill the form correctly ");

    // NEW: prevent more than 3 attempts until saved
    if (attempts >= 3) {
      toast.error(
        "You have reached 3 attempts. Please save before generating again."
      );
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    let SendModel: ModelType | null = null;
    for (const m of models) {
      if (m.name === selectedModel) {
        SendModel = m;
        setCurrentModel(SendModel);
        break;
      }
    }
    if (!SendModel) {
      setLoading(false);
      return alert("Selected model not found");
    }

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

      const url = res?.data?.data?.data?.images?.[0]?.url;
      const requestId = res?.data?.data?.requestId;
      console.log("the response from generate image is ", url);
      console.log("other info is ", requestId);

      if (!url) {
        throw new Error("Image URL missing in response");
      }

      setGeneratedImage(url);
      setFalRequestId(requestId ?? null);

      // NEW: increment attempts on each successful generation
      setAttempts((a) => a + 1);
    } catch (err) {
      console.error("Generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  // NEW: save handler
  const handleSave = async () => {
    if (!generatedImage || !selectedModel || !prompt || !user?.id) return;

    const modelObj = models.find((m) => m.name === selectedModel);
    if (!modelObj) return alert("Selected model not found");

    try {
      const token = await getToken();
      const saveDb = await axios.post(
        "/api/saveimage",
        {
          falRequestId,
          prompt,
          generatedImage,
          currentModel,
          user,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(saveDb);
      // After save, allow new attempts
      if (saveDb.status === 200) {
        toast.success("Image saved successfully!");
        setAttempts(0); // reset attempts
        setGeneratedImage(null); // clear out image display
        setPrompt(""); // clear input
        setSelectedModel(null); // reset model selection
        setCurrentModel(null); // reset model object
        setFalRequestId(null);
      } else {
        toast.error(`Save failed (${saveDb.status})`);
      }
    } catch (e) {
      console.error("Failed to save image", e);
      toast.error("Failed to save image. Please try again later");
    }
  };

  // NEW: control Save button visibility and Generate disable rules
  const canShowSave =
    !!generatedImage && !!prompt && !!selectedModel && !loading;

  const canGenerate = !loading && !!selectedModel && !!prompt && attempts < 3;

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

          <div className="flex items-center gap-3">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="cursor-pointer"
            >
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Generate
            </Button>

            {/* NEW: show attempts info */}
            <span className="text-sm text-muted-foreground">
              Attempts: {attempts} / 3
            </span>
          </div>

          {/* NEW: hint when locked */}
          {attempts >= 3 && (
            <p className="text-sm text-red-600">
              You reached the limit. Save the image to unlock more attempts.
            </p>
          )}
        </CardContent>
      </Card>

      {generatedImage && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Generated Image</CardTitle>

            {/* NEW: Save button is visible only when it makes sense */}
            {canShowSave && (
              <Button
                onClick={handleSave}
                variant="secondary"
                className="cursor-pointer"
              >
                Save
              </Button>
            )}
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
