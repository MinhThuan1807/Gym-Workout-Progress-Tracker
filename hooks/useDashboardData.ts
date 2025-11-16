import { useState, useEffect, useMemo } from 'react'
import { metricAPI } from '@/api/metric'
import { profileAPI } from '@/api/profile'
import { workoutAPI } from '@/api/workouts'
import { toast } from 'sonner'
import { Dumbbell, Scale, Target } from 'lucide-react'

// ==================== INTERFACES ====================

interface MetricEntry {
  _id: string
  userId: string
  metricCode: string
  value: number
  unit: string
  measureAt: string
  note?: string
  createdAt: string
  updatedAt: string | null
}

interface ExerciseSet {
  setNo: number
  reps: number
  weight: number
  distanceM: number
  durationSec: number
}

interface Exercise {
  exerciseId: string
  note: string
  order: number
  sets: ExerciseSet[]
}

interface WorkoutSession {
  _id: string
  userId: string
  planId: string | null
  startTime: string
  endTime: string
  energyLevel: number
  exercises: Exercise[]
  mood: string
  note: string
  createdAt: string
  updatedAt: string | null
}

interface Goal {
  _id: string
  userId: string
  goalType: string
  metricCode: string
  startValue: number
  targetValue: number
  unit: string
  startDate: string
  targetDate: string
  status: string
  note: string
  exerciseId: string | null
  createdAt: string
  updatedAt: string | null
}

// ✅ Add WorkoutPlan interface
interface WorkoutPlanDay {
  dow: number
  note: string
  items: Array<{
    exerciseId: number
    targetSets: number
    repsMin: number
    repsMax: number
    targetWeight?: number
    tempo?: string
    restSec?: number
    order: number
  }>
}

interface WorkoutPlan {
  _id: string
  name: string
  goalHint: string
  isActive: boolean
  startDate?: string
  endDate?: string
  days: WorkoutPlanDay[]
}

// ==================== MAIN HOOK ====================

export function useDashboardData() {
  const [weightMetrics, setWeightMetrics] = useState<MetricEntry[]>([])
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]) // ✅ Add state
  const [isLoading, setIsLoading] = useState(true)

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // ✅ Fetch workout plans cùng với data khác
        const [weightRes, workoutsRes, goalsRes, plansRes] = await Promise.all([
          metricAPI.getAll({
            metricCode: 'weight' as MetricType,
            limit: 60
          }),
          workoutAPI.getSessionAll(),
          profileAPI.getAllGoal(),
          workoutAPI.getAll() // ✅ Fetch workout plans
        ])

        setWeightMetrics(weightRes.data || [])
        setWorkoutSessions(workoutsRes.data || [])
        setGoals(goalsRes.data || [])
        setWorkoutPlans(plansRes.data || []) // ✅ Set workout plans
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // ==================== WORKOUT CALCULATIONS ====================

  // Calculate this week's sessions
  const thisWeekSessions = useMemo(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay() + 1) // Monday
    weekStart.setHours(0, 0, 0, 0)

    return workoutSessions.filter((session) => {
      const sessionDate = new Date(session.startTime)
      return sessionDate >= weekStart
    })
  }, [workoutSessions])

  // Calculate last week's sessions
  const lastWeekSessions = useMemo(() => {
    const now = new Date()
    const lastWeekStart = new Date(now)
    lastWeekStart.setDate(now.getDate() - now.getDay() + 1 - 7) // Last Monday
    lastWeekStart.setHours(0, 0, 0, 0)

    const lastWeekEnd = new Date(lastWeekStart)
    lastWeekEnd.setDate(lastWeekStart.getDate() + 6) // Last Sunday
    lastWeekEnd.setHours(23, 59, 59, 999)

    return workoutSessions.filter((session) => {
      const sessionDate = new Date(session.startTime)
      return sessionDate >= lastWeekStart && sessionDate <= lastWeekEnd
    })
  }, [workoutSessions])

  // ==================== WEIGHT CALCULATIONS ====================

  // Get latest weight
  const latestWeight = useMemo(() => {
    if (weightMetrics.length === 0) return 0

    // Sort by measureAt descending
    const sorted = [...weightMetrics].sort(
      (a, b) =>
        new Date(b.measureAt).getTime() - new Date(a.measureAt).getTime()
    )

    return sorted[0]?.value || 0
  }, [weightMetrics])

  // Calculate weight trend (so với 1 tháng trước)
  const weightTrend = useMemo(() => {
    if (weightMetrics.length < 2) return 0

    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const sorted = [...weightMetrics].sort(
      (a, b) =>
        new Date(a.measureAt).getTime() - new Date(b.measureAt).getTime()
    )

    // Tìm weight gần nhất với 1 tháng trước
    const oldWeight = sorted.find((m) => new Date(m.measureAt) <= oneMonthAgo)
    const oldValue = oldWeight?.value || sorted[0]?.value || 0

    return latestWeight - oldValue
  }, [weightMetrics, latestWeight])

  // Get sparkline data (7 điểm gần nhất)
  const sparklineData = useMemo(() => {
    const sorted = [...weightMetrics].sort(
      (a, b) =>
        new Date(a.measureAt).getTime() - new Date(b.measureAt).getTime()
    )

    return sorted.slice(-7).map((m) => ({
      date: new Date(m.measureAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      value: m.value
    }))
  }, [weightMetrics])

  // Weight chart data (30 ngày)
  const weightChartData = useMemo(() => {
    const sorted = [...weightMetrics].sort(
      (a, b) =>
        new Date(a.measureAt).getTime() - new Date(b.measureAt).getTime()
    )

    return sorted.slice(-30).map((m) => ({
      date: new Date(m.measureAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      weight: m.value
    }))
  }, [weightMetrics])

  // ==================== GOAL CALCULATIONS ====================

  // Active goals
  const activeGoals = useMemo(() => {
    return goals.filter((g) => g.status === 'active')
  }, [goals])

  // Goals achieved this month
  const goalsAchievedThisMonth = useMemo(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    return goals.filter((g) => {
      if (g.status !== 'achieved') return false
      const achievedDate = new Date(g.updatedAt || g.createdAt)
      return achievedDate >= monthStart
    }).length
  }, [goals])

  // Weekly goal (mặc định 4, có thể lấy từ user profile sau)
  const weeklyGoal = 4

  // ==================== WORKOUT FREQUENCY DATA ====================

  const workoutFrequencyData = useMemo(() => {
    const now = new Date()

    return [3, 2, 1, 0].map((weeksAgo) => {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay() + 1 - weeksAgo * 7)
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      const sessionsInWeek = workoutSessions.filter((s) => {
        const sessionDate = new Date(s.startTime)
        return sessionDate >= weekStart && sessionDate <= weekEnd
      })

      return {
        week: `Week ${4 - weeksAgo}`,
        sessions: sessionsInWeek.length
      }
    })
  }, [workoutSessions])

  // ==================== RECENT ACTIVITY ====================

  // Helper: Tính duration từ startTime và endTime (phút)
  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    return Math.round((end - start) / 1000 / 60) // Convert to minutes
  }

  const recentActivity = useMemo(() => {
    const activities: any[] = []

    // Add workout sessions (5 gần nhất)
    workoutSessions.slice(-5).forEach((s) => {
      const duration = calculateDuration(s.startTime, s.endTime)

      activities.push({
        id: s._id,
        type: 'workout',
        date: s.startTime,
        description: s.planId ? `Completed workout plan` : 'Completed workout',
        icon: Dumbbell,
        color: '#10b981',
        details: `${s.exercises?.length || 0} exercises • ${duration} min • ${
          s.mood
        }`
      })
    })

    // Add weight metrics (3 gần nhất)
    weightMetrics.slice(-3).forEach((m) => {
      activities.push({
        id: m._id,
        type: 'metric',
        date: m.measureAt,
        description: 'Logged weight',
        icon: Scale,
        color: '#3b82f6',
        details: `${m.value} ${m.unit}`
      })
    })

    // Add achieved goals (2 gần nhất)
    const achievedGoals = goals.filter((g) => g.status === 'achieved').slice(-2)

    achievedGoals.forEach((g) => {
      activities.push({
        id: g._id,
        type: 'goal',
        date: g.updatedAt || g.createdAt,
        description: `Achieved: ${g.goalType}`,
        icon: Target,
        color: '#fbbf24',
        details: `${g.targetValue} ${g.unit}`
      })
    })

    // Sort by date descending
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
  }, [workoutSessions, weightMetrics, goals])

  // ==================== INSIGHTS ====================

  const insights = useMemo(() => {
    const insights: string[] = []
    const consistency = (thisWeekSessions.length / weeklyGoal) * 100

    // Workout consistency
    if (consistency >= 100) {
      insights.push("🎯 Excellent! You've hit your weekly workout goal!")
    } else if (consistency >= 80) {
      insights.push("💪 Great progress! You're almost at your weekly goal.")
    } else {
      const remaining = weeklyGoal - thisWeekSessions.length
      insights.push(
        `📈 ${remaining} more workout${
          remaining > 1 ? 's' : ''
        } to reach your weekly goal.`
      )
    }

    // Weight trend
    if (weightTrend < -0.5) {
      insights.push(
        `✅ You've lost ${Math.abs(weightTrend).toFixed(
          1
        )}kg this month. Keep it up!`
      )
    } else if (weightTrend > 0.5) {
      insights.push(`📊 You've gained ${weightTrend.toFixed(1)}kg this month.`)
    } else if (weightMetrics.length > 0) {
      insights.push(`💯 Your weight is stable at ${latestWeight.toFixed(1)}kg.`)
    }

    // Goals achievement
    if (goalsAchievedThisMonth > 0) {
      insights.push(
        `🏆 You achieved ${goalsAchievedThisMonth} goal${
          goalsAchievedThisMonth > 1 ? 's' : ''
        } this month!`
      )
    }

    // Active goals reminder
    if (activeGoals.length === 0) {
      insights.push('🎯 Set some fitness goals to track your progress!')
    } else if (activeGoals.length > 5) {
      insights.push('💡 Focus on fewer goals for better results.')
    }

    // Workout streak (7 ngày gần nhất)
    const last7Days = workoutSessions.filter((s) => {
      const sessionDate = new Date(s.startTime)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return sessionDate >= sevenDaysAgo
    })

    if (last7Days.length >= 5) {
      insights.push('🔥 Great workout streak this week!')
    }

    return insights.slice(0, 4) // Limit to 4 insights
  }, [
    thisWeekSessions,
    weeklyGoal,
    weightTrend,
    goalsAchievedThisMonth,
    activeGoals,
    workoutSessions,
    weightMetrics,
    latestWeight
  ])

  // ==================== WEEKLY SCHEDULE ====================

  // ✅ Get active workout plan
  const activePlan = useMemo(() => {
    return workoutPlans.find((plan) => plan.isActive)
  }, [workoutPlans])

  // ✅ Map day of week (0-6) to day names
  const dowToDay: Record<number, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }

  const weekDays = useMemo(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay() + 1) // Start from Monday

    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ]

    return days.map((day, index) => {
      const dayDate = new Date(weekStart)
      dayDate.setDate(weekStart.getDate() + index)

      // ✅ Check if có session trong ngày này
      const hasSession = workoutSessions.some((s) => {
        const sessionDate = new Date(s.startTime)
        return sessionDate.toDateString() === dayDate.toDateString()
      })

      // ✅ Get dow (0=Sunday, 1=Monday, ..., 6=Saturday)
      const jsDay = dayDate.getDay() // JS: 0=Sun, 1=Mon, ..., 6=Sat
      const dow = jsDay === 0 ? 0 : jsDay // Keep 0 for Sunday

      // ✅ Get planned exercises from active plan
      const plannedExercises: string[] = []
      if (activePlan) {
        const planDay = activePlan.days.find((d) => d.dow === dow)
        if (planDay && planDay.items.length > 0) {
          // Get exercise names (you can add exercise names mapping here)
          plannedExercises.push(
            ...planDay.items.map((item) => `Exercise ${item.exerciseId}`)
          )
        }
      }

      const isPlanned = plannedExercises.length > 0

      return {
        day,
        date: dayDate,
        isPlanned,
        hasSession,
        isToday: dayDate.toDateString() === now.toDateString(),
        isPast: dayDate < now && dayDate.toDateString() !== now.toDateString(),
        isFuture: dayDate > now,
        exercises: plannedExercises
      }
    })
  }, [workoutSessions, activePlan])

  return {
    isLoading,
    // Workout stats
    thisWeekSessions,
    lastWeekSessions,
    // Weight stats
    latestWeight,
    weightTrend,
    sparklineData,
    weightChartData,
    // Goals
    activeGoals,
    goalsAchievedThisMonth,
    weeklyGoal,
    // Charts
    workoutFrequencyData,
    // Activity & insights
    recentActivity,
    insights,
    // Schedule
    weekDays,
    activePlan // ✅ Export active plan (optional)
  }
}
