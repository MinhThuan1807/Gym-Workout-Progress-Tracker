"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../shared/PageHeader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";

const exercises = [
  {
    id: 1,
    name: "Bench Press",
    type: "Strength",
    difficulty: "Intermediate",
    primaryMuscles: ["Chest", "Triceps"],
    image:
      "https://images.unsplash.com/photo-1750698544932-c7471990f1ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwd29ya291dHxlbnwxfHx8fDE3NjI0ODQxOTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    isPublic: true,
  },
  {
    id: 2,
    name: "Deadlift",
    type: "Strength",
    difficulty: "Advanced",
    primaryMuscles: ["Back", "Legs"],
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdW1iYmVsbCUyMHdlaWdodHN8ZW58MXx8fHwxNzYyNDk3MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    isPublic: true,
  },
  {
    id: 3,
    name: "Running",
    type: "Cardio",
    difficulty: "Beginner",
    primaryMuscles: ["Legs", "Core"],
    image:
      "https://images.unsplash.com/photo-1737736193172-f3b87a760ad5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkaW8lMjBydW5uaW5nfGVufDF8fHx8MTc2MjM4MTEzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    isPublic: true,
  },
  {
    id: 4,
    name: "Yoga Flow",
    type: "Flexibility",
    difficulty: "Beginner",
    primaryMuscles: ["Core", "Full Body"],
    image:
      "https://images.unsplash.com/photo-1607909599990-e2c4778e546b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwc3RyZXRjaGluZ3xlbnwxfHx8fDE3NjI0MjE5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    isPublic: false,
  },
];

export function Exercises() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [publicOnly, setPublicOnly] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    exercise: (typeof exercises)[0] | null;
  }>({
    open: false,
    exercise: null,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "Intermediate":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      case "Advanced":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Strength":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "Cardio":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200";
      case "Flexibility":
        return "bg-pink-100 text-pink-700 hover:bg-pink-200";
      case "Mobility":
        return "bg-teal-100 text-teal-700 hover:bg-teal-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="Exercises"
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Exercises" },
        ]}
        action={
          <Button
            className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-3 lg:px-4"
            onClick={() => router.push("/admin/exercises/new")}
          >
            <Plus className="w-4 h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Create New</span>
            <span className="sm:hidden">New</span>
            <span className="hidden md:inline ml-1">Exercise</span>
          </Button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
        <div className="space-y-4">
          {/* Search and main filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={publicOnly}
                onCheckedChange={setPublicOnly}
                className="shrink-0"
              />
              <Label
                className="cursor-pointer text-sm"
                onClick={() => setPublicOnly(!publicOnly)}
              >
                Public Only
              </Label>
            </div>
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="mobility">Mobility</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="calisthenics">Calisthenics</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            {/* Mobile layout: vertical */}
            <div className="block lg:hidden">
              <div className="w-full h-48 bg-gray-200">
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900 flex-1 pr-2">
                    {exercise.name}
                  </h3>
                  {!exercise.isPublic && (
                    <Badge variant="outline" className="shrink-0">
                      Private
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className={getTypeColor(exercise.type)}>
                    {exercise.type}
                  </Badge>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {exercise.primaryMuscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() =>
                      router.push(`/admin/exercises/edit/${exercise.id}`)
                    }
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Upload className="w-3 h-3 mr-1" />
                    Video
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                    onClick={() => setDeleteModal({ open: true, exercise })}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop layout: horizontal */}
            <div className="hidden lg:flex">
              <div className="w-32 xl:w-40 h-32 xl:h-40 bg-gray-200 shrink-0">
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-4 xl:p-5 flex flex-col min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg xl:text-xl text-gray-900 font-medium truncate pr-2">
                    {exercise.name}
                  </h3>
                  {!exercise.isPublic && (
                    <Badge variant="outline" className="shrink-0">
                      Private
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getTypeColor(exercise.type)}>
                    {exercise.type}
                  </Badge>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {exercise.primaryMuscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/admin/exercises/edit/${exercise.id}`)
                    }
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setDeleteModal({ open: true, exercise })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteModal.exercise && (
        <DeleteConfirmModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open, exercise: null })}
          itemName={deleteModal.exercise.name}
          onConfirm={() =>
            console.log("Delete exercise:", deleteModal.exercise)
          }
        />
      )}
    </div>
  );
}
