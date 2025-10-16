"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import JSZip from "jszip";

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
  for (let i = 0; i < models.length; i++) {
    console.log(models[i]?.previewImage);
  }
  console.log("Model was rendered");
  if (loading) {
    return <p className="text-center text-gray-500">Loading models...</p>;
  }

  if (!models.length) {
    return (
      <div className="text-center text-muted-foreground text-sm py-12">
        No models found. Train a model to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map((model) => (
        <Card key={model.id} className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-bold">{model.name}</CardTitle>
            <p className="text-sm text-muted-foreground capitalize">
              {model.type}
            </p>
          </CardHeader>

          <CardContent className="space-y-2">
            <div className="relative w-full h-48 rounded-md overflow-hidden">
              <Image
                src={model.previewImage || "/placeholder.jpg"}
                alt={model.name}
                fill
                className="object-cover"
              />
            </div>

            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>Age: {model.age}</li>
              <li>Eye Color: {model.eyeColor}</li>
              <li>Ethnicity: {model.ethnicity}</li>
              <li>{model.bald ? "Bald" : "Not Bald"}</li>
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
