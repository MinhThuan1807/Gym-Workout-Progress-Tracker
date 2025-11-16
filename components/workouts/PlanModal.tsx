'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus } from 'lucide-react'
import ExerciseCard from './ExerciseCard'
import AddExerciseForm from './AddEcerciseForm'
import { workoutAPI } from '@/api/workouts'
import { toast } from 'sonner'

const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
] as const
const dayFullNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

interface PlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: U_WorkoutPlan | null
  exerciseLab: Exercise[]
  isEditMode: boolean
  onSuccess?: () => void
}

export default function PlanModal({
  open,
  onOpenChange,
  plan,
  exerciseLab,
  isEditMode,
  onSuccess
}: PlanModalProps) {
  const [editingPlan, setEditingPlan] = useState<U_WorkoutPlan | null>(plan)
  const [selectedDay, setSelectedDay] =
    useState<(typeof daysOfWeek)[number]>('monday')
  const [isAddingExercise, setIsAddingExercise] = useState(false)
  const [addingExerciseForDay, setAddingExerciseForDay] = useState<
    (typeof daysOfWeek)[number] | null
  >(null)
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null
  )
  const [isSaving, setIsSaving] = useState(false)

  // ✅ State để lưu giá trị isActive (chỉ local, chưa gọi API)
  const [isActive, setIsActive] = useState(false)

  // Reset state khi modal đóng/mở
  useEffect(() => {
    if (open && plan) {
      setEditingPlan(plan)
      setIsActive(plan.isActive) // ✅ Sync state từ plan
    } else if (!open) {
      setEditingPlan(null)
      setIsAddingExercise(false)
      setAddingExerciseForDay(null)
      setSelectedExerciseId(null)
      setIsActive(false) // ✅ Reset state
    }
  }, [open, plan])

  const handleSave = async () => {
    if (!editingPlan || isSaving) return

    try {
      setIsSaving(true)

      const nameInput = document.querySelector<HTMLInputElement>(
        'input[placeholder="e.g., Push Pull Legs"]'
      )
      const goalInput = document.querySelector<HTMLTextAreaElement>(
        'textarea[placeholder="What\'s the goal of this program?"]'
      )
      const startDateInput =
        document.querySelector<HTMLInputElement>('input[type="date"]')
      const endDateInput =
        document.querySelectorAll<HTMLInputElement>('input[type="date"]')[1]

      const name = nameInput?.value.trim()
      const goalHint = goalInput?.value.trim()
      const startDate = startDateInput?.value
      const endDate = endDateInput?.value

      if (!name) {
        toast.error('Please enter a plan name')
        setIsSaving(false)
        return
      }

      // Transform days data to API format
      const daysArray: any[] = []
      daysOfWeek.forEach((day, index) => {
        if (editingPlan.days[day].length > 0) {
          daysArray.push({
            dow: index,
            note: `${dayFullNames[index]} Workout`,
            items: editingPlan.days[day].map((exercise) => ({
              exerciseId: exercise.exerciseId,
              targetSets: exercise.targetSets,
              repsMin: exercise.repsMin,
              repsMax: exercise.repsMax,
              targetWeight: Number(exercise.targetWeight),
              tempo: exercise.tempo,
              restSec: exercise.restSec,
              order: exercise.order
            }))
          })
        }
      })

      const planData = {
        name,
        goalHint: goalHint || '',
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive: isActive, // ✅ Dùng state thay vì đọc từ DOM
        days: daysArray
      }

      if (isEditMode) {
        // UPDATE mode
        console.log('Updating plan:', editingPlan._id)
        await workoutAPI.updatePlan(editingPlan._id, planData)
        toast.success('✅ Workout plan updated successfully!')
      } else {
        // CREATE mode
        console.log('Creating new plan')
        await workoutAPI.createPlan(planData)
        toast.success('✅ Workout plan created successfully!')
      }

      // Gọi callback để refresh danh sách plans
      if (onSuccess) {
        await onSuccess()
      }

      // Đóng modal
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error saving plan:', error)
      toast.error(
        `❌ ${error.response?.data?.message || 'Failed to save workout plan'}`
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddExercise = (day: (typeof daysOfWeek)[number]) => {
    if (!selectedExerciseId || !editingPlan) return

    const sets = Number(
      (
        document.getElementById(
          `sets-${selectedExerciseId}`
        ) as HTMLInputElement
      )?.value || 3
    )
    const weight = Number(
      (
        document.getElementById(
          `weight-${selectedExerciseId}`
        ) as HTMLInputElement
      )?.value || 0
    )
    const repsMin = Number(
      (
        document.getElementById(
          `reps-min-${selectedExerciseId}`
        ) as HTMLInputElement
      )?.value || 8
    )
    const repsMax = Number(
      (
        document.getElementById(
          `reps-max-${selectedExerciseId}`
        ) as HTMLInputElement
      )?.value || 12
    )
    const rest = Number(
      (
        document.getElementById(
          `rest-${selectedExerciseId}`
        ) as HTMLInputElement
      )?.value || 90
    )
    const tempo =
      (
        document.getElementById(
          `tempo-${selectedExerciseId}`
        ) as HTMLInputElement
      )?.value || '2-0-2-0'

    const newExercise = {
      exerciseId: selectedExerciseId,
      targetSets: sets,
      repsMin: repsMin,
      repsMax: repsMax,
      targetWeight: weight,
      restSec: rest,
      tempo: tempo,
      order: editingPlan.days[day].length + 1
    }

    setEditingPlan({
      ...editingPlan,
      days: {
        ...editingPlan.days,
        [day]: [...editingPlan.days[day], newExercise]
      }
    })

    setIsAddingExercise(false)
    setAddingExerciseForDay(null)
    setSelectedExerciseId(null)
  }

  const handleDeleteExercise = (
    day: (typeof daysOfWeek)[number],
    index: number
  ) => {
    if (!editingPlan) return

    const updatedExercises = editingPlan.days[day].filter((_, i) => i !== index)
    setEditingPlan({
      ...editingPlan,
      days: {
        ...editingPlan.days,
        [day]: updatedExercises
      }
    })
  }

  if (!editingPlan) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <div className="space-y-4 sm:space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl text-[#111827]">
              {isEditMode ? '✏️ Edit' : '➕ Create'} Workout Plan
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-[#6b7280]">
              {isEditMode
                ? 'Update your existing workout plan'
                : 'Design your weekly training schedule'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base text-[#111827]">
                  Plan Name
                </Label>
                <Input
                  placeholder="e.g., Push Pull Legs"
                  className="rounded-xl border-[#e5e7eb] h-10 sm:h-auto text-sm sm:text-base"
                  defaultValue={editingPlan.name}
                />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center gap-2">
                  {/* ✅ Controlled Switch - chỉ update state local */}
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                  <Label className="text-sm sm:text-base text-[#111827]">
                    Active Plan
                    {isActive && (
                      <span className="ml-2 text-xs text-[#10b981]">
                        {isEditMode
                          ? '(Current)'
                          : '(Will be activated on save)'}
                      </span>
                    )}
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base text-[#111827]">
                Goal Hint
              </Label>
              <Textarea
                placeholder="What's the goal of this program?"
                className="rounded-xl border-[#e5e7eb] min-h-20 text-sm sm:text-base"
                defaultValue={editingPlan.goalHint}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base text-[#111827]">
                  Start Date (Optional)
                </Label>
                <Input
                  type="date"
                  className="rounded-xl border-[#e5e7eb] h-10 sm:h-auto text-sm sm:text-base"
                  defaultValue={editingPlan.startDate}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base text-[#111827]">
                  End Date (Optional)
                </Label>
                <Input
                  type="date"
                  className="rounded-xl border-[#e5e7eb] h-10 sm:h-auto text-sm sm:text-base"
                  defaultValue={editingPlan.endDate}
                />
              </div>
            </div>

            <Separator />

            {/* Weekly Schedule */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg text-[#111827]">
                Weekly Schedule
              </h3>

              <Tabs
                value={selectedDay}
                onValueChange={(value) =>
                  setSelectedDay(value as (typeof daysOfWeek)[number])
                }
              >
                <ScrollArea className="w-full">
                  <TabsList className="inline-flex bg-[#e5e7eb]/50 rounded-xl p-1 w-full sm:w-auto">
                    {daysOfWeek.map((day, index) => (
                      <TabsTrigger
                        key={day}
                        value={day}
                        className="rounded-lg data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                          <span className="text-[10px] sm:text-xs">
                            {dayFullNames[index].slice(0, 3)}
                          </span>
                          {editingPlan.days[day].length > 0 && (
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#10b981] rounded-full" />
                          )}
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollArea>

                {daysOfWeek.map((day) => (
                  <TabsContent
                    key={day}
                    value={day}
                    className="mt-3 sm:mt-4 space-y-3 sm:space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                      <h4 className="text-sm sm:text-base text-[#111827]">
                        {dayFullNames[daysOfWeek.indexOf(day)]} Exercises
                      </h4>
                      <Button
                        size="sm"
                        className="rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] h-9 text-sm w-full sm:w-auto"
                        onClick={() => {
                          setIsAddingExercise(true)
                          setAddingExerciseForDay(day)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Exercise
                      </Button>
                    </div>

                    {isAddingExercise && addingExerciseForDay === day && (
                      <AddExerciseForm
                        exerciseLab={exerciseLab}
                        selectedExerciseId={selectedExerciseId}
                        onExerciseSelect={setSelectedExerciseId}
                        onCancel={() => {
                          setIsAddingExercise(false)
                          setAddingExerciseForDay(null)
                          setSelectedExerciseId(null)
                        }}
                        onAdd={() => handleAddExercise(day)}
                        dayName={dayFullNames[daysOfWeek.indexOf(day)]}
                      />
                    )}

                    {editingPlan.days[day].length > 0 ? (
                      <div className="space-y-3">
                        {editingPlan.days[day].map((exercise, index) => (
                          <ExerciseCard
                            key={exercise.exerciseId + index}
                            exercise={exercise}
                            exerciseLab={exerciseLab}
                            onDelete={() => handleDeleteExercise(day, index)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-[#e5e7eb] rounded-xl">
                        <p className="text-[#6b7280]">
                          No exercises added for this day
                        </p>
                        <p className="text-sm text-[#9ca3af]">
                          This is a rest day
                        </p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e5e7eb]">
              <Button
                className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] rounded-xl h-10 sm:h-auto text-sm sm:text-base"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>⏳ Saving...</>
                ) : (
                  <>{isEditMode ? '💾 Update' : '➕ Create'} Workout Plan</>
                )}
              </Button>
              <Button
                variant="ghost"
                className="rounded-xl h-10 sm:h-auto text-sm sm:text-base sm:w-auto"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
