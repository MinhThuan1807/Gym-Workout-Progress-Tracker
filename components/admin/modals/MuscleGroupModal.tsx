'use client'

import { useState, useRef, useEffect } from 'react'
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
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'
import { Upload, Loader2 } from 'lucide-react'

interface MuscleGroup {
  name: string
  description: string
  imageUrl?: string
}

interface MuscleGroupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  muscleGroup: MuscleGroup | null
  onSave: (formData: FormData) => Promise<void> // Thay đổi để return Promise
}

export function MuscleGroupModal({
  open,
  onOpenChange,
  muscleGroup,
  onSave
}: MuscleGroupModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: muscleGroup?.name || '',
    description: muscleGroup?.description || ''
  })

  useEffect(() => {
    if (open) {
      if (muscleGroup) {
        // Edit mode: populate form with existing data
        setFormData({
          name: muscleGroup.name || '',
          description: muscleGroup.description || ''
        })
        // Set imagePreview from current imageUrl
        setImagePreview(muscleGroup.imageUrl || '')
      } else {
        // Add mode: reset form
        setFormData({
          name: '',
          description: ''
        })
        setImagePreview('')
      }
      // Reset file input
      setImageFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [muscleGroup, open])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    setIsLoading(true)
    try {
      const formDataToSend = new FormData()

      // Append text data
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)

      // Append image file if exists
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      await onSave(formDataToSend)
      onOpenChange(false)

      // Reset form
      setImageFile(null)
      setImagePreview('')
      setFormData({ name: '', description: '' })
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error('Error saving muscle group:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {muscleGroup ? 'Edit Muscle Group' : 'Add New Muscle Group'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Chest, Back, Legs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the muscle group and its primary muscles..."
              rows={5}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <div className="col-span-4 space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {imageFile || imagePreview ? 'Change Image' : 'Upload Image'}
              </Button>
              {imagePreview && (
                <div className="relative w-full h-48 border rounded overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-50 h-full object-center mx-auto my-0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#2d8cf0] hover:bg-[#2577d4]"
            onClick={handleSave}
            disabled={isLoading || !formData.name.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {muscleGroup ? 'Updating...' : 'Saving...'}
              </>
            ) : muscleGroup ? (
              'Update'
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
