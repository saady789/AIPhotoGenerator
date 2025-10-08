"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { z } from "zod";
import axios from "axios";
import JSZip from "jszip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BACKEND_URL } from "../../../app/config";
import { TrainModel } from "common/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function TrainForm() {
  const { user } = useUser();

  const { getToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  type TrainModelType = z.infer<typeof TrainModel>;

  const form = useForm<TrainModelType>({
    resolver: zodResolver(TrainModel),
    mode: "onChange",
    defaultValues: {
      name: "",
      type: "Man",
      age: 0,
      ethinicity: "SouthAsian",
      eyeColor: "Brown",
      bald: false,
      zipUrl: "zipUrl",
      userId: "saadybhai",
    },
  });

  async function createImageZip(files: File[]) {
    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.name, file); // file.name = "image1.png", file is a File/Blob
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });

    return zipBlob;
  }

  const onSubmit = async (values: TrainModelType) => {
    if (file == null) return alert("Plz upload your files as well");
    // console.log("Form values:", values);
    // console.log("Selected file:", file);
    try {
      const response = await axios.get(`${BACKEND_URL}/pre-signed-url`);
      const { url, key } = response.data;
      console.log(response);
      const zipBlob = await createImageZip([file]);
      const res = await axios.put(url, zipBlob, {
        headers: {
          "Content-Type": " application/zip",
        },
      });
      console.log(res);
      const token = await getToken();

      const trainModel = await axios.post(
        `${BACKEND_URL}/ai/training`,
        { ...values, zipUrl: key, userId: user?.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      //display internal server error
      console.log("internal server error ");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md mx-auto p-6 bg-white rounded shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Create project</h2>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Deploy your new project in one-click.
        </p>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of the model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Man">Man</SelectItem>
                  <SelectItem value="Woman">Woman</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Age */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Age of the model"
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ethnicity */}
        <FormField
          control={form.control}
          name="ethinicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ethnicity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="Hispanic">Hispanic</SelectItem>
                  <SelectItem value="Pacific">Pacific</SelectItem>
                  <SelectItem value="AsianAmerican">Asian American</SelectItem>
                  <SelectItem value="SouthAsian">South Asian</SelectItem>
                  <SelectItem value="SouthEastAsian">
                    Southeast Asian
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Eye Color */}
        <FormField
          control={form.control}
          name="eyeColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eye Color</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Brown">Brown</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                  <SelectItem value="Hazel">Hazel</SelectItem>
                  <SelectItem value="Gray">Gray</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bald Switch */}
        <FormField
          control={form.control}
          name="bald"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel className="mr-4">Bald</FormLabel>
              <FormControl>
                <Switch
                  className="cursor-pointer"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Upload */}
        <div className="border border-dashed border-gray-300 p-4 rounded-md text-center">
          <label htmlFor="file" className="cursor-pointer">
            <div className="text-gray-500 mb-2">
              📁 Upload your training images
            </div>
            <Input
              ref={fileInputRef}
              id="file"
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <Button
              variant="outline"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Files
            </Button>
          </label>
          {file && (
            <p className="mt-2 text-sm text-muted-foreground">{file.name}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {/* <Button type="button" variant="outline">
            Cancel
          </Button> */}
          <Button type="submit" className="cursor-pointer">
            Create Model
          </Button>
        </div>
      </form>
    </Form>
  );
}
