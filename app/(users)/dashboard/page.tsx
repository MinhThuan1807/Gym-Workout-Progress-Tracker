'use client'

import { WeightCard } from '@/components/dashboard/WeightCard'
import { WorkoutsCard } from '@/components/dashboard/WorkoutsCard'
import { GoalsCard } from '@/components/dashboard/GoalsCard'
import { WeightChart } from '@/components/dashboard/WeightChart'
import { WorkoutFrequencyChart } from '@/components/dashboard/WorkoutFrequencyChart'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { InsightsCard } from '@/components/dashboard/InsightsCard'
import { WeeklySchedule } from '@/components/dashboard/WeeklySchedule'
import { useDashboardData } from '@/hooks/useDashboardData'

const Dashboard = () => {
  const {
    isLoading,
    thisWeekSessions,
    lastWeekSessions,
    latestWeight,
    weightTrend,
    sparklineData,
    activeGoals,
    goalsAchievedThisMonth,
    weeklyGoal,
    weightChartData,
    workoutFrequencyData,
    recentActivity,
    insights,
    weekDays
  } = useDashboardData()

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-gray-100 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#111827]">Dashboard</h1>
        <p className="text-[#6b7280]">
          Welcome back! Here's your fitness overview.
        </p>
      </div>

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WeightCard
          latestWeight={latestWeight}
          weightTrend={weightTrend}
          sparklineData={sparklineData}
        />
        <WorkoutsCard
          thisWeekCount={thisWeekSessions.length}
          lastWeekCount={lastWeekSessions.length}
          weeklyGoal={weeklyGoal}
        />
        <GoalsCard
          activeGoals={activeGoals}
          goalsAchievedThisMonth={goalsAchievedThisMonth}
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeightChart data={weightChartData} />
        <WorkoutFrequencyChart data={workoutFrequencyData} />
      </div>

      {/* RECENT ACTIVITY & INSIGHTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivity} timeAgo={timeAgo} />
        </div>
        <InsightsCard insights={insights} />
      </div>

      {/* WEEKLY SCHEDULE PREVIEW */}
      <WeeklySchedule weekDays={weekDays} />
    </div>
  )
}

export default Dashboard