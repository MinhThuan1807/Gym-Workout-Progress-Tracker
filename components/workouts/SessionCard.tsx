import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dumbbell,
  Clock,
  TrendingUp,
  Battery,
  ChevronRight,
  Smile,
  Meh,
  Frown,
  Edit,
  Trash2
} from 'lucide-react'

interface SessionCardProps {
  session: U_WorkoutSession
  onClick: (session: U_WorkoutSession) => void
  onEdit: (session: U_WorkoutSession) => void
  onDelete: (sessionId: string) => void
  calculateDuration: (start: Date, end?: Date) => string
  calculateTotalVolume: (session: U_WorkoutSession) => number
}

const getMoodIcon = (mood?: 'happy' | 'neutral' | 'sad') => {
  switch (mood) {
    case 'happy':
      return <Smile className="w-5 h-5 text-green-500" />
    case 'neutral':
      return <Meh className="w-5 h-5 text-yellow-500" />
    case 'sad':
      return <Frown className="w-5 h-5 text-red-500" />
    default:
      return null
  }
}

export default function SessionCard({
  session,
  onClick,
  onEdit,
  onDelete,
  calculateDuration,
  calculateTotalVolume
}: SessionCardProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div
            className="space-y-3 flex-1 cursor-pointer"
            onClick={() => onClick(session)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[#111827]">
                    {new Date(session.startTime).toLocaleDateString()}
                  </h3>
                  {session.mood && getMoodIcon(session.mood)}
                </div>
                <p className="text-sm text-[#6b7280]">
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
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Badge className="bg-[#10b981]/10 text-[#10b981] rounded-lg">
                <Clock className="w-3 h-3 mr-1" />
                {calculateDuration(session.startTime, session.endTime)}
              </Badge>
              <Badge variant="outline" className="rounded-lg border-[#e5e7eb]">
                {session.exercises.length} exercises
              </Badge>
              <Badge variant="outline" className="rounded-lg border-[#e5e7eb]">
                <TrendingUp className="w-3 h-3 mr-1" />
                {calculateTotalVolume(session).toLocaleString()} kg
              </Badge>
              {session.energyLevel && (
                <Badge
                  variant="outline"
                  className="rounded-lg border-[#e5e7eb] flex items-center gap-1"
                >
                  <Battery className="w-3 h-3" />
                  {session.energyLevel}/10
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#3b82f6] hover:text-[#2563eb] hover:bg-[#3b82f6]/10"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(session)
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(session._id)
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <ChevronRight className="w-5 h-5 text-[#6b7280] mt-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
