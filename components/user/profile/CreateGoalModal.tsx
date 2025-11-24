'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/user/ui/dialog'
import { Button } from '@/components/user/ui/button'
import { Input } from '@/components/user/ui/input'
import { Label } from '@/components/user/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/user/ui/select'
import { Textarea } from '@/components/user/ui/textarea'
import { Calendar } from '@/components/user/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/user/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { exerciseAPI } from '@/api/exercise' // ✅ Import exercise API
import { toast } from 'sonner'

interface CreateGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    goalType: GoalType
    targetValue: number
    unit?: string
    startValue?: number
    startDate?: string
    targetDate?: string
    note?: string
    metricCode?: MetricType
    exerciseId?: string
  }) => void
  initialData?: Goal
  isEditing?: boolean
}

const GOAL_TYPES = [
  { value: 'weight', label: 'Weight Goal' },
  { value: 'body_fat_pct', label: 'Body Fat %' },
  { value: 'muscle_mass', label: 'Muscle Mass' },
  { value: 'strength', label: 'Strength (1RM)' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'sessions_per_week', label: 'Sessions per Week' },
  { value: 'custom', label: 'Custom Goal' }
] as const

const METRIC_TYPES = [
  { value: 'weight', label: 'Weight (kg)' },
  { value: 'body_fat_pct', label: 'Body Fat %' },
  { value: 'muscle_mass', label: 'Muscle Mass (kg)' },
  { value: 'waist', label: 'Waist (cm)' },
  { value: 'hips', label: 'Hips (cm)' },
  { value: 'thigh', label: 'Thigh (cm)' },
  { value: 'biceps', label: 'Biceps (cm)' },
  { value: 'custom', label: 'Custom Metric' }
] as const

export function CreateGoalModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false
}: CreateGoalModalProps) {
  const [goalType, setGoalType] = useState<GoalType>(
    initialData?.goalType || 'weight'
  )
  const [targetValue, setTargetValue] = useState(
    initialData?.targetValue?.toString() || ''
  )
  const [unit, setUnit] = useState(initialData?.unit || 'kg')
  const [startValue, setStartValue] = useState(
    initialData?.startValue?.toString() || ''
  )
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.startDate ? new Date(initialData.startDate) : undefined
  )
  const [targetDate, setTargetDate] = useState<Date | undefined>(
    initialData?.targetDate ? new Date(initialData.targetDate) : undefined
  )
  const [metricCode, setMetricCode] = useState<MetricType | undefined>(
    initialData?.metricCode
  )
  const [exerciseId, setExerciseId] = useState<string | undefined>(
    initialData?.exerciseId
  )
  const [note, setNote] = useState(initialData?.note || '')

  // ✅ State cho exercises
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoadingExercises, setIsLoadingExercises] = useState(false)

  // ✅ Fetch exercises từ API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoadingExercises(true)
        const response = await exerciseAPI.getAll()
        setExercises(response.data || [])
      } catch (error: any) {
        console.error('Failed to fetch exercises:', error)
        toast.error('Failed to load exercises')
      } finally {
        setIsLoadingExercises(false)
      }
    }

    // Chỉ fetch khi modal mở
    if (open) {
      fetchExercises()
    }
  }, [open])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      // Reset to initial or default values
      setGoalType(initialData?.goalType || 'weight')
      setTargetValue(initialData?.targetValue?.toString() || '')
      setUnit(initialData?.unit || 'kg')
      setStartValue(initialData?.startValue?.toString() || '')
      setStartDate(
        initialData?.startDate ? new Date(initialData.startDate) : undefined
      )
      setTargetDate(
        initialData?.targetDate ? new Date(initialData.targetDate) : undefined
      )
      setMetricCode(initialData?.metricCode)
      setExerciseId(initialData?.exerciseId)
      setNote(initialData?.note || '')
    }
  }, [open, initialData])

  const handleSubmit = () => {
    if (!targetValue) {
      toast.error('Please enter target value')
      return
    }

    onSubmit({
      goalType,
      targetValue: parseFloat(targetValue),
      unit,
      startValue: startValue ? parseFloat(startValue) : undefined,
      startDate: startDate?.toISOString(),
      targetDate: targetDate?.toISOString(),
      metricCode,
      exerciseId, // ✅ Gửi exerciseId
      note
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            {isEditing ? 'Edit Goal' : 'Create New Goal'}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Set a new fitness goal to track your progress
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-4">
          {/* Goal Type */}
          <div className="space-y-2">
            <Label htmlFor="goalType" className="text-sm sm:text-base">
              Goal Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={goalType}
              onValueChange={(value: GoalType) => setGoalType(value)}
            >
              <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
                <SelectValue placeholder="Select goal type" />
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
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="targetValue" className="text-sm sm:text-base">
                Target Value <span className="text-red-500">*</span>
              </Label>
              <Input
                id="targetValue"
                type="number"
                step="0.1"
                placeholder="Enter target value"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="h-10 sm:h-auto text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm sm:text-base">
                Unit
              </Label>
              <Input
                id="unit"
                placeholder="kg"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="h-10 sm:h-auto text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Start Value */}
          <div className="space-y-2">
            <Label htmlFor="startValue" className="text-sm sm:text-base">
              Start Value (Optional)
            </Label>
            <Input
              id="startValue"
              type="number"
              step="0.1"
              placeholder="Your starting point"
              value={startValue}
              onChange={(e) => setStartValue(e.target.value)}
              className="h-10 sm:h-auto text-sm sm:text-base"
            />
          </div>

          {/* Start Date & Target Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal h-10 sm:h-auto text-sm sm:text-base',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
              <Label className="text-sm sm:text-base">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal h-10 sm:h-auto text-sm sm:text-base',
                      !targetDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    {targetDate ? format(targetDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={setTargetDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Link to Metric */}
          <div className="space-y-2">
            <Label htmlFor="metricCode" className="text-sm sm:text-base">
              Link to Metric (Optional)
            </Label>
            <Select
              value={metricCode || 'none'}
              onValueChange={(value) =>
                setMetricCode(
                  value === 'none' ? undefined : (value as MetricType)
                )
              }
            >
              <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
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

          {/* ✅ Exercise Selection */}
          <div className="space-y-2">
            <Label htmlFor="exerciseId" className="text-sm sm:text-base">
              Exercise ID (Optional)
            </Label>
            <Select
              value={exerciseId || 'none'}
              onValueChange={(value) =>
                setExerciseId(value === 'none' ? undefined : value)
              }
              disabled={isLoadingExercises}
            >
              <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
                <SelectValue
                  placeholder={
                    isLoadingExercises
                      ? 'Loading exercises...'
                      : 'Link to specific exercise'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {exercises.map((exercise) => (
                  <SelectItem key={exercise._id} value={exercise._id}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{exercise.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({exercise.type})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingExercises && (
              <p className="text-xs text-muted-foreground">
                Loading exercises...
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm sm:text-base">
              Notes (Optional)
            </Label>
            <Textarea
              id="note"
              placeholder="Add any additional notes about this goal..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="text-sm sm:text-base"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-10 sm:h-auto text-sm sm:text-base"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto h-10 sm:h-auto text-sm sm:text-base"
          >
            {isEditing ? 'Update Goal' : 'Create Goal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
