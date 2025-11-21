'use client'

import { useState, useContext, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '../shared/PageHeader'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import CustomEditor from '../shared/CustomEditor'
import { toast } from 'sonner'
import { createBlogAPI, getBlogByIdAPI, updateBlogAPI } from '@/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { FileUpload } from '../shared/FileUpload'

export function BlogForm() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const isEdit = !!id

  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    type: '',
    image: ''
  })

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await getBlogByIdAPI(id as string)
        setFormData({
          name: response.data.name || '',
          description: response.data.description || '',
          content: response.data.content || '',
          type: response.data.type || '',
          image: response.data.thumbnailUrl || ''
        })
      } catch (error) {
        console.error('Error fetching blog data:', error)
      }
    }

    if (isEdit) {
      fetchBlogData()
    }
  }, [isEdit, id])

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

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }
  // console.log(formData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formDataToSend = new FormData()

      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('type', formData.type)
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      let res: any
      if (isEdit) {
        // Update existing blog post
        res = await updateBlogAPI(id as string, formDataToSend)
      } else {
        // Create new blog post
        res = await createBlogAPI(formDataToSend)
      }

      toast.success(res.message)
      setFormData({
        name: '',
        description: '',
        content: '',
        type: '',
        image: ''
      })
      router.push('/admin/blogs')
    } catch (error) {
      console.error('Error submitting blog post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <PageHeader
        title={isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Blogs', path: '/admin/blogs' },
          { label: isEdit ? 'Edit Blog Post' : 'Create New Blog Post' }
        ]}
        action={
          <Button variant="outline" onClick={() => router.push('/admin/blogs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="mb-2" htmlFor="title">
              Post Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter an engaging title for your blog post..."
              className="text-2xl"
              required
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="description">
              Description / Excerpt
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Write a brief description or excerpt (shown in listings)..."
              rows={3}
            />
          </div>

          {/* Type */}
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
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="workout">Workout</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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

          <div>
            <Label className="mb-2" htmlFor="content">
              Content <span className="text-red-500">*</span>
            </Label>
            <CustomEditor
              data={formData.content}
              onChange={handleContentChange}
            />
            <p className="text-sm text-gray-500 mt-2">
              Use the rich text editor to format your content. You can add
              headings, lists, links, tables, and more.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/blogs')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#2d8cf0] hover:bg-[#2577d4]"
              disabled={isLoading}
            >
              {isEdit ? 'Update Post' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
