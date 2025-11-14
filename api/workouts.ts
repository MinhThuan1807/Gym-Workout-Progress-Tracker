import axiosInstance from './axios'

interface IWorkoutPlanDay {
  dow: number
  note?: string
  items: IWorkoutPlanItem[]
}

interface IWorkoutPlanItem {
  exerciseId: string
  targetSets: number
  repsMin: number
  repsMax: number
  targetWeight: number
  tempo?: string
  restSec?: number
  order?: number
}

// ⚠️ FIX: Đổi interface theo đúng format backend
interface IWorkoutSessionExercise {
  exerciseId: string
  order: number
  note?: string
  sets: {
    setNo: number // Backend dùng setNo thay vì setNumber
    reps: number
    weight: number
    distanceM?: number
    durationSec?: number
    rpe?: number
    isWarmup?: boolean
  }
}

export const workoutAPI = {
  // Workout Plans
  getAll: async () => {
    const response = await axiosInstance.get('/workout-plans')
    return response.data
  },
  createPlan: async (data: {
    name: string
    goalHint: string
    startDate?: Date
    endDate?: Date
    isActive: boolean
    days: IWorkoutPlanDay[]
  }) => {
    const response = await axiosInstance.post('/workout-plans', data)
    return response.data
  },
  updatePlan: async (
    id: string,
    data: {
      name: string
      goalHint: string
      startDate?: Date
      endDate?: Date
      isActive: boolean
      days: IWorkoutPlanDay[]
    }
  ) => {
    const response = await axiosInstance.put(`/workout-plans/${id}`, data)
    return response.data
  },
  deletePlan: async (id: string) => {
    const response = await axiosInstance.delete(`/workout-plans/${id}`)
    return response.data
  },

  // Workout Sessions
  getSessionAll: async () => {
    const response = await axiosInstance.get('/workout-sessions')
    return response.data
  },
  createSession: async (data: {
    planId?: string
    startTime: Date
    endTime?: Date
    mood?: string // Backend nhận string, không phải enum
    energyLevel?: number
    note?: string // Backend dùng note thay vì notes
    exercises: IWorkoutSessionExercise[]
  }) => {
    const response = await axiosInstance.post('/workout-sessions', data)
    return response.data
  },
  updateSession: async (
    id: string,
    data: {
      planId?: string
      startTime: Date
      endTime?: Date
      mood?: string
      energyLevel?: number
      note?: string
      exercises: IWorkoutSessionExercise[]
    }
  ) => {
    const response = await axiosInstance.put(`/workout-sessions/${id}`, data)
    return response.data
  },
  deleteSession: async (id: string) => {
    const response = await axiosInstance.delete(`/workout-sessions/${id}`)
    return response.data
  }
}
