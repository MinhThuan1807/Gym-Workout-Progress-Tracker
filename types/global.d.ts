declare global {
  interface RegisterAdminParams {
    secretKey: string
    email: string
    password: string
  }

  interface RegisterUserParams {
    email: string
    password: string
  }

  interface VerifyEmailParams {
    email: string
    token: string
  }

  type SignInFormData = {
    email: string
    password: string
  }
  type SignUpAdminFormData = {
    secretKey: string
    email: string
    password: string
    confirmPassword: string
  }
  type SignUpFormData = {
    email: string
    password: string
    confirmPassword: string
  }

  interface Goal {
    _id: string
    type: GoalType
    name: string
    startValue?: number
    currentValue: number
    targetValue: number
    unit: string
    status: GoalStatus
    startDate: string
    targetDate?: string
    linkedExerciseId?: number
    linkedExerciseName?: string
    notes?: string
  }

  interface Achievement {
    _id: string
    name: string
    description: string
    icon: string
    unlocked: boolean
    progress?: number
    requirement?: number
    color?: string
  }

  interface UserProfile {
    displayName: string
    email: string
    gender?: 'male' | 'female' | 'other'
    dob?: string
    heightCm?: number
    weightKg?: number
    avatarUrl?: string
    role: string
  }
  interface MetricEntry {
    _id: string
    metricCode: MetricType
    value: number
    unit: string
    note?: string
    measureAt: string
  }

  interface MetricConfig {
    name: string
    unit: string
    metricCode: MetricType
    category: 'weight' | 'body_composition' | 'measurements' | 'vitals'
    goalDirection?: 'up' | 'down'
    color: string
  }

  interface PlanExercise {
    _id: string
    exerciseId: number
    exerciseName: string
    exerciseThumbnail: string
    targetSets: number
    repsMin: number
    repsMax: number
    targetWeight?: number
    restTime?: number
    tempo?: string
  }

  interface WorkoutPlan {
    _id: string
    name: string
    goalHint: string
    isActive: boolean
    startDate?: string
    endDate?: string
    weeklySchedule: {
      sunday: PlanExercise[]
      monday: PlanExercise[]
      tuesday: PlanExercise[]
      wednesday: PlanExercise[]
      thursday: PlanExercise[]
      friday: PlanExercise[]
      saturday: PlanExercise[]
    }
  }
  interface U_WorkoutPlan {
    _id: string
    name: string
    goalHint: string
    startDate?: string
    endDate?: string
    isActive: boolean
    days: {
      sunday: U_Exercise[]
      monday: U_Exercise[]
      tuesday: U_Exercise[]
      wednesday: U_Exercise[]
      thursday: U_Exercise[]
      friday: U_Exercise[]
      saturday: U_Exercise[]
    }
  }
  type FormInputProps = {
    name: string
    label: string
    placeholder: string
    type?: string
    register: UseFormRegister<SignUpFormData>
    error?: FieldError
    validation?: RegisterOptions
    disabled?: boolean
    value?: string
  }
  type FormCheckoutInputProps = {
    name: keyof CheckoutFormData
    label: string
    placeholder: string
    type?: string
    register: UseFormRegister<CheckoutFormData>
    error?: FieldError
    validation?: RegisterOptions
    disabled?: boolean
    value?: string
  }
  type FooterLinkProps = {
    text: string
    linkText: string
    href: string
  }

  interface User {
    _id: string
    email: string
    displayName?: string
    role: string
    gender?: string
    dob?: Date
    heightCm?: number
    weightKg?: number
    avatar?: string
    createAt: Date
    updateAt: Date
  }

  interface AuthUser {
    _id: string
    email: string
    displayName?: string
    role: string
    avatar?: string
  }

  interface Exercise {
    _id: string
    name: string
    type: 'Strength' | 'Cardio' | 'Calisthenics' | 'Mobility' | 'Flexibility'
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    muscleGroup: string
    secondaryMuscles?: string[]
    equipment: string
    description: string
    mediaImageUrl: string
    mediaVideoUrl?: string
  }
  interface Goal {
    id: string
    type: GoalType
    name: string
    startValue?: number
    currentValue: number
    targetValue: number
    unit: string
    status: GoalStatus
    startDate: string
    targetDate?: string
    linkedExerciseId?: number
    linkedExerciseName?: string
    notes?: string
  }

  interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    unlocked: boolean
    progress?: number
    requirement?: number
    color?: string
  }

  interface UserProfile {
    displayName: string
    email: string
    gender?: 'male' | 'female' | 'other'
    dob?: string
    heightCm?: number
    weightKg?: number
    avatarUrl?: string
    role: string
  }
  interface MetricEntry {
    id: string
    date: string
    metricType: MetricType
    value: number
    notes?: string
  }

  interface MetricConfig {
    name: string
    unit: string
    category: MetricCategory
    goalDirection?: 'up' | 'down'
    color: string
  }

  interface PlanExercise {
    id: string
    exerciseId: number
    exerciseName: string
    exerciseThumbnail: string
    targetSets: number
    repsMin: number
    repsMax: number
    targetWeight?: number
    restTime?: number
    tempo?: string
  }

  interface WorkoutSession {
    _id: string
    startTime: string
    endTime?: string
    planId?: string
    planName?: string
    exercises: SessionExercise[]
    mood?: 'happy' | 'neutral' | 'sad'
    energyLevel?: number
    notes?: string
  }
  // ===== TYPES =====
  type MetricType =
    | 'weight'
    | 'height'
    | 'body_fat'
    | 'muscle_mass'
    | 'BMI'
    | 'waist_circumference'
    | 'hip_circumference'
    | 'blood_pressure'
    | 'heart_rate'

  type MetricCategory = 'weight' | 'bodyFat' | 'measurements' | 'vitals'
  interface WorkoutPlan {
    id: string
    name: string
    goalHint: string
    isActive: boolean
    startDate?: string
    endDate?: string
    weeklySchedule: {
      sunday: PlanExercise[]
      monday: PlanExercise[]
      tuesday: PlanExercise[]
      wednesday: PlanExercise[]
      thursday: PlanExercise[]
      friday: PlanExercise[]
      saturday: PlanExercise[]
    }
  }

  interface ExerciseSet {
    setNo: number
    reps: number
    weight: number
    rpe?: number
    isWarmup: boolean
  }

  interface SessionExercise {
    exerciseId: string
    exerciseName?: string
    sets: ExerciseSet[]
  }

  interface WorkoutSession {
    id: string
    startTime: Date
    endTime?: Date
    planId?: string
    planName?: string
    exercises: SessionExercise[]
    mood?: 'happy' | 'neutral' | 'sad'
    energyLevel?: number
    notes?: string
  }
  interface U_WorkoutSession {
    _id: string
    startTime: Date
    endTime?: Date
    planId?: string
    planName?: string
    exercises: SessionExercise[]
    mood?: 'happy' | 'neutral' | 'sad'
    energyLevel?: number
    notes?: string
  }

  interface U_Exercise {
    exerciseId: string
    targetSets: number
    repsMin: number
    repsMax: number
    targetWeight: number
    tempo: string
    restSec: number
    order: number
  }

  // ====== Admin =====
  interface CreateMuscleGroupParams {
    name: string
    description?: string
  }

  interface UpdateMuscleGroupRequest {
    name?: string
    description?: string
    image?: string
  }
  interface I_Exercise {
    _id?: string
    name: string
    description?: string
    type: 'strength' | 'cardio' | 'mobility' | 'flexibility' | 'calisthenics'
    difficulty: 'beginner' | 'intermediate' | 'advance'
    equipment?: string
    mediaVideoUrl?: string
    mediaImageUrl?: string
    primaryMuscles: string[]
    secondaryMuscles: string[]
    createdAt: Date
    updatedAt: Date | null
  }
  interface MuscleGroup {
    _id?: string
    name: string
    description?: string
    imageUrl?: string
    imagePublicId?: string
    createdAt: Date
    updatedAt: Date
  }

  interface Exercise {
    _id?: string
    adminId: string
    name: string
    description?: string
    type: 'strength' | 'cardio' | 'calisthenics' | 'mobility' | 'flexibility'
    difficulty: 'beginner' | 'intermediate' | 'advance'
    equipment?: string
    mediaVideoUrl?: string
    mediaVideoPublicId?: string
    mediaImageUrl?: string
    mediaImagePublicId?: string
    primaryMuscles: string[]
    secondaryMuscles: string[]
    isPublic: boolean
    createdAt: Date
    updatedAt: Date | null
  }

  interface CreateExerciseParams {
    name: string
    description?: string
    type: 'strength' | 'cardio' | 'mobility' | 'flexibility' | 'calisthenics'
    difficulty?: 'beginner' | 'intermediate' | 'advance'
    equipment?: string
    primaryMuscles: string[]
    secondaryMuscles?: string[]
    isPublic?: boolean
  }

  interface UpdateExerciseParams {
    name?: string
    description?: string
    type?: 'strength' | 'cardio' | 'calisthenics' | 'mobility' | 'flexibility'
    difficulty?: 'beginner' | 'intermediate' | 'advance'
    equipment?: string
    primaryMuscles?: string[]
    secondaryMuscles?: string[]
    isPublic?: boolean
  }

  // ===== Blog =====

  interface Blog {
    _id?: string
    adminId: string
    name: string
    description?: string
    content?: string
    type: 'general' | 'nutrition' | 'workout' | 'lifestyle' | 'other'
    thumbnailUrl?: string
    thumbnailPublicId?: string
    likes: number
    views: number
    createdAt: Date
    updatedAt: Date | null
  }

  interface CreateBlogRequest {
    name: string
    description?: string
    content?: string
    type: 'general' | 'nutrition' | 'workout' | 'lifestyle' | 'other'
  }

  interface UpdateBlogRequest {
    name?: string
    description?: string
    content?: string
    type?: 'general' | 'nutrition' | 'workout' | 'lifestyle' | 'other'
  }
}
export {}
