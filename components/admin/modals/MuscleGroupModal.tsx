"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FileUpload } from "../shared/FileUpload";

interface MuscleGroup {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface MuscleGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  muscleGroup: MuscleGroup | null;
  onSave: (data: Partial<MuscleGroup>) => void;
}

export function MuscleGroupModal({
  open,
  onOpenChange,
  muscleGroup,
  onSave,
}: MuscleGroupModalProps) {
  const [formData, setFormData] = useState({
    name: muscleGroup?.name || "",
    description: muscleGroup?.description || "",
    image: muscleGroup?.image || "",
  });

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {muscleGroup ? "Edit Muscle Group" : "Add New Muscle Group"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Chest, Back, Legs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the muscle group and its primary muscles..."
              rows={5}
            />
          </div>

          <FileUpload
            label="Muscle Group Image"
            preview={formData.image}
            onFileSelect={(file) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
              };
              reader.readAsDataURL(file);
            }}
            onRemove={() => setFormData({ ...formData, image: "" })}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#2d8cf0] hover:bg-[#2577d4]"
            onClick={handleSave}
          >
            {muscleGroup ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
