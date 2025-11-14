'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '../shared/PageHeader'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip'
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal'
import {
  getAllExercisesAPI,
  getAllMuscleGroupsAPI,
  deleteExerciseAPI
} from '@/api'
import { toast } from 'sonner'
import { UploadVideoExerciseModal } from '../modals/UploadVideoExerciseModal'

export function Exercises() {
  const router = useRouter()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [muscleGroupsMap, setMuscleGroupsMap] = useState<
    Record<string, string>
  >({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [publicOnly, setPublicOnly] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean
    exercise: Exercise | null
  }>({
    open: false,
    exercise: null
  })
  const [uploadVideoModal, setUploadVideoModal] = useState<{
    open: boolean
    exercise: Exercise | null
  }>({
    open: false,
    exercise: null
  })

  // Fetch both exercises and muscle groups on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch exercises and muscle groups in parallel
        const [exercisesResponse, muscleGroupsResponse] = await Promise.all([
          getAllExercisesAPI(),
          getAllMuscleGroupsAPI()
        ])

        // Set exercises
        setExercises(exercisesResponse.data || [])

        // Create muscle groups map for quick lookup
        const muscleGroups = muscleGroupsResponse.data || []
        const muscleMap: Record<string, string> = {}
        muscleGroups.forEach((muscle: MuscleGroup) => {
          muscleMap[muscle._id!] = muscle.name
        })
        setMuscleGroupsMap(muscleMap)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load exercises data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get muscle name by ID using the map
  const getMuscleName = (muscleId: string): string => {
    return muscleGroupsMap[muscleId] || muscleId
  }

  // Filter exercises based on search and filters
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesType =
      typeFilter === 'all' ||
      exercise.type.toLowerCase() === typeFilter.toLowerCase()
    const matchesDifficulty =
      difficultyFilter === 'all' ||
      exercise.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    const matchesPublic = !publicOnly || exercise.isPublic

    return matchesSearch && matchesType && matchesDifficulty && matchesPublic
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 hover:bg-green-200'
      case 'intermediate':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-200'

      case 'advance':
        return 'bg-red-100 text-red-700 hover:bg-red-200'
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'strength':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      case 'cardio':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-200'
      case 'flexibility':
        return 'bg-pink-100 text-pink-700 hover:bg-pink-200'
      case 'mobility':
        return 'bg-teal-100 text-teal-700 hover:bg-teal-200'
      case 'calisthenics':
        return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  }

  const handleDeleteExercise = async (exercise: Exercise) => {
    try {
      await deleteExerciseAPI(exercise._id!)
      setExercises((prev) => prev.filter((ex) => ex._id !== exercise._id))
      setDeleteModal({ open: false, exercise: null })
      toast.success('Exercise deleted successfully')
    } catch (error) {
      console.error('Error deleting exercise:', error)
      toast.error('Failed to delete exercise')
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <PageHeader
          title="Exercises"
          breadcrumbs={[
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Exercises' }
          ]}
        />
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="p-4 lg:p-6">
        <PageHeader
          title="Exercises"
          breadcrumbs={[
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Exercises' }
          ]}
          action={
            <Button
              className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-3 lg:px-4"
              onClick={() => router.push('/admin/exercises/new')}
            >
              <Plus className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Create New</span>
              <span className="sm:hidden">New</span>
              <span className="hidden md:inline ml-1">Exercise</span>
            </Button>
          }
        />

        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="space-y-4">
            {/* Search and main filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={publicOnly}
                  onCheckedChange={setPublicOnly}
                  className="shrink-0"
                />
                <Label
                  className="cursor-pointer text-sm"
                  onClick={() => setPublicOnly(!publicOnly)}
                >
                  Public Only
                </Label>
              </div>
            </div>

            {/* Filter dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="mobility">Mobility</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="calisthenics">Calisthenics</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advance">Advance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredExercises.length} of {exercises.length} exercises
          </p>
        </div>

        {/* Exercise Grid */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl text-gray-900">No exercises found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or create a new exercise
              </p>
            </div>
            <Button
              onClick={() => router.push('/admin/exercises/new')}
              className="bg-[#2d8cf0] hover:bg-[#2577d4]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Exercise
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                {/* Mobile layout: vertical */}
                <div className="block lg:hidden">
                  <div className="w-full h-48 bg-gray-200">
                    <img
                      src={
                        exercise.mediaImageUrl || '/placeholder-exercise.jpg'
                      }
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          '/placeholder-exercise.jpg'
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900 flex-1 pr-2">
                        {exercise.name}
                      </h3>
                      {!exercise.isPublic && (
                        <Badge variant="outline" className="shrink-0">
                          Private
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className={getTypeColor(exercise.type)}>
                        {exercise.type}
                      </Badge>
                      <Badge
                        className={getDifficultyColor(exercise.difficulty)}
                      >
                        {exercise.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500 font-medium">
                          Primary:
                        </span>
                        {exercise.primaryMuscles
                          ?.slice(0, 3)
                          .map((muscleId) => (
                            <Tooltip key={muscleId}>
                              <TooltipTrigger asChild>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs cursor-help">
                                  {getMuscleName(muscleId)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Primary muscle: {getMuscleName(muscleId)}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        {(exercise.primaryMuscles?.length || 0) > 3 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs cursor-help">
                                +{(exercise.primaryMuscles?.length || 0) - 3}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {exercise.primaryMuscles
                                  ?.slice(3)
                                  .map((id) => getMuscleName(id))
                                  .join(', ')}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      {exercise.secondaryMuscles &&
                        exercise.secondaryMuscles.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-gray-500 font-medium">
                              Secondary:
                            </span>
                            {exercise.secondaryMuscles
                              ?.slice(0, 2)
                              .map((muscleId) => (
                                <Tooltip key={muscleId}>
                                  <TooltipTrigger asChild>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs border cursor-help">
                                      {getMuscleName(muscleId)}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Secondary muscle:{' '}
                                      {getMuscleName(muscleId)}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            {(exercise.secondaryMuscles?.length || 0) > 2 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs border cursor-help">
                                    +
                                    {(exercise.secondaryMuscles?.length || 0) -
                                      2}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {exercise.secondaryMuscles
                                      ?.slice(2)
                                      .map((id) => getMuscleName(id))
                                      .join(', ')}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          router.push(`/admin/exercises/edit/${exercise._id}`)
                        }
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          setUploadVideoModal({ open: true, exercise })
                        }
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Video
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        onClick={() => setDeleteModal({ open: true, exercise })}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Desktop layout: horizontal */}
                <div className="hidden lg:flex">
                  <div className="w-32 xl:w-40 h-32 xl:h-40 bg-gray-200 shrink-0">
                    <img
                      src={
                        exercise.mediaImageUrl || '/placeholder-exercise.jpg'
                      }
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          '/placeholder-exercise.jpg'
                      }}
                    />
                  </div>
                  <div className="flex-1 p-4 xl:p-5 flex flex-col min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg xl:text-xl text-gray-900 font-medium truncate pr-2">
                        {exercise.name}
                      </h3>
                      {!exercise.isPublic && (
                        <Badge variant="outline" className="shrink-0">
                          Private
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getTypeColor(exercise.type)}>
                        {exercise.type}
                      </Badge>
                      <Badge
                        className={getDifficultyColor(exercise.difficulty)}
                      >
                        {exercise.difficulty}
                      </Badge>
                    </div>

                    {/* Primary and Secondary Muscles for Desktop */}
                    <div className="space-y-2 mb-4">
                      {/* Primary Muscles */}
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500 font-medium mr-1">
                          Primary:
                        </span>

                        {exercise.primaryMuscles
                          ?.slice(0, 3)
                          .map((muscleId) => (
                            <Tooltip key={muscleId}>
                              <TooltipTrigger asChild>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs cursor-help">
                                  {getMuscleName(muscleId)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Primary muscle: {getMuscleName(muscleId)}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        {(exercise.primaryMuscles?.length || 0) > 3 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs cursor-help">
                                +{(exercise.primaryMuscles?.length || 0) - 3}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {exercise.primaryMuscles
                                  ?.slice(3)
                                  .map((id) => getMuscleName(id))
                                  .join(', ')}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>

                      {/* Secondary Muscles */}
                      {exercise.secondaryMuscles &&
                        exercise.secondaryMuscles.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-gray-500 font-medium mr-1">
                              Secondary:
                            </span>
                            {exercise.secondaryMuscles
                              ?.slice(0, 2)
                              .map((muscleId) => (
                                <Tooltip key={muscleId}>
                                  <TooltipTrigger asChild>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs border cursor-help">
                                      {getMuscleName(muscleId)}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Secondary muscle:{' '}
                                      {getMuscleName(muscleId)}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            {(exercise.secondaryMuscles?.length || 0) > 2 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs border cursor-help">
                                    +
                                    {(exercise.secondaryMuscles?.length || 0) -
                                      2}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {exercise.secondaryMuscles
                                      ?.slice(2)
                                      .map((id) => getMuscleName(id))
                                      .join(', ')}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        )}
                    </div>

                    <div className="mt-auto flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          router.push(`/admin/exercises/edit/${exercise._id}`)
                        }
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setUploadVideoModal({ open: true, exercise })
                        }
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Video
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteModal({ open: true, exercise })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteModal.exercise && (
          <DeleteConfirmModal
            open={deleteModal.open}
            onOpenChange={(open) => setDeleteModal({ open, exercise: null })}
            itemName={deleteModal.exercise.name}
            onConfirm={() => handleDeleteExercise(deleteModal.exercise!)}
            disLoading={false}
          />
        )}

        {uploadVideoModal.exercise && (
          <UploadVideoExerciseModal
            open={uploadVideoModal.open}
            onOpenChange={(open) =>
              setUploadVideoModal({ open, exercise: null })
            }
            itemName={uploadVideoModal.exercise.name}
            itemVideoUrl={uploadVideoModal.exercise.mediaVideoUrl!}
            itemId={uploadVideoModal.exercise._id!}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
