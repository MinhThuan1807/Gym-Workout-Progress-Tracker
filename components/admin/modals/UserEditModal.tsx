'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Switch } from '../ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { toast } from 'sonner'
import { Loader2, Camera } from 'lucide-react'

interface UserEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
  onSave: (user: any) => Promise<void>
}

export function UserEditModal({
  open,
  onOpenChange,
  user,
  onSave
}: UserEditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    _id: '',
    displayName: '',
    email: '',
    role: 'user',
    gender: '',
    dateOfBirth: '',
    height: '',
    weight: '',
    avatar: ''
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  useEffect(() => {
    if (open && user) {
      setFormData({
        _id: user._id || '',
        displayName: user.displayName || '',
        email: user.email || '',
        role: user.role || 'user',

        gender: user.gender || 'none',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        height: user.height?.toString() || '',
        weight: user.weight?.toString() || '',
        avatar: user.avatar || ''
      })
      setAvatarPreview(user.avatar || '')
      setAvatarFile(null)
    }
  }, [user, open])

  console.log(formData)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      setAvatarFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      toast.error('Display name is required')
      return
    }

    // Validate height and weight if provided
    if (
      formData.height &&
      (isNaN(Number(formData.height)) || Number(formData.height) < 0)
    ) {
      toast.error('Please enter a valid height')
      return
    }

    if (
      formData.weight &&
      (isNaN(Number(formData.weight)) || Number(formData.weight) < 0)
    ) {
      toast.error('Please enter a valid weight')
      return
    }

    setIsLoading(true)
    try {
      // Create FormData to handle both text data and file upload
      const updateData = new FormData()
      updateData.append('displayName', formData.displayName.trim())
      if (formData.gender && formData.gender !== 'none') {
        updateData.append('gender', formData.gender)
      }

      if (formData.dateOfBirth) {
        updateData.append('dateOfBirth', formData.dateOfBirth)
      }

      if (formData.height) {
        updateData.append('height', formData.height)
      }

      if (formData.weight) {
        updateData.append('weight', formData.weight)
      }

      // Add avatar file if selected
      if (avatarFile) {
        updateData.append('avatar', avatarFile)
      }

      await onSave({
        ...formData,
        gender: formData.gender === 'none' ? '' : formData.gender, // Chuyển đổi về chuỗi rỗng
        formData: updateData
      })

      // Reset form state
      setAvatarFile(null)
      setAvatarPreview('')
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error saving user:', error)
      toast.error(error.response?.data?.message || 'Failed to update user')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setAvatarFile(null)
    setAvatarPreview('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Upload Section */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={
                    avatarPreview ||
                    formData.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
                  }
                />
                <AvatarFallback>
                  {formData.displayName?.[0] || formData.email?.[0]}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-[#2d8cf0] text-white rounded-full cursor-pointer hover:bg-[#2577d4] transition-colors"
              >
                <Camera className="w-3 h-3 lg:w-4 lg:h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="Enter display name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    gender: value === 'none' ? '' : value
                  })
                }
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                min="0"
                step="0.1"
                placeholder="175"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                placeholder="70"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} disabled>
              <SelectTrigger
                id="role"
                className="bg-gray-100 cursor-not-allowed"
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Role cannot be changed</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            className="bg-[#2d8cf0] hover:bg-[#2577d4]"
            onClick={handleSave}
            disabled={isLoading || !formData.displayName.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
