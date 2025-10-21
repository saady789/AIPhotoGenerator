"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";

interface Model {
  id: string;
  name: string;
  type: string;
  age: number;
  eyeColor: string;
  bald: boolean;
  ethnicity: string;
  zipUrl: string;
  previewImage?: string;
}

export function Models({
  models,
  loading,
}: {
  models: Model[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <p className="text-center text-gray-400 text-sm">Loading models...</p>
    );
  }

  if (!models.length) {
    return (
      <div className="text-center text-muted-foreground text-sm py-12">
        No models found. Train a model to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {models.map((model) => (
        <Card
          key={model.id}
          className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl border"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {model.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground capitalize">
              {model.type}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={model.previewImage || "/placeholder.jpg"}
                alt={model.name}
                fill
                className="object-cover grayscale transition-all duration-300"
              />
            </div>

            <div className="text-sm text-gray-700 grid grid-cols-2 gap-x-4 gap-y-2">
              <p>
                <span className="font-medium text-gray-500">Age:</span>{" "}
                {model.age}
              </p>
              <p>
                <span className="font-medium text-gray-500">Eye Color:</span>{" "}
                {model.eyeColor}
              </p>
              <p>
                <span className="font-medium text-gray-500">Ethnicity:</span>{" "}
                {model.ethnicity}
              </p>
              <p>
                <span className="font-medium text-gray-500">Hair:</span>{" "}
                {model.bald ? "Bald" : "Not Bald"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
