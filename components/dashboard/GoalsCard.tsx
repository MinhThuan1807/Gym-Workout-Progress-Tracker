import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Target } from 'lucide-react'

interface GoalsCardProps {
  activeGoals: any[]
  goalsAchievedThisMonth: number
}

export function GoalsCard({
  activeGoals,
  goalsAchievedThisMonth
}: GoalsCardProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-[#6b7280]">Active Goals</CardTitle>
        <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center">
          <Target className="w-5 h-5 text-[#fbbf24]" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl text-[#111827]">{activeGoals.length}</div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          <span className="text-sm text-[#10b981]">
            {goalsAchievedThisMonth} achieved this month
          </span>
        </div>
        <div className="pt-2 space-y-1">
              {activeGoals.slice(0, 2).map(goal => {
                return (
                  <div key={goal._id} className="flex items-center justify-between text-xs">
                    <span className="text-[#6b7280] truncate flex-1">{goal.metricCode || goal.exerciseId}</span>
                    <span className="text-[#111827] ml-2">{goal.status}</span>
                  </div>
                );
              })}
        </div>
      </CardContent>
    </Card>
  )
}