import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/user/ui/card'
import { Progress } from '@/components/user/ui/progress'
import { Dumbbell, TrendingDown, TrendingUp } from 'lucide-react'

interface WorkoutsCardProps {
  thisWeekCount: number
  lastWeekCount: number
  weeklyGoal: number
}

export function WorkoutsCard({
  thisWeekCount,
  lastWeekCount,
  weeklyGoal
}: WorkoutsCardProps) {
  const difference = thisWeekCount - lastWeekCount

  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-[#6b7280]">
          Workouts This Week
        </CardTitle>
        <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-[#3b82f6]" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl text-[#111827]">{thisWeekCount}</div>
        <div className="flex items-center gap-2">
          {difference >= 0 ? (
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
          ) : (
            <TrendingDown className="w-4 h-4 text-[#ef4444]" />
          )}
          <span
            className={`text-sm ${
              difference >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
            }`}
          >
            {difference >= 0 ? '+' : ''}
            {difference} from last week
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#6b7280]">
            <span>Weekly Goal</span>
            <span>
              {thisWeekCount}/{weeklyGoal}
            </span>
          </div>
          <Progress
            value={(thisWeekCount / weeklyGoal) * 100}
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  )
}
