import { AlertTriangle, Loader2, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Button } from '../ui/button'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { uploadVideoAPI } from '@/api'

interface UploadVideoExerciseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  itemVideoUrl: string
  itemId: string
}

export function UploadVideoExerciseModal({
  open,
  onOpenChange,
  itemName,
  itemVideoUrl,
  itemId
}: UploadVideoExerciseModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<{ video: string }>({
    video: ''
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Create/revoke object URL for preview
  useEffect(() => {
    if (!open) {
      // cleanup when modal closes
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      return
    }
    if (videoFile) {
      const url = URL.createObjectURL(videoFile)
      setPreviewUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setPreviewUrl(itemVideoUrl || null)
    }
  }, [videoFile, itemVideoUrl, open])

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video size must be less than 100MB')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      setVideoFile(file)
      // previewUrl will be set by useEffect
    }
  }

  const handleSubmit = async () => {
    if (!videoFile) {
      toast.error('Please select a video file to upload')
      return
    }

    setIsLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('video', videoFile)

      const res = await uploadVideoAPI(itemId, formDataToSend)
      toast.success(res.message || 'Video uploaded successfully')

      // Reset form
      setVideoFile(null)
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error uploading video:', error)
      toast.error(error?.response?.data?.message || 'Failed to upload video')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setVideoFile(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Exercise Video
          </DialogTitle>
          <DialogDescription className="text-center">
            Upload video for exercise: <strong>"{itemName}"</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 items-start gap-4">
          <div className="col-span-4 space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleSelectFile}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {videoFile || previewUrl ? 'Change Video' : 'Upload Video'}
            </Button>
            {previewUrl && (
              <div className="relative w-full h-48 border rounded overflow-hidden">
                <video
                  src={previewUrl}
                  className="w-full h-full object-center mx-auto my-0"
                  controls
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={isLoading || !videoFile}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
