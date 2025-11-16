import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Flame, Target, TrendingUp } from 'lucide-react'

interface QuickStatsCardProps {
  stats: QuickStats
}

export function QuickStatsCard({ stats }: QuickStatsCardProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-[#111827] pt-3 text-base sm:text-lg">
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-3">
          {/* Total Workouts */}
          <Card className="rounded-xl border-[#e5e7eb] bg-[#10b981]/5">
            <CardContent className="p-3 sm:p-4 text-center">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-[#10b981] mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl text-[#111827]">
                {stats.totalWorkouts}
              </p>
              <p className="text-[10px] sm:text-xs text-[#6b7280]">
                Total Workouts
              </p>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="rounded-xl border-[#e5e7eb] bg-[#f59e0b]/5">
            <CardContent className="p-3 sm:p-4 text-center">
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-[#f59e0b] mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl text-[#111827]">
                {stats.currentStreak}
              </p>
              <p className="text-[10px] sm:text-xs text-[#6b7280]">
                Day Streak
              </p>
            </CardContent>
          </Card>

          {/* Goals Achieved */}
          <Card className="rounded-xl border-[#e5e7eb] bg-[#3b82f6]/5">
            <CardContent className="p-3 sm:p-4 text-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-[#3b82f6] mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl text-[#111827]">
                {stats.goalsAchieved}/{stats.totalGoals}
              </p>
              <p className="text-[10px] sm:text-xs text-[#6b7280]">
                Goals Achieved
              </p>
            </CardContent>
          </Card>

          {/* Total Volume */}
          <Card className="rounded-xl border-[#e5e7eb] bg-[#8b5cf6]/5">
            <CardContent className="p-3 sm:p-4 text-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-[#8b5cf6] mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl text-[#111827]">
                {(stats.totalVolume / 1000).toFixed(1)}k
              </p>
              <p className="text-[10px] sm:text-xs text-[#6b7280]">
                Volume (kg)
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
