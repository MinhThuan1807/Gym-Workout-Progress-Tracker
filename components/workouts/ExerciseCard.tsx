import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GripVertical, Trash2 } from "lucide-react";
import Image from 'next/image';

interface ExerciseCardProps {
  exercise: U_WorkoutPlan['days'][keyof U_WorkoutPlan['days']][number];
  exerciseLab: Exercise[];
  onDelete?: () => void;
}

export default function ExerciseCard({ exercise, exerciseLab, onDelete }: ExerciseCardProps) {
  const exerciseDetail = exerciseLab.find(ex => ex._id.toString() === exercise.exerciseId);

  return (
    <Card className="rounded-xl border-[#e5e7eb] bg-[#f9fafb]">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="cursor-move mt-2">
            <GripVertical className="w-5 h-5 text-[#6b7280]" />
          </div>
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
            <Image 
              src={exerciseDetail?.mediaImageUrl || "/a1.png"}
              alt={exerciseDetail?.name || "Exercise"}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-3">
            <h5 className="text-[#111827]">{exerciseDetail?.name || `Exercise ${exercise.exerciseId}`}</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-[#6b7280]">Sets</Label>
                <Input 
                  type="number" 
                  defaultValue={exercise.targetSets}
                  className="rounded-lg h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-[#6b7280]">Weight(kg)</Label>
                <Input 
                  type="number" 
                  defaultValue={exercise.targetWeight}
                  className="rounded-lg h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-[#6b7280]">Reps</Label>
                <div className="flex gap-1">
                  <Input 
                    type="number" 
                    defaultValue={exercise.repsMin}
                    className="rounded-lg h-9 text-sm"
                  />
                  <Input 
                    type="number" 
                    defaultValue={exercise.repsMax}
                    className="rounded-lg h-9 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-[#6b7280]">Rest (sec)</Label>
                <Input 
                  type="number" 
                  defaultValue={exercise.restSec}
                  className="rounded-lg h-9 text-sm"
                />
              </div>
            </div>
          </div>
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}