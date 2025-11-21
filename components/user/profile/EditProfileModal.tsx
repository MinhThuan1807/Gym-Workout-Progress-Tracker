import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/user/ui/dialog'
import { Button } from '@/components/user/ui/button'
import { Input } from '@/components/user/ui/input'
import { Label } from '@/components/user/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/user/ui/select'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface UpdateProfileData {
  displayName?: string
  gender?: 'male' | 'female' | 'other'
  dob?: Date
  heightCm?: number
  weightKg?: number
}

interface UserProfile {
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

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: UserProfile
  onSave: (data: UpdateProfileData) => Promise<void>
  isUpdating?: boolean
}

export function EditProfileModal({
  open,
  onOpenChange,
  profile,
  onSave,
  isUpdating
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<UpdateProfileData>({
    displayName: profile.displayName,
    gender: profile.gender,
    dob: profile.dob,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg
  })

  // ✅ Reset form when profile changes
  useEffect(() => {
    if (open && profile) {
      setFormData({
        displayName: profile.displayName,
        gender: profile.gender,
        dob: profile.dob,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg
      })
    }
  }, [profile, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Validate before submit
    if (!formData.displayName?.trim()) {
      toast.error('Display name is required')
      return
    }

    try {
      await onSave(formData)
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-[#111827]">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-[#6b7280]">
            Update your personal information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 py-4">
          {/* Display Name */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base text-[#111827]">
              Display Name *
            </Label>
            <Input
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              className="rounded-xl border-[#e5e7eb] h-10 sm:h-auto text-sm sm:text-base"
              required
              disabled={isUpdating}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base text-[#111827]">
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value: 'male' | 'female' | 'other') =>
                  setFormData({ ...formData, gender: value })
                }
                disabled={isUpdating}
              >
                <SelectTrigger className="rounded-xl border-[#e5e7eb] h-10 sm:h-auto text-sm sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base text-[#111827]">
                Date of Birth
              </Label>
              <Input
                type="date"
                value={
                  formData.dob
                    ? new Date(formData.dob).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dob: e.target.value ? new Date(e.target.value) : undefined
                  })
                }
                className="rounded-xl border-[#e5e7eb] h-10 sm:h-auto text-sm sm:text-base"
                disabled={isUpdating}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Height */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base text-[#111827]">
                Height (cm)
              </Label>
              <Input
                type="number"
                step="0.1"
                value={formData.heightCm || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heightCm: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined
                  })
                }
                className="rounded-xl border-[#e5e7eb] h-10 sm:h-auto text-sm sm:text-base"
                disabled={isUpdating}
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base text-[#111827]">
                Weight (kg)
              </Label>
              <Input
                type="number"
                step="0.1"
                value={formData.weightKg || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weightKg: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined
                  })
                }
                className="rounded-xl border-[#e5e7eb] h-10 sm:h-auto text-sm sm:text-base"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-[#e5e7eb]">
            <Button
              type="submit"
              className="flex-1 bg-[#10b981] hover:bg-[#059669] rounded-xl h-10 sm:h-auto text-sm sm:text-base"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl h-10 sm:h-auto text-sm sm:text-base"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
