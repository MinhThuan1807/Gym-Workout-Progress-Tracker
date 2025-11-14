import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Image from 'next/image';

interface AddExerciseFormProps {
  exerciseLab: Exercise[];
  selectedExerciseId: string | null;
  onExerciseSelect: (id: string) => void;
  onCancel: () => void;
  onAdd: () => void;
  dayName: string;
}

export default function AddExerciseForm({ 
  exerciseLab, 
  selectedExerciseId, 
  onExerciseSelect, 
  onCancel, 
  onAdd,
  dayName 
}: AddExerciseFormProps) {
  const selectedExercise = exerciseLab.find(ex => ex._id.toString() === selectedExerciseId);

  return (
    <Card className="rounded-xl border-2 border-[#3b82f6] bg-[#3b82f6]/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-[#111827]">Select Exercise</Label>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-[#6b7280]">Exercise</Label>
          <Select value={selectedExerciseId || ''} onValueChange={onExerciseSelect}>
            <SelectTrigger className="rounded-xl border-[#e5e7eb]">
              <SelectValue placeholder="Choose an exercise" />
            </SelectTrigger>
            <SelectContent>
              {exerciseLab.map((exercise) => (
                <SelectItem key={exercise._id} value={exercise._id.toString()}>
                  <div className="flex items-center gap-2">
                    <span>{exercise.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {exercise.muscleGroup}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedExercise && (
          <div className="space-y-3 p-3 bg-white rounded-lg border border-[#e5e7eb]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image 
                  src={selectedExercise.mediaImageUrl || "/a1.png"}
                  alt={selectedExercise.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h5 className="text-[#111827] font-medium">{selectedExercise.name}</h5>
                <Badge variant="outline" className="text-xs mt-1">
                  {selectedExercise.muscleGroup}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-[#6b7280]">Target Sets</Label>
                <Input type="number" id={`sets-${selectedExerciseId}`} defaultValue={3} min={1} className="rounded-lg h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-[#6b7280]">Target Weight (kg)</Label>
                <Input type="number" id={`weight-${selectedExerciseId}`} defaultValue={0} min={0} step={2.5} className="rounded-lg h-9 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-[#6b7280]">Reps Range</Label>
                <div className="flex gap-1">
                  <Input type="number" id={`reps-min-${selectedExerciseId}`} defaultValue={8} placeholder="Min" className="rounded-lg h-9 text-sm" />
                  <Input type="number" id={`reps-max-${selectedExerciseId}`} defaultValue={12} placeholder="Max" className="rounded-lg h-9 text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-[#6b7280]">Rest (sec)</Label>
                <Input type="number" id={`rest-${selectedExerciseId}`} defaultValue={90} step={15} className="rounded-lg h-9 text-sm" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-[#6b7280]">Tempo</Label>
              <Input type="text" id={`tempo-${selectedExerciseId}`} defaultValue="2-0-2-0" placeholder="e.g., 2-0-2-0" className="rounded-lg h-9 text-sm" />
            </div>
          </div>
        )}

        <Button 
          className="w-full rounded-xl bg-[#3b82f6] hover:bg-[#2563eb]"
          disabled={!selectedExerciseId}
          onClick={onAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to {dayName}
        </Button>
      </CardContent>
    </Card>
  );
}