'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/user/ui/card'
import { Input } from '@/components/user/ui/input'
import { Button } from '@/components/user/ui/button'
import {
  Search,
  Filter,
  Dumbbell,
  Heart,
  Users,
  Activity,
  Zap,
  X,
  Play
} from 'lucide-react'
import { Badge } from '@/components/user/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/user/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/user/ui/select'
import { ScrollArea } from '@/components/user/ui/scroll-area'
import Image from 'next/image'
import { AspectRatio } from '@/components/user/ui/aspect-ratio'
import { Suspense } from 'react'
import { SkeletonExercises } from '@/components/user/skeleton/SkeletonExcercises'
import { exerciseAPI } from '@/api/exercise'
import { muscleAPI } from '@/api/muscle'

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-[#10b981] text-white'
    case 'Intermediate':
      return 'bg-[#f59e0b] text-white'
    case 'Advanced':
      return 'bg-[#ef4444] text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Strength':
      return <Dumbbell className="w-3 h-3" />
    case 'Cardio':
      return <Heart className="w-3 h-3" />
    case 'Calisthenics':
      return <Users className="w-3 h-3" />
    case 'Mobility':
      return <Activity className="w-3 h-3" />
    case 'Flexibility':
      return <Zap className="w-3 h-3" />
    default:
      return null
  }
}

export default function ExercisesLibrary() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All')
  const [equipmentFilter, setEquipmentFilter] = useState('')
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cả exercises và muscle groups
        const [exercisesData, musclesData] = await Promise.all([
          exerciseAPI.getAll(),
          muscleAPI.getAll()
        ])

        console.log('Fetched exercises: ', exercisesData)
        console.log('Fetched muscles: ', musclesData)

        setExercises(exercisesData.data)
        setMuscleGroups(musclesData.data || musclesData)
      } catch (err) {
        console.log('error: ', err)
      }
    }
    fetchData()
  }, [])

  const getMuscleName = (muscleId: string) => {
    const muscle = muscleGroups.find((m) => m._id === muscleId)
    return muscle ? muscle.name : muscleId
  }
  const exerciseTypes = [
    'All',
    ...Array.from(new Set(exercises.map((ex) => ex.type)))
  ]
  const difficultyLevels = [
    'All',
    ...Array.from(new Set(exercises.map((ex) => ex.difficulty)))
  ]
  const muscleGroupOptions = [
    'All',
    ...Array.from(new Set(muscleGroups.map((m) => m.name)))
  ]

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'All' || exercise.type === selectedType
    const matchesDifficulty =
      selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty
    const matchesMuscleGroup =
      selectedMuscleGroup === 'All' ||
      (exercise.primaryMuscles &&
        exercise.primaryMuscles.some((muscleId) => {
          const muscle = muscleGroups.find((m) => m._id === muscleId)
          return muscle && muscle.name === selectedMuscleGroup
        })) ||
      (exercise.secondaryMuscles &&
        exercise.secondaryMuscles.some((muscleId) => {
          const muscle = muscleGroups.find((m) => m._id === muscleId)
          return muscle && muscle.name === selectedMuscleGroup
        }))
    const matchesEquipment =
      equipmentFilter === '' ||
      exercise.equipment.toLowerCase().includes(equipmentFilter.toLowerCase())
    return (
      matchesSearch &&
      matchesType &&
      matchesDifficulty &&
      matchesMuscleGroup &&
      matchesEquipment
    )
  })

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('All')
    setSelectedDifficulty('All')
    setSelectedMuscleGroup('All')
    setEquipmentFilter('')
  }

  const openExerciseDetail = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setIsDialogOpen(true)
  }

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedType !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedMuscleGroup !== 'All' ||
    equipmentFilter !== ''
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl">Exercise Library</h1>
        <p className="text-sm sm:text-base text-[#6b7280]">
          Browse and search exercises by type, difficulty, and muscle group
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-4 h-4 sm:w-5 sm:h-5" />
        <Input
          placeholder="Search exercises by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 sm:pl-11 rounded-2xl border-[#e5e7eb] bg-white h-10 sm:h-12 text-sm sm:text-base"
        />
      </div>

      {/* Filter Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-[#6b7280]" />
          <span className="text-xs sm:text-sm text-[#6b7280]">Filters</span>
        </div>

        {/* Type Filters */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm text-[#111827]">Type</label>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {exerciseTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={`rounded-xl shrink-0 text-xs sm:text-sm h-8 sm:h-9 ${
                    selectedType === type
                      ? 'bg-[#10b981] hover:bg-[#059669]'
                      : ''
                  }`}
                >
                  {type !== 'All' && getTypeIcon(type)}
                  <span className="ml-1">{type}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Difficulty Filters */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm text-[#111827]">
            Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            {difficultyLevels.map((level) => (
              <Button
                key={level}
                variant={selectedDifficulty === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(level)}
                className={`rounded-xl text-xs sm:text-sm h-8 sm:h-9 ${
                  selectedDifficulty === level
                    ? 'bg-[#10b981] hover:bg-[#059669]'
                    : ''
                }`}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Muscle Group & Equipment Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-[#111827]">
              Muscle Group
            </label>
            <Select
              value={selectedMuscleGroup}
              onValueChange={setSelectedMuscleGroup}
            >
              <SelectTrigger className="rounded-xl border-[#e5e7eb] bg-white h-10 sm:h-auto text-sm sm:text-base">
                <SelectValue placeholder="Select muscle group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All"></SelectItem>
                {muscleGroupOptions.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-[#111827]">
              Equipment
            </label>
            <div className="relative">
              <Input
                placeholder="Filter by equipment..."
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
                className="rounded-xl border-[#e5e7eb] bg-white h-10 sm:h-auto text-sm sm:text-base"
              />
              {equipmentFilter && (
                <button
                  onClick={() => setEquipmentFilter('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#111827]"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      {filteredExercises.length > 0 ? (
        <Suspense fallback={<SkeletonExercises />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredExercises.map((exercise) => (
              <Card
                key={exercise._id}
                className="rounded-2xl border-[#e5e7eb] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group bg-white"
                onClick={() => openExerciseDetail(exercise)}
              >
                <div className="relative">
                  <AspectRatio ratio={3 / 2}>
                    <Image
                      src={exercise.mediaImageUrl}
                      alt={exercise.name}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </AspectRatio>

                  {/* Difficulty Badge Overlay */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={`${getDifficultyColor(
                        exercise.difficulty
                      )} rounded-lg shadow-md px-2 py-1`}
                    >
                      {exercise.difficulty}
                    </Badge>
                  </div>

                  {/* View Details Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button className="bg-[#10b981] hover:bg-[#059669] rounded-xl">
                      View Details
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="text-[#111827]">{exercise.name}</h3>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="rounded-lg flex items-center gap-1 text-xs border-[#e5e7eb]"
                    >
                      {getTypeIcon(exercise.type)}
                      <span>{exercise.type}</span>
                    </Badge>
                    {exercise.mediaVideoUrl && (
                      <Badge
                        variant="outline"
                        className="rounded-lg flex items-center gap-1 text-xs border-[#e5e7eb] text-[#10b981]"
                      >
                        <Play className="w-3 h-3" />
                        <span>Video</span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-[#6b7280]">
                    <Dumbbell className="w-3 h-3" />
                    <span className="text-xs">{exercise.equipment}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {exercise.primaryMuscles &&
                      exercise.primaryMuscles.map((muscleId, index) => (
                        <Badge
                          key={index}
                          className="rounded-lg text-xs border-[#e5e7eb] text-white"
                        >
                          {getMuscleName(muscleId)}
                        </Badge>
                      ))}
                    {exercise.secondaryMuscles &&
                      exercise.secondaryMuscles.map((muscleId, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="rounded-lg text-xs border-[#e5e7eb] text-[#6b7280]"
                        >
                          {getMuscleName(muscleId)}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Suspense>
      ) : (
        // Empty State
        <div className="text-center py-12 sm:py-16 space-y-4 px-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-[#e5e7eb] rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-[#6b7280]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl text-[#111827]">
              No exercises found matching your filters
            </h3>
            <p className="text-sm sm:text-base text-[#6b7280]">
              Try adjusting your search criteria or clearing filters
            </p>
          </div>
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="rounded-xl border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-white text-sm sm:text-base"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Exercise Detail Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-4 sm:p-6">
          {selectedExercise && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <DialogTitle className="text-xl sm:text-2xl text-[#111827]">
                      {selectedExercise.name}
                    </DialogTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        className={`${getDifficultyColor(
                          selectedExercise.difficulty
                        )} rounded-lg text-xs sm:text-sm`}
                      >
                        {selectedExercise.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-lg flex items-center gap-1 border-[#e5e7eb] text-xs sm:text-sm"
                      >
                        {getTypeIcon(selectedExercise.type)}
                        <span>{selectedExercise.type}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Video Player or Image */}
              <div className="space-y-2">
                {selectedExercise.mediaVideoUrl ? (
                  <AspectRatio ratio={16 / 9}>
                    <video
                      className="w-full h-full rounded-xl sm:rounded-4xl"
                      controls
                      preload="none"
                    >
                      <source
                        src={selectedExercise.mediaVideoUrl}
                        type="video/mp4"
                      />
                      <track
                        src={selectedExercise.mediaVideoUrl}
                        kind="subtitles"
                        srcLang="en"
                        label="English"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </AspectRatio>
                ) : (
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={selectedExercise.mediaImageUrl}
                      alt={selectedExercise.name}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </AspectRatio>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2 p-3 sm:p-4 bg-[#e5e7eb]/30 rounded-xl">
                  <h4 className="text-xs sm:text-sm text-[#6b7280]">
                    Equipment Needed
                  </h4>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4 text-[#10b981]" />
                    <p className="text-sm sm:text-base text-[#111827]">
                      {selectedExercise.equipment}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 p-3 sm:p-4 bg-[#e5e7eb]/30 rounded-xl">
                  <h4 className="text-xs sm:text-sm text-[#6b7280]">
                    Primary Muscle
                  </h4>
                  {selectedExercise.primaryMuscles &&
                    selectedExercise.primaryMuscles.map((muscleId, index) => (
                      <Badge
                        key={index}
                        className="rounded-lg text-xs border-[#e5e7eb] text-white"
                      >
                        {getMuscleName(muscleId)}
                      </Badge>
                    ))}
                </div>
              </div>

              {selectedExercise.secondaryMuscles &&
                selectedExercise.secondaryMuscles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm text-[#6b7280]">
                      Secondary Muscles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.secondaryMuscles.map(
                        (muscleId, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="rounded-lg border-[#e5e7eb] text-[#6b7280] text-xs"
                          >
                            {getMuscleName(muscleId)}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm text-[#6b7280]">
                  Description
                </h4>
                <p className="text-sm sm:text-base text-[#111827] leading-relaxed">
                  {selectedExercise.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e5e7eb]">
                <Button
                  className="flex-1 bg-[#10b981] hover:bg-[#059669] rounded-xl text-sm sm:text-base h-10 sm:h-auto"
                  onClick={() => {
                    // Add to workout plan logic would go here
                    setIsDialogOpen(false)
                  }}
                >
                  <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Add to Workout Plan
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-xl text-sm sm:text-base h-10 sm:h-auto"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
