'use client'

import { WeightCard } from '@/components/user/dashboard/WeightCard'
import { WorkoutsCard } from '@/components/user/dashboard/WorkoutsCard'
import { GoalsCard } from '@/components/user/dashboard/GoalsCard'
import { WeightChart } from '@/components/user/dashboard/WeightChart'
import { WorkoutFrequencyChart } from '@/components/user/dashboard/WorkoutFrequencyChart'
import { RecentActivity } from '@/components/user/dashboard/RecentActivity'
import { InsightsCard } from '@/components/user/dashboard/InsightsCard'
import { WeeklySchedule } from '@/components/user/dashboard/WeeklySchedule'
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
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        <div className="h-16 sm:h-20 bg-gray-100 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl text-[#111827]">Dashboard</h1>
        <p className="text-sm sm:text-base text-[#6b7280]">
          Welcome back! Here's your fitness overview.
        </p>
      </div>

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <WeightChart data={weightChartData} />
        <WorkoutFrequencyChart data={workoutFrequencyData} />
      </div>

      {/* RECENT ACTIVITY & INSIGHTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
