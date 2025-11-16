"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UserEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onSave: (user: any) => Promise<void>;
}

export function UserEditModal({
  open,
  onOpenChange,
  user,
  onSave,
}: UserEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    displayName: "",
    email: "",
    role: "user",
    isActive: false,
    gender: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    avatar: "",
  });

  useEffect(() => {
    if (open && user) {
      setFormData({
        _id: user._id || "",
        displayName: user.displayName || "",
        email: user.email || "",
        role: user.role || "user",
        isActive: user.isActive || false,
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
        height: user.height || "",
        weight: user.weight || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, open]);

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      toast.error("Display name is required");
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`} />
                <AvatarFallback>{formData.displayName?.[0] || formData.email?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input 
                id="dob" 
                type="date" 
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input 
                id="height" 
                type="number" 
                placeholder="175"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number" 
                placeholder="70"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              disabled
            >
              <SelectTrigger id="role" className="bg-gray-100">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Role cannot be changed</p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="status">Account Status</Label>
            <Switch
              id="status"
              checked={formData.isActive}
              onCheckedChange={(checked: boolean) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#2d8cf0] hover:bg-[#2577d4]"
            onClick={handleSave}
            disabled={isLoading || !formData.displayName.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
