import { Card, CardContent } from '@/components/user/ui/card'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/user/ui/avatar'
import { Button } from '@/components/user/ui/button'
import { Badge } from '@/components/user/ui/badge'
import { Edit, Camera, Loader2 } from 'lucide-react'
import { useRef } from 'react'

interface ProfileHeaderProps {
  profile: User
  onEditClick: () => void
  onAvatarChange?: (file: File) => void
  isUpdating?: boolean
}

export function ProfileHeader({
  profile,
  onEditClick,
  onAvatarChange,
  isUpdating
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onAvatarChange) {
      onAvatarChange(file)
    }
  }

  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-r from-[#10b981] to-[#3b82f6] opacity-10" />
      <CardContent className="p-4 sm:p-6 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
            {/* Large Avatar with Edit Overlay */}
            <div className="relative group">
              <Avatar className="w-24 h-24 sm:w-[120px] sm:h-[120px] border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-xl sm:text-2xl">
                  {profile.displayName}
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                onClick={handleAvatarClick}
              >
                {isUpdating ? (
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Name, Email, Role */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl text-[#111827] mb-1">
                {profile.displayName}
              </h1>
              <p className="text-sm sm:text-base text-[#6b7280] mb-2">
                {profile.email}
              </p>
              <Badge className="bg-[#10b981] text-white rounded-lg px-3 py-1">
                {profile.role}
              </Badge>
            </div>
          </div>

          {/* Edit Profile Button */}
          <Button
            variant="outline"
            className="rounded-xl border-[#e5e7eb] w-full sm:w-auto"
            onClick={onEditClick}
            disabled={isUpdating}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
