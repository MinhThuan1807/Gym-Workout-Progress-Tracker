'use client'

import { useMemo, useState, useEffect } from 'react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm'
import { GoalsSection } from '@/components/profile/GoalsSection'
import { QuickStatsCard } from '@/components/profile/QuickStatsCard'
import { AchievementsCard } from '@/components/profile/AchievementCard'
import { CreateGoalModal } from '@/components/profile/CreateGoalModal'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
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
  avatarUrl: string
  role: string
}

interface UpdateProfileData {
  displayName?: string
  gender?: 'male' | 'female' | 'other'
  dob?: Date
  heightCm?: number
  weightKg?: number
  avatar?: File
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
    <div className="space-y-6">
      <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Skeleton className="w-[120px] h-[120px] rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-[300px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[300px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
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
                // ✅ Sử dụng API mới
                const metricResponse = await metricAPI.getLatestByCode(
                  goal.metricCode
                )

                // ✅ Check if data exists
                if (metricResponse.data) {
                  currentValue = metricResponse.data.value
                }
              } catch (error) {
                console.error(
                  `Failed to fetch metric for goal ${goal._id}:`,
                  error
                )
                // Keep using startValue as fallback
              }
            }

            return {
              ...goal,
              currentValue
            }
          })
        )

        setGoals(goalsWithProgress)
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

      const avatarUrl = response?.data?.avatarUrl || response?.avatarUrl

      if (avatarUrl) {
        dispatch(updateUserAvatar(avatarUrl))
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
          avatarUrl: response.data.avatarUrl || response.avatarUrl
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
    exerciseId?: string
  }) => {
    try {
      const response = await profileAPI.createGoal(goalData)
      const newGoal = response.data || response

      setGoals((prev) => [...prev, newGoal])
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
      exerciseId?: string
      status?: GoalStatus
    }
  ) => {
    try {
      const response = await profileAPI.updateGoal(goalId, updates)
      const updatedGoal = response.data || response

      setGoals((prev) =>
        prev.map((goal) => (goal._id === goalId ? updatedGoal : goal))
      )
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
  const profile: UserProfile = user
    ? {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        gender: user.gender ?? 'other',
        dob: user.dob ? new Date(user.dob) : new Date(), 
        heightCm: user.heightCm ?? 0,
        weightKg: user.weightKg ?? 0,
        avatarUrl: user.avatarUrl,
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
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        onEditClick={() => setIsEditProfileOpen(true)}
        onAvatarChange={handleAvatarChange}
        isUpdating={isUpdating}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
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
        <div className="space-y-6">
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
