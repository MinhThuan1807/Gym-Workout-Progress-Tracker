import { BlogForm } from '@/components/admin/pages/BlogForm'

export const metadata = {
  title: 'Edit Blog Post | FitTrack Admin',
  description: 'Edit blog post'
}

export default function EditBlogPage({ params }: { params: { id: string } }) {
  return <BlogForm />
}
