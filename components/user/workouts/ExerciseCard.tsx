import { Card, CardContent } from '@/components/user/ui/card'
import { Button } from '@/components/user/ui/button'
import { Input } from '@/components/user/ui/input'
import { Label } from '@/components/user/ui/label'
import { GripVertical, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface ExerciseCardProps {
  exercise: U_WorkoutPlan['days'][keyof U_WorkoutPlan['days']][number]
  exerciseLab: Exercise[]
  onDelete?: () => void
}

export default function ExerciseCard({
  exercise,
  exerciseLab,
  onDelete
}: ExerciseCardProps) {
  const exerciseDetail = exerciseLab.find(
    (ex) => ex._id.toString() === exercise.exerciseId
  )

  return (
    <Card className="rounded-xl border-[#e5e7eb] bg-[#f9fafb]">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="cursor-move mt-2 hidden sm:block">
            <GripVertical className="w-5 h-5 text-[#6b7280]" />
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200">
            <Image
              src={exerciseDetail?.mediaImageUrl || '/a1.png'}
              alt={exerciseDetail?.name || 'Exercise'}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
            <h5 className="text-sm sm:text-base text-[#111827] truncate">
              {exerciseDetail?.name || `Exercise ${exercise.exerciseId}`}
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] sm:text-xs text-[#6b7280]">
                  Sets
                </Label>
                <Input
                  type="number"
                  defaultValue={exercise.targetSets}
                  className="rounded-lg h-8 sm:h-9 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] sm:text-xs text-[#6b7280]">
                  Weight(kg)
                </Label>
                <Input
                  type="number"
                  defaultValue={exercise.targetWeight}
                  className="rounded-lg h-8 sm:h-9 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] sm:text-xs text-[#6b7280]">
                  Reps
                </Label>
                <div className="flex gap-1">
                  <Input
                    type="number"
                    defaultValue={exercise.repsMin}
                    className="rounded-lg h-8 sm:h-9 text-xs sm:text-sm"
                    placeholder="Min"
                  />
                  <Input
                    type="number"
                    defaultValue={exercise.repsMax}
                    className="rounded-lg h-8 sm:h-9 text-xs sm:text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] sm:text-xs text-[#6b7280]">
                  Rest (sec)
                </Label>
                <Input
                  type="number"
                  defaultValue={exercise.restSec}
                  className="rounded-lg h-8 sm:h-9 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
