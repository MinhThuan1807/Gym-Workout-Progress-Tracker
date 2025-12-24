import { Card, CardContent } from '@/components/user/ui/card'
import { Badge } from '@/components/user/ui/badge'
import { Button } from '@/components/user/ui/button'
import { AspectRatio } from '@/components/user/ui/aspect-ratio'
import Image from 'next/image'
import { Play, Dumbbell } from 'lucide-react'

interface ExerciseCardProps {
  exercise: Exercise
  getMuscleName: (id: string) => string
  openExerciseDetail: (exercise: Exercise) => void
  getTypeIcon: (type: string) => React.ReactNode
  getDifficultyColor: (difficulty: string) => string
}

export function ExerciseCard({
  exercise,
  getMuscleName,
  openExerciseDetail,
  getTypeIcon,
  getDifficultyColor
}: ExerciseCardProps) {
  return (
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
        <div className="absolute top-3 right-3">
          <Badge
            className={`${getDifficultyColor(
              exercise.difficulty
            )} rounded-lg shadow-md px-2 py-1`}
          >
            {exercise.difficulty}
          </Badge>
        </div>
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
  )
}