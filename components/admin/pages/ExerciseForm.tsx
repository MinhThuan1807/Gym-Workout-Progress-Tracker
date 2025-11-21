'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { PageHeader } from '../shared/PageHeader'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Switch } from '../ui/switch'
import { FileUpload } from '../shared/FileUpload'
import { Badge } from '../ui/badge'
import { Loader2, X } from 'lucide-react'
import {
  getAllMuscleGroupsAPI,
  getExerciseByIdAPI,
  getMuscleGroupByIdAPI
} from '@/api'
import { toast } from 'sonner'
import { createExerciseAPI, updateExerciseAPI } from '@/api'

export function ExerciseForm({ exerciseId }: { exerciseId?: string }) {
  const router = useRouter()
  const params = useParams()
  const id = exerciseId || (params?.id as string | undefined)
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    difficulty: '',
    equipment: '',
    image: '',
    video: '',
    primaryMuscles: [] as string[],
    secondaryMuscles: [] as string[],
    isPublic: true
  })

  const [newPrimaryMuscle, setNewPrimaryMuscle] = useState('')
  const [newSecondaryMuscle, setNewSecondaryMuscle] = useState('')
  const [availableMuscles, setAvailableMuscles] = useState<
    Record<string, string>
  >({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch muscle groups
        const muscleGroups = await getAllMuscleGroupsAPI()
        const muscleMap: Record<string, string> = {}
        muscleGroups.data.forEach((muscle: MuscleGroup) => {
          muscleMap[muscle._id!] = muscle.name
        })
        setAvailableMuscles(muscleMap)

        // If editing, fetch exercise data
        if (isEdit) {
          const exercise = await getExerciseByIdAPI(id)

          const primaryMuscleIds =
            exercise.data.primaryMuscles?.map((muscle: any) =>
              typeof muscle === 'string' ? muscle : muscle._id || muscle.id
            ) || []

          const secondaryMuscleIds =
            exercise.data.secondaryMuscles?.map((muscle: any) =>
              typeof muscle === 'string' ? muscle : muscle._id || muscle.id
            ) || []
          setFormData({
            name: exercise.data.name,
            description: exercise.data.description || '',
            type: exercise.data.type,
            difficulty: exercise.data.difficulty,
            equipment: exercise.data.equipment || '',
            image: exercise.data.mediaImageUrl || '',
            video: exercise.data.mediaVideoUrl || '',
            primaryMuscles: primaryMuscleIds,
            secondaryMuscles: secondaryMuscleIds,
            isPublic: exercise.data.isPublic
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data')
      }
    }

    fetchData()
  }, [id, isEdit])

  // console.log(formData)

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (formData.primaryMuscles.length === 0) {
      toast.error('At least one primary muscle is required')
      return
    }

    setIsLoading(true)
    try {
      const formDataToSend = new FormData()

      // Append text data
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('type', formData.type)
      formDataToSend.append('difficulty', formData.difficulty)
      formDataToSend.append('equipment', formData.equipment)
      formData.primaryMuscles.forEach((muscle) => {
        formDataToSend.append('primaryMuscles[]', muscle)
      })

      formData.secondaryMuscles.forEach((muscle) => {
        formDataToSend.append('secondaryMuscles[]', muscle)
      })
      formDataToSend.append('isPublic', formData.isPublic.toString())

      // Append image file if exists
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      // Handle video file if exists

      if (isEdit) {
        // Call update exercise API
        const res = await updateExerciseAPI(id, formDataToSend)
        toast.success(res.message)
      } else {
        // Call create exercise API
        const res = await createExerciseAPI(formDataToSend)
        toast.success(res.message)
      }
      // Reset form
      setImageFile(null)
      setFormData({
        name: '',
        description: '',
        type: '',
        difficulty: '',
        equipment: '',
        image: '',
        video: '',
        primaryMuscles: [] as string[],
        secondaryMuscles: [] as string[],
        isPublic: true
      })
      router.push('/admin/exercises')
    } catch (error) {
      console.error('Error saving exercise:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectFile = (file: File) => {
    // const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      setImageFile(file)

      const reader = new FileReader()
      reader.readAsDataURL(file)
    }
  }

  const addPrimaryMuscle = () => {
    if (
      newPrimaryMuscle &&
      !formData.primaryMuscles.includes(newPrimaryMuscle)
    ) {
      setFormData({
        ...formData,
        primaryMuscles: [...formData.primaryMuscles, newPrimaryMuscle]
      })
      setNewPrimaryMuscle('')
    }
  }

  const addSecondaryMuscle = () => {
    if (
      newSecondaryMuscle &&
      !formData.secondaryMuscles.includes(newSecondaryMuscle)
    ) {
      setFormData({
        ...formData,
        secondaryMuscles: [...formData.secondaryMuscles, newSecondaryMuscle]
      })
      setNewSecondaryMuscle('')
    }
  }

  const removePrimaryMuscle = (muscle: string) => {
    setFormData({
      ...formData,
      primaryMuscles: formData.primaryMuscles.filter((m) => m !== muscle)
    })
  }

  const removeSecondaryMuscle = (muscle: string) => {
    setFormData({
      ...formData,
      secondaryMuscles: formData.secondaryMuscles.filter((m) => m !== muscle)
    })
  }

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title={isEdit ? 'Edit Exercise' : 'Create New Exercise'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Exercises', path: '/admin/exercises' },
          { label: isEdit ? 'Edit Exercise' : 'Create New Exercise' }
        ]}
        action={
          <Button
            variant="outline"
            onClick={() => router.push('/admin/exercises')}
            className="text-sm lg:text-base px-3 lg:px-4"
          >
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">←</span>
          </Button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
        <form className="space-y-6 lg:space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg lg:text-xl text-gray-900 mb-4 font-medium">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm lg:text-base">
                  Exercise Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Bench Press, Squat, Push-up"
                  className="text-sm lg:text-base"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm lg:text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe how to perform the exercise..."
                  rows={4}
                  className="text-sm lg:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type" className="text-sm lg:text-base">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger id="type" className="text-sm lg:text-base">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="mobility">Mobility</SelectItem>
                      <SelectItem value="flexibility">Flexibility</SelectItem>
                      <SelectItem value="calisthenics">Calisthenics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty" className="text-sm lg:text-base">
                    Difficulty
                  </Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, difficulty: value })
                    }
                  >
                    <SelectTrigger
                      id="difficulty"
                      className="text-sm lg:text-base"
                    >
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advance">Advance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="equipment" className="text-sm lg:text-base">
                    Equipment
                  </Label>
                  <Select
                    value={formData.equipment}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, equipment: value })
                    }
                  >
                    <SelectTrigger
                      id="equipment"
                      className="text-sm lg:text-base"
                    >
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="barbell">Barbell</SelectItem>
                      <SelectItem value="dumbbell">Dumbbell</SelectItem>
                      <SelectItem value="kettlebell">Kettlebell</SelectItem>
                      <SelectItem value="cable">Cable Machine</SelectItem>
                      <SelectItem value="machine">Machine</SelectItem>
                      <SelectItem value="resistance-band">
                        Resistance Band
                      </SelectItem>
                      <SelectItem value="bodyweight">Bodyweight</SelectItem>
                      <SelectItem value="plate">Weight Plate</SelectItem>
                      <SelectItem value="pull-up-bar">Pull-up Bar</SelectItem>
                      <SelectItem value="bench">Bench</SelectItem>
                      <SelectItem value="smith-machine">
                        Smith Machine
                      </SelectItem>
                      <SelectItem value="suspension-trainer">
                        Suspension Trainer
                      </SelectItem>
                      <SelectItem value="medicine-ball">
                        Medicine Ball
                      </SelectItem>
                      <SelectItem value="foam-roller">Foam Roller</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <h3 className="text-lg lg:text-xl text-gray-900 mb-4 font-medium">
              Media
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <FileUpload
                label="Exercise Image"
                preview={
                  imageFile ? URL.createObjectURL(imageFile) : formData.image
                }
                onFileSelect={handleSelectFile}
                onRemove={() => {
                  if (isEdit) {
                    setFormData({ ...formData, image: '' })
                  } else {
                    setImageFile(null)
                  }
                }}
              />
            </div>
          </div>

          {/* Muscle Groups */}
          <div>
            <h3 className="text-lg lg:text-xl text-gray-900 mb-4 font-medium">
              Muscle Groups
            </h3>
            <div className="space-y-6">
              <div>
                <Label className="text-sm lg:text-base">
                  Primary Muscles{' '}
                  <span className="text-red-500">* (at least 1)</span>
                </Label>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <div className="flex-1">
                    <Select
                      value={newPrimaryMuscle}
                      onValueChange={setNewPrimaryMuscle}
                    >
                      <SelectTrigger className="text-sm lg:text-base">
                        <SelectValue placeholder="Select muscle" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(availableMuscles).map(([id, name]) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    onClick={addPrimaryMuscle}
                    className="text-sm lg:text-base px-4 lg:px-6"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.primaryMuscles.map((muscleId) => (
                    <Badge
                      key={muscleId}
                      className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-2 lg:px-3 py-1"
                    >
                      {availableMuscles[muscleId] || muscleId}
                      <button
                        type="button"
                        onClick={() => removePrimaryMuscle(muscleId)}
                        className="ml-2 hover:bg-[#1e6bb8] rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm lg:text-base">
                  Secondary Muscles (Optional)
                </Label>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <div className="flex-1">
                    <Select
                      value={newSecondaryMuscle}
                      onValueChange={setNewSecondaryMuscle}
                    >
                      <SelectTrigger className="text-sm lg:text-base">
                        <SelectValue placeholder="Select muscle" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(availableMuscles).map(([id, name]) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    onClick={addSecondaryMuscle}
                    className="text-sm lg:text-base px-4 lg:px-6"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.secondaryMuscles.map((muscleId) => (
                    <Badge
                      key={muscleId}
                      variant="secondary"
                      className="text-sm lg:text-base px-2 lg:px-3 py-1"
                    >
                      {availableMuscles[muscleId] || muscleId}
                      <button
                        type="button"
                        onClick={() => removeSecondaryMuscle(muscleId)}
                        className="ml-2 hover:bg-gray-300 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <h3 className="text-lg lg:text-xl text-gray-900 mb-4 font-medium">
              Visibility
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4 sm:gap-0">
              <div>
                <Label
                  htmlFor="visibility"
                  className="cursor-pointer text-sm lg:text-base"
                >
                  Make this exercise public
                </Label>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">
                  Public exercises can be viewed and used by all users
                </p>
              </div>
              <Switch
                id="visibility"
                checked={formData.isPublic}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, isPublic: checked })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/exercises')}
              className="text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-3 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-3 order-1 sm:order-2"
              onClick={handleSubmit}
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : isEdit ? (
                'Update Exercise'
              ) : (
                'Create Exercise'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
