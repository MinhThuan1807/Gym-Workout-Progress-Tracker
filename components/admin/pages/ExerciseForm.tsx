"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "../shared/PageHeader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { FileUpload } from "../shared/FileUpload";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

export function ExerciseForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: isEdit ? "Bench Press" : "",
    description: isEdit
      ? "A compound upper body exercise that targets the chest, shoulders, and triceps."
      : "",
    type: isEdit ? "strength" : "",
    difficulty: isEdit ? "intermediate" : "",
    equipment: isEdit ? "Barbell, Bench" : "",
    image: isEdit
      ? "https://images.unsplash.com/photo-1750698544932-c7471990f1ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwd29ya291dHxlbnwxfHx8fDE3NjI0ODQxOTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
      : "",
    video: "",
    primaryMuscles: isEdit ? ["Chest", "Triceps"] : [],
    secondaryMuscles: isEdit ? ["Shoulders"] : [],
    isPublic: true,
  });

  const [newPrimaryMuscle, setNewPrimaryMuscle] = useState("");
  const [newSecondaryMuscle, setNewSecondaryMuscle] = useState("");

  const availableMuscles = [
    "Chest",
    "Back",
    "Shoulders",
    "Legs",
    "Arms",
    "Core",
    "Triceps",
    "Biceps",
    "Glutes",
  ];

  const addPrimaryMuscle = () => {
    if (
      newPrimaryMuscle &&
      !formData.primaryMuscles.includes(newPrimaryMuscle)
    ) {
      setFormData({
        ...formData,
        primaryMuscles: [...formData.primaryMuscles, newPrimaryMuscle],
      });
      setNewPrimaryMuscle("");
    }
  };

  const addSecondaryMuscle = () => {
    if (
      newSecondaryMuscle &&
      !formData.secondaryMuscles.includes(newSecondaryMuscle)
    ) {
      setFormData({
        ...formData,
        secondaryMuscles: [...formData.secondaryMuscles, newSecondaryMuscle],
      });
      setNewSecondaryMuscle("");
    }
  };

  const removePrimaryMuscle = (muscle: string) => {
    setFormData({
      ...formData,
      primaryMuscles: formData.primaryMuscles.filter((m) => m !== muscle),
    });
  };

  const removeSecondaryMuscle = (muscle: string) => {
    setFormData({
      ...formData,
      secondaryMuscles: formData.secondaryMuscles.filter((m) => m !== muscle),
    });
  };

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title={isEdit ? "Edit Exercise" : "Create New Exercise"}
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Exercises", path: "/admin/exercises" },
          { label: isEdit ? "Edit Exercise" : "Create New Exercise" },
        ]}
        action={
          <Button
            variant="outline"
            onClick={() => router.push("/admin/exercises")}
            className="text-sm lg:text-base px-3 lg:px-4"
          >
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">←</span>
          </Button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
        <form className="space-y-6 lg:space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg lg:text-xl text-gray-900 mb-4 font-medium">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm lg:text-base">
                  Exercise Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Bench Press, Squat, Push-up"
                  className="text-sm lg:text-base"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm lg:text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe how to perform the exercise..."
                  rows={4}
                  className="text-sm lg:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type" className="text-sm lg:text-base">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger id="type" className="text-sm lg:text-base">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="mobility">Mobility</SelectItem>
                      <SelectItem value="flexibility">Flexibility</SelectItem>
                      <SelectItem value="calisthenics">Calisthenics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty" className="text-sm lg:text-base">
                    Difficulty
                  </Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, difficulty: value })
                    }
                  >
                    <SelectTrigger
                      id="difficulty"
                      className="text-sm lg:text-base"
                    >
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="equipment" className="text-sm lg:text-base">
                    Equipment
                  </Label>
                  <Input
                    id="equipment"
                    value={formData.equipment}
                    onChange={(e) =>
                      setFormData({ ...formData, equipment: e.target.value })
                    }
                    placeholder="e.g., Barbell, Dumbbell"
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <h3 className="text-lg lg:text-xl text-gray-900 mb-4 font-medium">
              Media
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <FileUpload
                label="Exercise Image"
                preview={formData.image}
                onFileSelect={(file) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({
                      ...formData,
                      image: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }}
                onRemove={() => setFormData({ ...formData, image: "" })}
              />

              <FileUpload
                label="Exercise Video (Optional)"
                accept="video/*"
                preview={formData.video}
                onFileSelect={(file) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({
                      ...formData,
                      video: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }}
                onRemove={() => setFormData({ ...formData, video: "" })}
              />
            </div>
          </div>

          {/* Muscle Groups */}
          <div>
            <h3 className="text-lg lg:text-xl text-gray-900 mb-4 font-medium">
              Muscle Groups
            </h3>
            <div className="space-y-6">
              <div>
                <Label className="text-sm lg:text-base">
                  Primary Muscles{" "}
                  <span className="text-red-500">* (at least 1)</span>
                </Label>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <div className="flex-1">
                    <Select
                      value={newPrimaryMuscle}
                      onValueChange={setNewPrimaryMuscle}
                    >
                      <SelectTrigger className="text-sm lg:text-base">
                        <SelectValue placeholder="Select muscle" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMuscles.map((muscle) => (
                          <SelectItem key={muscle} value={muscle}>
                            {muscle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    onClick={addPrimaryMuscle}
                    className="text-sm lg:text-base px-4 lg:px-6"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.primaryMuscles.map((muscle) => (
                    <Badge
                      key={muscle}
                      className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-2 lg:px-3 py-1"
                    >
                      {muscle}
                      <button
                        type="button"
                        onClick={() => removePrimaryMuscle(muscle)}
                        className="ml-2 hover:bg-[#1e6bb8] rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm lg:text-base">
                  Secondary Muscles (Optional)
                </Label>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <div className="flex-1">
                    <Select
                      value={newSecondaryMuscle}
                      onValueChange={setNewSecondaryMuscle}
                    >
                      <SelectTrigger className="text-sm lg:text-base">
                        <SelectValue placeholder="Select muscle" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMuscles.map((muscle) => (
                          <SelectItem key={muscle} value={muscle}>
                            {muscle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    onClick={addSecondaryMuscle}
                    className="text-sm lg:text-base px-4 lg:px-6"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.secondaryMuscles.map((muscle) => (
                    <Badge
                      key={muscle}
                      variant="secondary"
                      className="text-sm lg:text-base px-2 lg:px-3 py-1"
                    >
                      {muscle}
                      <button
                        type="button"
                        onClick={() => removeSecondaryMuscle(muscle)}
                        className="ml-2 hover:bg-gray-300 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <h3 className="text-lg lg:text-xl text-gray-900 mb-4 font-medium">
              Visibility
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4 sm:gap-0">
              <div>
                <Label
                  htmlFor="visibility"
                  className="cursor-pointer text-sm lg:text-base"
                >
                  Make this exercise public
                </Label>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">
                  Public exercises can be viewed and used by all users
                </p>
              </div>
              <Switch
                id="visibility"
                checked={formData.isPublic}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, isPublic: checked })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/exercises")}
              className="text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-3 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-3 order-1 sm:order-2"
            >
              {isEdit ? "Update Exercise" : "Publish Exercise"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
