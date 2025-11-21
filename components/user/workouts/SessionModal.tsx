'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/user/ui/dialog'
import { Button } from '@/components/user/ui/button'
import { Input } from '@/components/user/ui/input'
import { Label } from '@/components/user/ui/label'
import { Textarea } from '@/components/user/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/user/ui/select'
import { Separator } from '@/components/user/ui/separator'
import { Plus, Trash2 } from 'lucide-react'
import { workoutAPI } from '@/api/workouts'
import { Card, CardContent } from '@/components/user/ui/card'
import { Badge } from '@/components/user/ui/badge'
import Image from 'next/image'
import { toast } from 'sonner'

interface SessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: U_WorkoutSession | null
  plans: U_WorkoutPlan[]
  exerciseLab: Exercise[]
  isEditMode: boolean
  onSuccess?: () => void
}

export default function SessionModal({
  open,
  onOpenChange,
  session,
  plans,
  exerciseLab,
  isEditMode,
  onSuccess
}: SessionModalProps) {
  const [editingSession, setEditingSession] = useState<U_WorkoutSession | null>(
    session
  )
  const [isSaving, setIsSaving] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | undefined>(
    session?.mood
  )
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(
    session?.planId
  )

  useEffect(() => {
    if (open && session) {
      setEditingSession(session)
      setSelectedMood(session.mood)
      setSelectedPlan(session.planId)
    } else if (!open) {
      setEditingSession(null)
      setSelectedMood(undefined)
      setSelectedPlan(undefined)
    }
  }, [open, session])

  const handleSave = async () => {
    if (!editingSession || isSaving) return

    try {
      setIsSaving(true)

      const startTimeInput = document.getElementById(
        'startTime'
      ) as HTMLInputElement
      const endTimeInput = document.getElementById(
        'endTime'
      ) as HTMLInputElement
      const notesInput = document.getElementById('notes') as HTMLTextAreaElement
      const energyInput = document.getElementById('energy') as HTMLInputElement
      const moodInput = document.getElementById('mood-text') as HTMLInputElement

      // ⚠️ Validation trước khi gửi
      if (!startTimeInput?.value) {
        toast.error('❌ Start time is required')
        setIsSaving(false)
        return
      }

      if (!endTimeInput?.value) {
        toast.error('❌ End time is required')
        setIsSaving(false)
        return
      }

      if (editingSession.exercises.length === 0) {
        toast.error('❌ Please add at least one exercise')
        setIsSaving(false)
        return
      }

      // ⚠️ FIX: Format exercises theo đúng backend schema
      const formattedExercises = editingSession.exercises.map(
        (exercise, index) => ({
          exerciseId: String(exercise.exerciseId),
          order: index + 1,
          note: '',
          sets: exercise.sets.map((set) => ({
            setNo: set.setNo, // ✅ Dùng setNo thay vì setNumber
            reps: Math.max(1, set.reps || 1), // ✅ Đảm bảo >= 1
            weight: Math.max(0, set.weight || 0), // ✅ Đảm bảo >= 0
            distanceM: 0,
            durationSec: 0,
            rpe: 5,
            isWarmup: set.isWarmup
          }))
        })
      )

      // Kiểm tra từng exercise có đầy đủ sets
      for (const ex of formattedExercises) {
        if (ex.sets.length === 0) {
          toast.error('❌ Each exercise must have at least one set')
          setIsSaving(false)
          return
        }

        // ✅ Kiểm tra từng set có đầy đủ thông tin
        for (const set of ex.sets) {
          if (!set.setNo || set.setNo < 1) {
            toast.error('❌ Invalid set number')
            setIsSaving(false)
            return
          }
          if (!set.reps || set.reps < 1) {
            toast.error('❌ Reps must be at least 1')
            setIsSaving(false)
            return
          }
        }
      }

      // ⚠️ FIX: Format data theo đúng backend schema
      const sessionData = {
        startTime: new Date(startTimeInput.value),
        endTime: new Date(endTimeInput.value),
        mood: moodInput?.value,
        energyLevel: energyInput?.valueAsNumber,
        note: notesInput?.value,
        exercises: formattedExercises as any
      }

      console.log(
        '📤 Sending session data:',
        JSON.stringify(sessionData, null, 2)
      )

      if (isEditMode) {
        await workoutAPI.updateSession(editingSession._id, sessionData)
        toast.success('✅ Session updated successfully!')
      } else {
        await workoutAPI.createSession(sessionData)
        toast.success('✅ Session created successfully!')
      }

      if (onSuccess) {
        await onSuccess()
      }

      onOpenChange(false)
    } catch (error: any) {
      console.error('❌ Error saving session:', error)
      console.error('Error details:', error.response?.data)
      toast.error(
        `❌ ${error.response?.data?.message || 'Failed to save session'}`
      )
    } finally {
      setIsSaving(false)
    }
  }

  const addExercise = (exerciseId: string) => {
    if (!editingSession) return

    const newExercise = {
      exerciseId,
      sets: [
        {
          setNo: 1,
          reps: 1,
          weight: 0,
          isWarmup: false
        }
      ]
    }

    setEditingSession({
      ...editingSession,
      exercises: [...editingSession.exercises, newExercise]
    })
  }

  const addSet = (exerciseIndex: number) => {
    if (!editingSession) return

    const updatedExercises = [...editingSession.exercises]
    const exercise = updatedExercises[exerciseIndex]

    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: [
        ...exercise.sets,
        {
          setNo: exercise.sets.length + 1,
          reps: 1,
          weight: 0,
          isWarmup: false
        }
      ]
    }

    setEditingSession({
      ...editingSession,
      exercises: updatedExercises
    })
  }

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: number
  ) => {
    if (!editingSession) return

    const updatedExercises = [...editingSession.exercises]
    const exercise = updatedExercises[exerciseIndex]
    const updatedSets = [...exercise.sets]

    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: value
    }

    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: updatedSets
    }

    setEditingSession({
      ...editingSession,
      exercises: updatedExercises
    })
  }

  const removeExercise = (index: number) => {
    if (!editingSession) return

    setEditingSession({
      ...editingSession,
      exercises: editingSession.exercises.filter((_, i) => i !== index)
    })
  }

  if (!editingSession) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-[#111827]">
            {isEditMode ? '✏️ Edit' : '➕ Create'} Workout Session
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-[#6b7280]">
            {isEditMode
              ? 'Update your workout session'
              : 'Log your workout session'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">
                Workout Plan (Optional)
              </Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="rounded-xl h-10 sm:h-auto text-sm sm:text-base">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Plan (Free Session)</SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan._id} value={plan._id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood-text" className="text-sm sm:text-base">
                Mood{' '}
              </Label>
              <Input
                id="mood-text"
                type="text"
                placeholder=" happy or neutral or sad "
                className="rounded-xl h-10 sm:h-auto text-sm sm:text-base"
                defaultValue={editingSession.mood}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm sm:text-base">
                Start Time *
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                className="rounded-xl h-10 sm:h-auto text-sm sm:text-base"
                defaultValue={new Date(editingSession.startTime)
                  .toISOString()
                  .slice(0, 16)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm sm:text-base">
                End Time *
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                className="rounded-xl h-10 sm:h-auto text-sm sm:text-base"
                defaultValue={
                  editingSession.endTime
                    ? new Date(editingSession.endTime)
                        .toISOString()
                        .slice(0, 16)
                    : ''
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="energy" className="text-sm sm:text-base">
                Energy Level (1-10)
              </Label>
              <Input
                id="energy"
                type="number"
                min="1"
                max="10"
                className="rounded-xl h-10 sm:h-auto text-sm sm:text-base"
                defaultValue={editingSession.energyLevel}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm sm:text-base">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="How did the workout go?"
              className="rounded-xl min-h-20 text-sm sm:text-base"
              defaultValue={editingSession.notes}
            />
          </div>

          <Separator />

          {/* Exercises */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg text-[#111827]">Exercises</h3>
              <Select onValueChange={addExercise}>
                <SelectTrigger className="w-[200px] rounded-xl">
                  <SelectValue placeholder="Add Exercise" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseLab.map((exercise) => (
                    <SelectItem key={exercise._id} value={String(exercise._id)}>
                      {exercise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {editingSession.exercises.map((exercise, exIndex) => {
              const exerciseDetail = exerciseLab.find(
                (e) => String(e._id) === String(exercise.exerciseId)
              )
              return (
                <Card key={exIndex} className="rounded-xl">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={exerciseDetail?.mediaImageUrl || '/a1.png'}
                            alt={exerciseDetail?.name || 'Exercise'}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-[#111827]">
                            {exerciseDetail?.name}
                          </h4>
                          <Badge variant="outline">
                            {exercise.sets.length} sets
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => removeExercise(exIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center gap-2">
                          <span className="text-sm text-[#6b7280] w-12">
                            Set {set.setNo}
                          </span>
                          <Label>Reps</Label>
                          <Input
                            type="number"
                            placeholder="Reps"
                            value={set.reps}
                            onChange={(e) =>
                              updateSet(
                                exIndex,
                                setIndex,
                                'reps',
                                Number(e.target.value)
                              )
                            }
                            className="rounded-lg h-9 text-sm"
                          />
                          <Label>Weight</Label>
                          <Input
                            type="number"
                            placeholder="Weight (kg)"
                            value={set.weight}
                            onChange={(e) =>
                              updateSet(
                                exIndex,
                                setIndex,
                                'weight',
                                Number(e.target.value)
                              )
                            }
                            className="rounded-lg h-9 text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-lg"
                      onClick={() => addSet(exIndex)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Set
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e5e7eb]">
            <Button
              className="flex-1 bg-[#10b981] hover:bg-[#059669] rounded-xl h-10 sm:h-auto text-sm sm:text-base"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving
                ? '⏳ Saving...'
                : `${isEditMode ? '💾 Update' : '➕ Create'} Session`}
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
      </DialogContent>
    </Dialog>
  )
}
