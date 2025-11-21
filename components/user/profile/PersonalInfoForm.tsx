import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/user/ui/card'
import { Calendar, Ruler, Weight, User } from 'lucide-react'

interface PersonalInfoFormProps {
  profile: User
}

export function PersonalInfoForm({ profile }: PersonalInfoFormProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateAge = (dob: Date) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }
    return age
  }

  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-[#111827] pt-3 text-base sm:text-lg">
          Personal Information
        </CardTitle>
        <p className="text-xs sm:text-sm text-[#6b7280]">
          Your profile details
        </p>
      </CardHeader>
      <CardContent className="pb-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#6b7280]">Gender</p>
              <p className="text-sm text-[#111827] font-medium capitalize truncate">
                {profile.gender}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#3b82f6]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#6b7280]">Age</p>
              <p className="text-sm text-[#111827] font-medium truncate">
                {calculateAge(profile.dob)} years
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
              <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#6b7280]">Height</p>
              <p className="text-sm text-[#111827] font-medium truncate">
                {profile.heightCm} cm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
              <Weight className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b5cf6]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#6b7280]">Weight</p>
              <p className="text-sm text-[#111827] font-medium truncate">
                {profile.weightKg} kg
              </p>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-[#ec4899]/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#ec4899]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#6b7280]">Date of Birth</p>
              <p className="text-sm text-[#111827] font-medium truncate">
                {formatDate(profile.dob)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
