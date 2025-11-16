import { useState, useEffect } from 'react'
import { profileAPI } from '@/api/profile'
import { toast } from 'sonner'
import { useAppSelector } from '@/store/hook'
import { selectIsAuthenticated } from '@/store/slices/authSlice'

export interface UserProfile {
  _id: string
  displayName: string
  email: string
  gender: 'male' | 'female' | 'other'
  dob: Date
  heightCm: number
  weightKg: number
  avatarUrl?: string
  role: string
}

export interface UpdateProfileData {
  displayName?: string
  gender?: 'male' | 'female' | 'other'
  dob?: Date
  heightCm?: number
  weightKg?: number
  avatar?: File
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ Kiểm tra authentication state từ Redux
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const fetchProfile = async () => {
    // ✅ Chỉ fetch khi đã authenticated
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await profileAPI.getProfile()
      setProfile(data)
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to fetch profile'
      setError(errorMessage)

      // ✅ Không show toast nếu là lỗi 410 (sẽ được handle bởi axios interceptor)
      if (err.response?.status !== 410) {
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: UpdateProfileData) => {
    if (!profile) return

    try {
      setIsLoading(true)
      const updatedProfile = await profileAPI.updateProfile({
        _id: profile._id,
        email: profile.email,
        role: profile.role,
        ...updates,
        dob: updates.dob ? new Date(updates.dob) : undefined
      })

      setProfile(updatedProfile)
      toast.success('Profile updated successfully')
      return updatedProfile
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to update profile'

      // ✅ Không show toast nếu là lỗi 410
      if (err.response?.status !== 410) {
        toast.error(errorMessage)
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // ✅ Delay một chút để đảm bảo auth state đã stable
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        fetchProfile()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated]) // ✅ Dependency vào isAuthenticated

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetchProfile: fetchProfile
  }
}
