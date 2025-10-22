"use client";
import { GenerateImage } from "@/components/ui/GenerateImage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainForm } from "@/components/ui/train-form";
import { Gallary } from "@/components/ui/Gallary";
import { Models } from "@/components/Models";
import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import axios from "axios";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { user } = useUser();

  const { getToken } = useAuth();

  const [models, setModels] = useState([]);
  const [output, setOutput] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchModels = async () => {
      try {
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

    const fetchOutput = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`/api/getOutput?userId=${user?.id}`);
        console.log("the output is is ", res.data);
        setOutput(res.data);
        console.log("output is ", res.data);
      } catch (err) {
        console.error("Failed to fetch models:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchModels();
    if (user) fetchOutput();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 min-h-screen">
      <div className="space-y-8">
        <Tabs defaultValue="Models">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-lg p-1 dark:bg-muted/50 bg-pink-50">
            <TabsTrigger
              value="Models"
              className="data-[state=active]:bg-pink-500/70 backdrop-blur-sm data-[state=active]:text-pink-50 cursor-pointer px-3 py-1.5"
            >
              Models
            </TabsTrigger>
            <TabsTrigger
              value="generate"
              className="data-[state=active]:bg-pink-500/70 backdrop-blur-sm data-[state=active]:text-pink-50 cursor-pointer px-3 py-1.5"
            >
              Generate
            </TabsTrigger>
            <TabsTrigger
              value="gallary"
              className="data-[state=active]:bg-pink-500/70 backdrop-blur-sm data-[state=active]:text-pink-50 cursor-pointer px-3 py-1.5"
            >
              Gallary
            </TabsTrigger>
            <TabsTrigger
              value="train"
              className="data-[state=active]:bg-pink-500/70 backdrop-blur-sm data-[state=active]:text-pink-50 cursor-pointer px-3 py-1.5"
            >
              Train<span className="md:block hidden pl-1"></span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 bg-card rounded-lg">
            <TabsContent
              value="Models"
              className="mt-0 focus-visible:outline-none"
            >
              <Models models={models} loading={loading} />
            </TabsContent>
            <TabsContent
              value="generate"
              className="mt-0 focus-visible:outline-none"
            >
              <GenerateImage />
            </TabsContent>
            <TabsContent
              value="gallary"
              className="mt-0 focus-visible:outline-none"
            >
              <Gallary output={output} loading={loading} />
            </TabsContent>
            <TabsContent
              value="train"
              className="mt-0 focus-visible:outline-none"
            >
              <TrainForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
