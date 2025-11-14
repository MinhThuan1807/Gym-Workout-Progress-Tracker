'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Clock,
  TrendingUp,
  Battery,
  Edit,
  Trash2,
  Smile,
  Meh,
  Frown
} from 'lucide-react'
import Image from 'next/image'

interface SessionDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: U_WorkoutSession | null
  exerciseLab: Exercise[]
  calculateDuration: (start: Date, end?: Date) => string
  calculateTotalVolume: (session: U_WorkoutSession) => number
  onEdit: (session: U_WorkoutSession) => void
  onDelete: (sessionId: string) => void
}

const getMoodIcon = (mood?: 'happy' | 'neutral' | 'sad') => {
  switch (mood) {
    case 'happy':
      return <Smile className="w-6 h-6 text-green-500" />
    case 'neutral':
      return <Meh className="w-6 h-6 text-yellow-500" />
    case 'sad':
      return <Frown className="w-6 h-6 text-red-500" />
    default:
      return null
  }
}

export default function SessionDetailModal({
  open,
  onOpenChange,
  session,
  exerciseLab,
  calculateDuration,
  calculateTotalVolume,
  onEdit,
  onDelete
}: SessionDetailModalProps) {
  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#111827]">
            Workout Session Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Info */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl">
                {new Date(session.startTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <p className="text-[#6b7280]">
                {new Date(session.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {session.endTime &&
                  ` - ${new Date(session.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  onOpenChange(false)
                  onEdit(session)
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-red-500 hover:bg-red-50"
                onClick={() => {
                  onOpenChange(false)
                  onDelete(session._id)
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#f9fafb] rounded-xl">
              <Clock className="w-5 h-5 text-[#6b7280] mb-2" />
              <p className="text-2xl font-semibold">
                {calculateDuration(session.startTime, session.endTime)}
              </p>
              <p className="text-sm text-[#6b7280]">Duration</p>
            </div>
            <div className="p-4 bg-[#f9fafb] rounded-xl">
              <TrendingUp className="w-5 h-5 text-[#6b7280] mb-2" />
              <p className="text-2xl font-semibold">
                {calculateTotalVolume(session).toLocaleString()} kg
              </p>
              <p className="text-sm text-[#6b7280]">Total Volume</p>
            </div>
            {session.energyLevel && (
              <div className="p-4 bg-[#f9fafb] rounded-xl">
                <Battery className="w-5 h-5 text-[#6b7280] mb-2" />
                <p className="text-2xl font-semibold">
                  {session.energyLevel}/10
                </p>
                <p className="text-sm text-[#6b7280]">Energy</p>
              </div>
            )}
            {session.mood && (
              <div className="p-4 bg-[#f9fafb] rounded-xl">
                {getMoodIcon(session.mood)}
                <p className="text-2xl font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap">
                  {session.mood}
                </p>
                <p className="text-sm text-[#6b7280] ">Mood</p>
              </div>
            )}
          </div>

          {session.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-[#111827] font-medium">Notes</h4>
                <p className="text-[#6b7280]">{session.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Exercises */}
          <div className="space-y-4">
            <h4 className="text-[#111827] font-medium">
              Exercises ({session.exercises.length})
            </h4>
            {session.exercises.map((exercise, index) => {
              const exerciseDetail = exerciseLab.find(
                (e) => String(e._id) === String(exercise.exerciseId)
              )
              return (
                <div
                  key={index}
                  className="p-4 bg-[#f9fafb] rounded-xl space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={exerciseDetail?.mediaImageUrl || '/a1.png'}
                        alt={exerciseDetail?.name || 'Exercise'}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-[#111827]">{exerciseDetail?.name}</h5>
                      <Badge variant="outline">
                        {exercise.sets.length} sets
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs text-[#6b7280] font-medium">
                      <span>Set</span>
                      <span>Reps</span>
                      <span>Weight</span>
                    </div>
                    {exercise.sets.map((set, setIndex) => (
                      <div
                        key={setIndex}
                        className="grid grid-cols-3 gap-2 text-sm"
                      >
                        <span className="text-[#6b7280]">{set.setNo}</span>
                        <span>{set.reps}</span>
                        <span>{set.weight} kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
