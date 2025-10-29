'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, ChevronRight, Dumbbell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  id: number;
  date: string;
  name: string;
  exercises: Exercise[];
}

const mockWorkouts: Workout[] = [
  {
    id: 1,
    date: "Oct 3, 2025",
    name: "Upper Body",
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8, weight: 80 },
      { name: "Dumbbell Row", sets: 4, reps: 10, weight: 30 },
      { name: "Shoulder Press", sets: 3, reps: 10, weight: 20 },
    ]
  },
  {
    id: 2,
    date: "Oct 2, 2025",
    name: "Lower Body",
    exercises: [
      { name: "Squat", sets: 5, reps: 5, weight: 100 },
      { name: "Romanian Deadlift", sets: 4, reps: 8, weight: 80 },
      { name: "Leg Press", sets: 3, reps: 12, weight: 150 },
    ]
  },
  {
    id: 3,
    date: "Oct 1, 2025",
    name: "Push Day",
    exercises: [
      { name: "Bench Press", sets: 5, reps: 5, weight: 85 },
      { name: "Incline DB Press", sets: 4, reps: 8, weight: 28 },
      { name: "Tricep Dips", sets: 3, reps: 12, weight: 0 },
    ]
  },
];

export default function WorkoutsPage() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-muted-foreground">Track and manage your training sessions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create New Workout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Workout Name</Label>
                <Input placeholder="e.g., Upper Body" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" className="rounded-xl" />
              </div>
              <Button className="w-full rounded-xl">Create Workout</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedWorkout ? (
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedWorkout(null)}
            className="rounded-xl"
          >
            ← Back to Workouts
          </Button>

          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedWorkout.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedWorkout.date}</p>
                </div>
                <Button className="rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedWorkout.exercises.map((exercise, i) => (
                  <div key={i} className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-semibold">{exercise.name}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Sets: </span>
                        <span className="font-semibold">{exercise.sets}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reps: </span>
                        <span className="font-semibold">{exercise.reps}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Weight: </span>
                        <span className="font-semibold">{exercise.weight} kg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4">
          {mockWorkouts.map((workout) => (
            <Card 
              key={workout.id} 
              className="rounded-2xl border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedWorkout(workout)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{workout.name}</h3>
                      <p className="text-sm text-muted-foreground">{workout.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Exercises</div>
                      <div className="font-semibold">{workout.exercises.length}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
