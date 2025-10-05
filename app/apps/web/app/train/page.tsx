import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrainForm } from "@/components/ui/train-form";

export default function Train() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <TrainForm />
    </div>
  );
}
