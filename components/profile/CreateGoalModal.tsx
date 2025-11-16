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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface CreateGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateGoalData) => Promise<void>
  initialData?: Goal
  isEditing?: boolean
}

interface CreateGoalData {
  goalType: GoalType
  targetValue: number
  unit?: string
  startValue?: number
  startDate?: string
  targetDate?: string
  note?: string
  metricCode?: MetricType
  exerciseId?: string
}

const GOAL_TYPES: { value: GoalType; label: string; defaultUnit: string }[] = [
  { value: 'weight', label: 'Weight Goal', defaultUnit: 'kg' },
  { value: 'body_fat_pct', label: 'Body Fat Goal', defaultUnit: '%' },
  {
    value: 'sessions_per_week',
    label: 'Weekly Sessions',
    defaultUnit: 'sessions'
  },
  { value: 'one_rm', label: 'One Rep Max', defaultUnit: 'kg' },
  { value: 'strength', label: 'Strength Goal', defaultUnit: 'kg' },
  { value: 'endurance', label: 'Endurance Goal', defaultUnit: 'minutes' },
  { value: 'flexibility', label: 'Flexibility Goal', defaultUnit: 'cm' }
]

const METRIC_TYPES: { value: MetricType; label: string }[] = [
  { value: 'weight', label: 'Weight' },
  { value: 'height', label: 'Height' },
  { value: 'body_fat', label: 'Body Fat' },
  { value: 'muscle_mass', label: 'Muscle Mass' },
  { value: 'BMI', label: 'BMI' },
  { value: 'waist_circumference', label: 'Waist' },
  { value: 'hip_circumference', label: 'Hip' },
  { value: 'blood_pressure', label: 'Blood Pressure' },
  { value: 'heart_rate', label: 'Heart Rate' }
]

export function CreateGoalModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false
}: CreateGoalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [goalType, setGoalType] = useState<GoalType>('weight')
  const [targetValue, setTargetValue] = useState<number>(0)
  const [unit, setUnit] = useState<string>('kg')
  const [startValue, setStartValue] = useState<number | undefined>()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [targetDate, setTargetDate] = useState<Date | undefined>()
  const [note, setNote] = useState<string>('')
  const [metricCode, setMetricCode] = useState<MetricType | undefined>()
  const [exerciseId, setExerciseId] = useState<string>('')

  // ✅ Load initial data when editing
  useEffect(() => {
    if (initialData && isEditing) {
      setGoalType(initialData.type)
      setTargetValue(initialData.targetValue)
      setUnit(initialData.unit)
      setStartValue(initialData.startValue)
      setStartDate(
        initialData.startDate ? new Date(initialData.startDate) : undefined
      )
      setTargetDate(
        initialData.targetDate ? new Date(initialData.targetDate) : undefined
      )
      setNote(initialData.notes || '')
      // Set metricCode and exerciseId if available in initialData
    }
  }, [initialData, isEditing])

  // ✅ Reset form when modal closes
  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  const resetForm = () => {
    if (!isEditing) {
      setGoalType('weight')
      setTargetValue(0)
      setUnit('kg')
      setStartValue(undefined)
      setStartDate(undefined)
      setTargetDate(undefined)
      setNote('')
      setMetricCode(undefined)
      setExerciseId('')
    }
  }

  const handleGoalTypeChange = (value: GoalType) => {
    setGoalType(value)
    const selected = GOAL_TYPES.find((gt) => gt.value === value)
    if (selected) {
      setUnit(selected.defaultUnit)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!targetValue || targetValue <= 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const data: CreateGoalData = {
        goalType,
        targetValue,
        unit,
        startValue: startValue && startValue > 0 ? startValue : undefined,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        targetDate: targetDate ? format(targetDate, 'yyyy-MM-dd') : undefined,
        note: note.trim() || undefined,
        metricCode: metricCode || undefined,
        exerciseId: exerciseId.trim() || undefined
      }

      await onSubmit(data)
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error('Failed to submit goal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Goal' : 'Create New Goal'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your fitness goal details'
              : 'Set a new fitness goal to track your progress'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Type */}
          <div className="space-y-2">
            <Label htmlFor="goalType">Goal Type *</Label>
            <Select value={goalType} onValueChange={handleGoalTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOAL_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target Value & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value *</Label>
              <Input
                id="targetValue"
                type="number"
                step="0.1"
                value={targetValue || ''}
                onChange={(e) => setTargetValue(parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="kg, %, reps..."
              />
            </div>
          </div>

          {/* Start Value */}
          <div className="space-y-2">
            <Label htmlFor="startValue">Start Value (Optional)</Label>
            <Input
              id="startValue"
              type="number"
              step="0.1"
              value={startValue || ''}
              onChange={(e) =>
                setStartValue(parseFloat(e.target.value) || undefined)
              }
              placeholder="Your starting point"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !targetDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {targetDate ? format(targetDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={setTargetDate}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Metric Code (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="metricCode">Link to Metric (Optional)</Label>
            <Select
              value={metricCode || 'none'}
              onValueChange={(value) =>
                setMetricCode(
                  value === 'none' ? undefined : (value as MetricType)
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {METRIC_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exercise ID (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="exerciseId">Exercise ID (Optional)</Label>
            <Input
              id="exerciseId"
              value={exerciseId}
              onChange={(e) => setExerciseId(e.target.value)}
              placeholder="Link to specific exercise"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="note">Notes (Optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any additional notes about this goal..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !targetValue}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSubmitting
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                ? 'Update Goal'
                : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
