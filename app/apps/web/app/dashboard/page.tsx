"use client";
// import { GenerateImage } from "@/components/GenerateImage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainForm } from "@/components/ui/train-form";
// import { Packs } from "@/components/ui/Packs";
// import { Camera } from "@/components/Camera";
import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { user } = useUser();

  if (!user) {
    console.log("returning back");
    // redirect("/");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 min-h-screen">
      <div className="space-y-8">
        <Tabs defaultValue="camera">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-lg p-1 dark:bg-muted/50 bg-pink-50">
            <TabsTrigger
              value="camera"
              className="data-[state=active]:bg-pink-500/70 backdrop-blur-sm data-[state=active]:text-pink-50 cursor-pointer px-3 py-1.5"
            >
              Camera
            </TabsTrigger>
            <TabsTrigger
              value="generate"
              className="data-[state=active]:bg-pink-500/70 backdrop-blur-sm data-[state=active]:text-pink-50 cursor-pointer px-3 py-1.5"
            >
              Generate
            </TabsTrigger>
            <TabsTrigger
              value="packs"
              className="data-[state=active]:bg-pink-500/70 backdrop-blur-sm data-[state=active]:text-pink-50 cursor-pointer px-3 py-1.5"
            >
              Packs
            </TabsTrigger>
            <TabsTrigger
              value="train"
              className="data-[state=active]:bg-pink-500/70 backdrop-blur-sm data-[state=active]:text-pink-50 cursor-pointer px-3 py-1.5"
            >
              Train<span className="md:block hidden pl-1">Model</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 bg-card rounded-lg">
            <TabsContent
              value="camera"
              className="mt-0 focus-visible:outline-none"
            >
              {/* <Camera /> */} P camera
            </TabsContent>
            <TabsContent
              value="generate"
              className="mt-0 focus-visible:outline-none"
            >
              {/* <GenerateImage /> */} p generate image
            </TabsContent>
            <TabsContent
              value="packs"
              className="mt-0 focus-visible:outline-none"
            >
              {/* <Packs /> */} packs here
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
