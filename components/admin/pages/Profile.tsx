"use client";

import React, { useState } from "react";
import { Camera, Mail, Phone, MapPin, Calendar, Save } from "lucide-react";
import { PageHeader } from "../shared/PageHeader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
  );
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@fittrack.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate fitness enthusiast and platform administrator. Dedicated to helping users achieve their fitness goals.",
    location: "New York, USA",
    dateOfBirth: "1990-01-15",
    gender: "male",
    height: "175",
    weight: "75",
    role: "Administrator",
    department: "Operations",
    joinDate: "2023-01-15",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success("Profile image updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="My Profile"
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Profile" },
        ]}
        action={
          !isEditing ? (
            <Button
              className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-3 lg:px-4"
              onClick={() => setIsEditing(true)}
            >
              <span className="hidden sm:inline">Edit</span>
              <span className="hidden md:inline ml-1">Profile</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="text-xs lg:text-sm"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#2d8cf0] hover:bg-[#2577d4] text-xs lg:text-sm"
                size="sm"
                onClick={handleSave}
              >
                <Save className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Save</span>
                <span className="hidden md:inline ml-1">Changes</span>
                <span className="sm:hidden">Save</span>
              </Button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Profile Card */}
        <div className="xl:col-span-1 order-1 xl:order-1">
          <Card>
            <CardContent className="pt-4 lg:pt-6 p-4 lg:p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 lg:w-32 lg:h-32">
                    <AvatarImage src={profileImage} />
                    <AvatarFallback className="text-lg lg:text-2xl">
                      {formData.firstName[0]}
                      {formData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 p-2 bg-[#2d8cf0] text-white rounded-full cursor-pointer hover:bg-[#2577d4] transition-colors"
                    >
                      <Camera className="w-3 h-3 lg:w-4 lg:h-4" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <h2 className="mt-4 text-lg lg:text-2xl text-gray-900 text-center">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-gray-500 text-sm lg:text-base">
                  {formData.role}
                </p>
                <p className="text-xs lg:text-sm text-gray-400">
                  {formData.department}
                </p>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                    <span className="text-xs lg:text-sm truncate">
                      {formData.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                    <span className="text-xs lg:text-sm">{formData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                    <span className="text-xs lg:text-sm">
                      {formData.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                    <span className="text-xs lg:text-sm">
                      Joined {new Date(formData.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 lg:mt-6">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-base lg:text-lg">
                Activity Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 lg:space-y-4 p-4 lg:p-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs lg:text-sm">
                  Users Managed
                </span>
                <span className="text-gray-900 text-sm lg:text-base font-medium">
                  2,847
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs lg:text-sm">
                  Exercises Created
                </span>
                <span className="text-gray-900 text-sm lg:text-base font-medium">
                  142
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs lg:text-sm">
                  Blog Posts
                </span>
                <span className="text-gray-900 text-sm lg:text-base font-medium">
                  28
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs lg:text-sm">
                  Last Login
                </span>
                <span className="text-gray-900 text-sm lg:text-base font-medium">
                  Today, 9:42 AM
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <div className="xl:col-span-2 space-y-4 lg:space-y-6 order-2 xl:order-2">
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-base lg:text-xl">
                Personal Information
              </CardTitle>
              <CardDescription className="text-xs lg:text-sm">
                Update your personal details and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs lg:text-sm">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    disabled={!isEditing}
                    className="text-sm lg:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs lg:text-sm">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    disabled={!isEditing}
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs lg:text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="text-sm lg:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs lg:text-sm">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs lg:text-sm">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={3}
                  className="text-sm lg:text-base"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs lg:text-sm">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    disabled={!isEditing}
                    className="text-sm lg:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-xs lg:text-sm">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    disabled={!isEditing}
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-base lg:text-xl">
                Physical Information
              </CardTitle>
              <CardDescription className="text-xs lg:text-sm">
                Track your physical stats and measurements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-xs lg:text-sm">
                    Gender
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, gender: value })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="gender" className="text-sm lg:text-base">
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
                  <Label htmlFor="height" className="text-xs lg:text-sm">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    disabled={!isEditing}
                    className="text-sm lg:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-xs lg:text-sm">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    disabled={!isEditing}
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs lg:text-sm text-gray-600">
                    Body Mass Index (BMI)
                  </span>
                  <span className="text-base lg:text-lg text-gray-900 font-medium">
                    {(
                      parseFloat(formData.weight) /
                      Math.pow(parseFloat(formData.height) / 100, 2)
                    ).toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Normal weight range
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-base lg:text-xl">
                Work Information
              </CardTitle>
              <CardDescription className="text-xs lg:text-sm">
                Your role and department details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs lg:text-sm">
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={formData.role}
                    disabled
                    className="bg-gray-50 text-sm lg:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-xs lg:text-sm">
                    Department
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    disabled={!isEditing}
                    className="text-sm lg:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate" className="text-xs lg:text-sm">
                  Join Date
                </Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  disabled
                  className="bg-gray-50 text-sm lg:text-base"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
