'use client'

import { useMemo, useState, useEffect } from 'react'
import { ProfileHeader } from '@/components/user/profile/ProfileHeader'
import { PersonalInfoForm } from '@/components/user/profile/PersonalInfoForm'
import { GoalsSection } from '@/components/user/profile/GoalsSection'
import { QuickStatsCard } from '@/components/user/profile/QuickStatsCard'
import { AchievementsCard } from '@/components/user/profile/AchievementCard'
import { CreateGoalModal } from '@/components/user/profile/CreateGoalModal'
import { EditProfileModal } from '@/components/user/profile/EditProfileModal'
import { Skeleton } from '@/components/user/ui/skeleton'
import { Card, CardContent } from '@/components/user/ui/card'
import { AlertCircle } from 'lucide-react'
import { profileAPI } from '@/api/profile'
import { metricAPI } from '@/api/metric'
import { toast } from 'sonner'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import {
  selectCurrentUser,
  updateUserProfile,
  updateUserAvatar
} from '@/store/slices/authSlice'

interface UserProfile {
  _id: string
  displayName: string
  email: string
  gender: 'male' | 'female' | 'other'
  dob: Date
  heightCm: number
  weightKg: number
  avatar: string | File
  role: string
}

interface UpdateProfileData {
  displayName?: string
  gender?: 'male' | 'female' | 'other'
  dob?: Date
  heightCm?: number
  weightKg?: number
  avatar?: string | File
}

const mockAchievements: Achievement[] = [
  {
    _id: 'ach-1',
    name: 'First Workout',
    description: 'Complete your first training session',
    icon: '🎯',
    unlocked: true,
    color: '#10b981'
  },
  {
    _id: 'ach-2',
    name: '10 Workouts',
    description: 'Complete 10 training sessions',
    icon: '💪',
    unlocked: true,
    color: '#3b82f6'
  },
  {
    _id: 'ach-3',
    name: '50 Workouts',
    description: 'Complete 50 training sessions',
    icon: '🔥',
    unlocked: true,
    color: '#f59e0b'
  },
  {
    _id: 'ach-4',
    name: '100 Workouts',
    description: 'Complete 100 training sessions',
    icon: '🏆',
    unlocked: true,
    color: '#fbbf24'
  },
  {
    _id: 'ach-5',
    name: '7 Day Streak',
    description: 'Train for 7 consecutive days',
    icon: '⚡',
    unlocked: true,
    color: '#f97316'
  },
  {
    _id: 'ach-6',
    name: '30 Day Streak',
    description: 'Train for 30 consecutive days',
    icon: '🌟',
    unlocked: false,
    progress: 12,
    requirement: 30,
    color: '#8b5cf6'
  },
  {
    _id: 'ach-7',
    name: 'First Goal',
    description: 'Achieve your first fitness goal',
    icon: '🎖️',
    unlocked: true,
    color: '#ec4899'
  },
  {
    _id: 'ach-8',
    name: '10,000kg Volume',
    description: 'Lift 10,000kg total volume',
    icon: '💎',
    unlocked: true,
    color: '#14b8a6'
  },
  {
    _id: 'ach-9',
    name: '50,000kg Volume',
    description: 'Lift 50,000kg total volume',
    icon: '👑',
    unlocked: false,
    progress: 28500,
    requirement: 50000,
    color: '#6366f1'
  },
  {
    _id: 'ach-10',
    name: 'Bodyweight Bench',
    description: 'Bench press your bodyweight',
    icon: '🦾',
    unlocked: true,
    color: '#10b981'
  },
  {
    _id: 'ach-11',
    name: '1.5x Bodyweight Bench',
    description: 'Bench press 1.5x your bodyweight',
    icon: '🚀',
    unlocked: false,
    progress: 92,
    requirement: 120,
    color: '#f59e0b'
  },
  {
    _id: 'ach-12',
    name: 'Elite Lifter',
    description: 'Join the 1000lb club (Squat+Bench+Deadlift)',
    icon: '⭐',
    unlocked: false,
    progress: 780,
    requirement: 1000,
    color: '#fbbf24'
  }
]

const quickStats: QuickStats = {
  totalWorkouts: 124,
  currentStreak: 12,
  goalsAchieved: 3,
  totalGoals: 5,
  totalVolume: 28500
}

// Loading skeleton component
function ProfileSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <Skeleton className="w-24 h-24 sm:w-[120px] sm:h-[120px] rounded-full" />
            <div className="space-y-2 flex-1 w-full sm:w-auto text-center sm:text-left">
              <Skeleton className="h-6 sm:h-8 w-32 sm:w-48 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-48 sm:w-64 mx-auto sm:mx-0" />
              <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 mx-auto sm:mx-0" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Skeleton className="h-[250px] sm:h-[300px] rounded-2xl" />
          <Skeleton className="h-[300px] sm:h-[400px] rounded-2xl" />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <Skeleton className="h-[250px] sm:h-[300px] rounded-2xl" />
          <Skeleton className="h-[300px] sm:h-[400px] rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  // ✅ Lấy user từ Redux store
  const user = useAppSelector(selectCurrentUser)
  const dispatch = useAppDispatch()

  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoadingGoals, setIsLoadingGoals] = useState(true)
  const [goals, setGoals] = useState<Goal[]>([])
  const [achievements] = useState<Achievement[]>(mockAchievements)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  // ✅ Fetch goals from API
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return

      try {
        setIsLoadingGoals(true)
        const response = await profileAPI.getAllGoal()
        setGoals(response.data || response)
      } catch (error: any) {
        console.error('Failed to fetch goals:', error)
        toast.error('Failed to load goals')
      } finally {
        setIsLoadingGoals(false)
      }
    }

    fetchGoals()
  }, [user])

  // ✅ Helper: Kiểm tra xem goal có đạt được chưa
  const isGoalAchieved = (goal: Goal): boolean => {
    if (!goal.currentValue || !goal.targetValue || !goal.startValue)
      return false

    // Xử lý các loại goal khác nhau
    switch (goal.goalType) {
      case 'body_fat_pct':
        // Mục tiêu giảm: currentValue phải <= targetValue
        // VÀ phải giảm từ startValue
        return (
          goal.currentValue <= goal.targetValue &&
          goal.currentValue < goal.startValue
        )

      case 'weight':
      case 'strength':
      case 'endurance':
        // Mục tiêu tăng: currentValue phải >= targetValue
        // VÀ phải tăng từ startValue
        return (
          goal.currentValue >= goal.targetValue &&
          goal.currentValue > goal.startValue
        )

      default:
        // Mặc định: check based on direction
        if (goal.targetValue > goal.startValue) {
          // Increasing goal
          return goal.currentValue >= goal.targetValue
        } else {
          // Decreasing goal
          return goal.currentValue <= goal.targetValue
        }
    }
  }

  // ✅ Helper: Tính progress percentage (CHÍNH XÁC HƠN)
  const calculateProgress = (goal: Goal): number => {
    if (!goal.currentValue || !goal.targetValue || !goal.startValue) return 0

    const start = goal.startValue
    const target = goal.targetValue
    const current = goal.currentValue

    // Xác định hướng của goal (increase or decrease)
    const isIncreasing = target > start
    const isDecreasing = target < start

    if (isIncreasing) {
      // Goal tăng: weight_gain, muscle_gain, strength
      const total = target - start
      const progress = current - start

      if (total === 0) return 0
      const percentage = (progress / total) * 100
      return Math.min(Math.max(percentage, 0), 100)
    } else if (isDecreasing) {
      // Goal giảm: weight_loss, body_fat_pct
      const total = start - target
      const progress = start - current

      if (total === 0) return 0
      const percentage = (progress / total) * 100
      return Math.min(Math.max(percentage, 0), 100)
    }

    return 0
  }

  // ✅ Auto-update goal status when achieved (CẢI THIỆN LOGIC)
  const autoUpdateGoalStatus = async (goal: Goal) => {
    // Tính progress để kiểm tra
    const progress = calculateProgress(goal)
    const achieved = isGoalAchieved(goal)

    console.log(`🎯 Checking goal "${goal.goalType}":`, {
      startValue: goal.startValue,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      progress: progress.toFixed(2) + '%',
      achieved,
      status: goal.status
    })

    // Chỉ update nếu:
    // 1. Goal đang active
    // 2. Progress đạt 100% (hoặc >= 100%)
    // 3. Goal achieved theo logic kiểm tra
    if (goal.status === 'active' && progress >= 100 && achieved) {
      try {
        console.log(
          `✅ Goal "${goal.goalType}" achieved! Auto-updating status...`
        )

        const response = await profileAPI.updateGoal(goal._id, {
          status: 'achieved' as GoalStatus
        })

        const updatedGoal = response.data || response

        // Update local state
        setGoals((prev) =>
          prev.map((g) => (g._id === goal._id ? updatedGoal : g))
        )

        // Show celebration toast
        toast.success(
          `🎉 Congratulations! You've achieved your goal: ${goal.goalType}!`,
          {
            duration: 5000
          }
        )

        return true
      } catch (error: any) {
        console.error('Failed to auto-update goal status:', error)
        return false
      }
    } else if (goal.status === 'active') {
      console.log(
        `⏳ Goal "${goal.goalType}" not yet achieved (${progress.toFixed(
          2
        )}% complete)`
      )
    }

    return false
  }

  // ✅ Fetch goals with current values from metrics
  useEffect(() => {
    const fetchGoalsWithProgress = async () => {
      if (!user) return

      try {
        setIsLoadingGoals(true)
        const goalsResponse = await profileAPI.getAllGoal()
        const goalsData = goalsResponse.data || goalsResponse

        // ✅ Fetch current values from metrics for each goal
        const goalsWithProgress = await Promise.all(
          goalsData.map(async (goal: Goal) => {
            let currentValue = goal.startValue || 0

            // Nếu goal có link với metric, lấy giá trị mới nhất
            if (goal.metricCode) {
              try {
                const metricResponse = await metricAPI.getLatestByCode(
                  goal.metricCode
                )

                if (metricResponse.data) {
                  currentValue = metricResponse.data.value
                }
              } catch (error) {
                console.error(
                  `Failed to fetch metric for goal ${goal._id}:`,
                  error
                )
              }
            }

            return {
              ...goal,
              currentValue
            }
          })
        )

        setGoals(goalsWithProgress)

        // ✅ Auto-update achieved goals
        for (const goal of goalsWithProgress) {
          await autoUpdateGoalStatus(goal)
        }
      } catch (error: any) {
        console.error('Failed to fetch goals:', error)
        toast.error('Failed to load goals')
        setGoals([])
      } finally {
        setIsLoadingGoals(false)
      }
    }

    fetchGoalsWithProgress()
  }, [user])

  // ✅ Handle avatar change với Redux update
  const handleAvatarChange = async (file: File) => {
    if (!profile) return

    console.log('📸 Starting avatar upload...')
    console.log('File:', { name: file.name, size: file.size, type: file.type })

    try {
      setIsUpdating(true)

      // ✅ Chỉ gửi avatar, không gửi các field khác
      const response = await profileAPI.updateProfile({
        avatar: file
      })

      console.log('✅ API Response:', response)

      const avatar = response?.data?.avatar || response?.avatar

      if (avatar) {
        dispatch(updateUserAvatar(avatar))
        toast.success('Avatar updated successfully')
      } else {
        console.error('❌ No avatarUrl in response:', response)
        toast.error('Avatar uploaded but URL not found')
      }
    } catch (error: any) {
      console.error('❌ Avatar upload failed:', error)
      const errorMessage =
        error.response?.data?.message || 'Failed to update avatar'
      toast.error(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  // ✅ Handle profile update with better error handling
  const handleUpdateProfile = async (updates: UpdateProfileData) => {
    if (!profile) return

    try {
      setIsUpdating(true)
      console.log('📝 Updating profile with:', updates)

      const response = await profileAPI.updateProfile(updates)
      console.log('✅ Update response:', response)

      // ✅ Update Redux state with complete response
      dispatch(
        updateUserProfile({
          displayName: response.data.displayName || response.displayName,
          gender: response.data.gender || response.gender,
          dob: response.data.dob || response.dob,
          heightCm: response.data.heightCm || response.heightCm,
          weightKg: response.data.weightKg || response.weightKg,
          avatar: response.data.avatar || response.avatar
        })
      )

      toast.success('Profile updated successfully')
      setIsEditProfileOpen(false)
    } catch (error: any) {
      console.error('❌ Profile update failed:', error)
      const errorMessage =
        error.response?.data?.message || 'Failed to update profile'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  // ✅ Handle create goal
  const handleCreateGoal = async (goalData: {
    goalType: GoalType
    targetValue: number
    unit?: string
    startValue?: number
    startDate?: string
    targetDate?: string
    note?: string
    metricCode?: MetricType
    exerciseId?: string // ✅ Thêm exerciseId
  }) => {
    try {
      const response = await profileAPI.createGoal(goalData)
      const newGoal = response.data || response

      // ✅ Fetch current value if metricCode exists
      let currentValue = newGoal.startValue || 0
      if (newGoal.metricCode) {
        try {
          const metricResponse = await metricAPI.getLatestByCode(
            newGoal.metricCode
          )
          if (metricResponse.data) {
            currentValue = metricResponse.data.value
          }
        } catch (error) {
          console.error('Failed to fetch initial metric:', error)
        }
      }

      const goalWithProgress = {
        ...newGoal,
        currentValue
      }

      setGoals((prev) => [...prev, goalWithProgress])

      // ✅ Check if goal is immediately achieved
      await autoUpdateGoalStatus(goalWithProgress)

      toast.success('Goal created successfully')
      setIsGoalModalOpen(false)
    } catch (error: any) {
      console.error('Failed to create goal:', error)
      const errorMessage =
        error.response?.data?.message || 'Failed to create goal'
      toast.error(errorMessage)
    }
  }

  // ✅ Handle update goal
  const handleUpdateGoal = async (
    goalId: string,
    updates: {
      goalType?: GoalType
      targetValue?: number
      unit?: string
      startValue?: number
      startDate?: string
      targetDate?: string
      note?: string
      metricCode?: MetricType
      exerciseId?: string // ✅ Thêm exerciseId
      status?: GoalStatus
    }
  ) => {
    try {
      const response = await profileAPI.updateGoal(goalId, updates)
      let updatedGoal = response.data || response

      // ✅ Re-fetch current value if metricCode changed
      if (updates.metricCode || updatedGoal.metricCode) {
        try {
          const metricResponse = await metricAPI.getLatestByCode(
            updatedGoal.metricCode
          )
          if (metricResponse.data) {
            updatedGoal = {
              ...updatedGoal,
              currentValue: metricResponse.data.value
            }
          }
        } catch (error) {
          console.error('Failed to fetch updated metric:', error)
        }
      }

      setGoals((prev) =>
        prev.map((goal) => (goal._id === goalId ? updatedGoal : goal))
      )

      // ✅ Check if goal is now achieved
      await autoUpdateGoalStatus(updatedGoal)

      toast.success('Goal updated successfully')
      setEditingGoal(null)
    } catch (error: any) {
      console.error('Failed to update goal:', error)
      const errorMessage =
        error.response?.data?.message || 'Failed to update goal'
      toast.error(errorMessage)
    }
  }

  // ✅ Handle delete goal
  const handleDeleteGoal = async (goalId: string) => {
    try {
      await profileAPI.deleteGoal(goalId)
      setGoals((prev) => prev.filter((goal) => goal._id !== goalId))
      toast.success('Goal deleted successfully')
    } catch (error: any) {
      console.error('Failed to delete goal:', error)
      const errorMessage =
        error.response?.data?.message || 'Failed to delete goal'
      toast.error(errorMessage)
    }
  }

  // ✅ Convert user to UserProfile format
  const profile: UserProfile | null = user
    ? {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        gender: user.gender ?? 'other',
        dob: user.dob ? new Date(user.dob) : new Date(),
        heightCm: user.heightCm ?? 0,
        weightKg: user.weightKg ?? 0,
        avatar: user.avatar ?? '',
        role: user.role
      }
    : null

  const activeGoals = useMemo(
    () => goals.filter((g) => g.status === 'active'),
    [goals]
  )
  const achievedGoals = useMemo(
    () => goals.filter((g) => g.status === 'achieved'),
    [goals]
  )
  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => a.unlocked),
    [achievements]
  )

  // Show loading state nếu chưa có user
  if (!user) {
    return <ProfileSkeleton />
  }

  // Show error state nếu không có profile
  if (!profile) {
    return (
      <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
        <CardContent className="p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h3 className="text-xl text-[#111827] mb-2">
            Failed to Load Profile
          </h3>
          <p className="text-[#6b7280] mb-4">Unable to load user profile</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0 overflow-hidden">
      <ProfileHeader
        profile={profile}
        onEditClick={() => setIsEditProfileOpen(true)}
        onAvatarChange={handleAvatarChange}
        isUpdating={isUpdating}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <PersonalInfoForm profile={profile} />
          <GoalsSection
            activeGoals={activeGoals}
            achievedGoals={achievedGoals}
            onAddGoal={() => setIsGoalModalOpen(true)}
            onEditGoal={setEditingGoal}
            onDeleteGoal={handleDeleteGoal}
            isLoading={isLoadingGoals}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4 sm:space-y-6">
          <QuickStatsCard stats={quickStats} />
          <AchievementsCard
            achievements={achievements}
            unlockedCount={unlockedAchievements.length}
          />
        </div>
      </div>

      <CreateGoalModal
        open={isGoalModalOpen}
        onOpenChange={setIsGoalModalOpen}
        onSubmit={handleCreateGoal}
      />

      {editingGoal && (
        <CreateGoalModal
          open={!!editingGoal}
          onOpenChange={(open) => !open && setEditingGoal(null)}
          onSubmit={(data) => handleUpdateGoal(editingGoal._id, data)}
          initialData={editingGoal}
          isEditing
        />
      )}

      <EditProfileModal
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        profile={profile}
        onSave={handleUpdateProfile}
        isUpdating={isUpdating}
      />
    </div>
  )
}
