import { ExerciseForm } from '@/components/admin/pages/ExerciseForm'

export const metadata = {
  title: 'Edit Exercise | FitTrack Admin',
  description: 'Edit exercise details'
}

export default function EditExercisePage({
  params
}: {
  params: { id: string }
}) {
  return <ExerciseForm exerciseId={params.id} />
}
