'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Suspense } from "react";
import { SkeletonExercises } from "@/components/skeleton/SkeletonExcercises";

interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  image: string;
}

const exercises: Exercise[] = [
  { id: 1, name: "Squat", muscleGroup: "Legs", image: "https://images.unsplash.com/photo-1701826478825-8d975e7883f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcXVhdCUyMGV4ZXJjaXNlfGVufDF8fHx8MTc1OTQ3Mjg1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 2, name: "Bench Press", muscleGroup: "Chest", image: "https://images.unsplash.com/photo-1652363722833-509b3aac287b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZW5jaCUyMHByZXNzJTIwZ3ltfGVufDF8fHx8MTc1OTQxMTcyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 3, name: "Deadlift", muscleGroup: "Back", image: "https://images.unsplash.com/photo-1545612036-2872840642dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWFkbGlmdCUyMGV4ZXJjaXNlfGVufDF8fHx8MTc1OTM5MzYwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 4, name: "Pull Up", muscleGroup: "Back", image: "https://images.unsplash.com/photo-1683760682579-68e590fa54d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWxsJTIwdXAlMjBleGVyY2lzZXxlbnwxfHx8fDE3NTk0Njc4MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 5, name: "Dumbbell Row", muscleGroup: "Back", image: "https://images.unsplash.com/photo-1652492041264-efba848755d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXF1aXBtZW50JTIwZHVtYmJlbGxzfGVufDF8fHx8MTc1OTQ3NjE1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 6, name: "Shoulder Press", muscleGroup: "Shoulders", image: "https://images.unsplash.com/photo-1652492041264-efba848755d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXF1aXBtZW50JTIwZHVtYmJlbGxzfGVufDF8fHx8MTc1OTQ3NjE1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 7, name: "Bicep Curl", muscleGroup: "Arms", image: "https://images.unsplash.com/photo-1652492041264-efba848755d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXF1aXBtZW50JTIwZHVtYmJlbGxzfGVufDF8fHx8MTc1OTQ3NjE1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 8, name: "Tricep Dips", muscleGroup: "Arms", image: "https://images.unsplash.com/photo-1652492041264-efba848755d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXF1aXBtZW50JTIwZHVtYmJlbGxzfGVufDF8fHx8MTc1OTQ3NjE1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 9, name: "Leg Press", muscleGroup: "Legs", image: "https://images.unsplash.com/photo-1701826478825-8d975e7883f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcXVhdCUyMGV4ZXJjaXNlfGVufDF8fHx8MTc1OTQ3Mjg1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
];

const muscleGroups = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms"];

export default function ExercisesLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All");

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroup === "All" || exercise.muscleGroup === selectedMuscleGroup;
    return matchesSearch && matchesMuscleGroup;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exercise Library</h1>
        <p className="text-muted-foreground">Browse and search exercises by muscle group</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((group) => (
              <Button
                key={group}
                variant={selectedMuscleGroup === group ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMuscleGroup(group)}
                className="rounded-xl"
              >
                {group}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
     <Suspense fallback={<SkeletonExercises/>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <Card 
                key={exercise.id} 
                className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src='/a1.jpg'
                    alt={exercise.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    width={500}
                    height={500}
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary text-primary-foreground rounded-lg">
                      {exercise.muscleGroup}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Target: {exercise.muscleGroup}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
     </Suspense>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No exercises found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
