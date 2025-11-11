'use client'

import { useState, useEffect, useRef, useContext } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '../shared/PageHeader'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

export function BlogForm() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const isEdit = !!id
  const editorRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    title: isEdit ? '10 Essential Exercises for Building Muscle' : '',
    description: isEdit
      ? 'Learn the most effective compound movements to maximize your muscle growth and strength gains.'
      : '',
    content: isEdit
      ? '<h2>Introduction</h2><p>Building muscle requires a combination of proper exercise selection, progressive overload, and adequate nutrition. In this guide, we\'ll cover the 10 most essential exercises that should form the foundation of any muscle-building program.</p><h2>1. Barbell Squats</h2><p>The squat is often called the "king of exercises" for good reason. It targets your quadriceps, hamstrings, glutes, and core muscles.</p>'
      : ''
  })

  useEffect(() => {
    // Initialize CKEditor when component mounts
    if (typeof window !== 'undefined' && editorRef.current) {
      // In a real implementation, you would initialize CKEditor here
      // For this mockup, we'll simulate the editor with a contenteditable div
      const editor = editorRef.current
      editor.innerHTML = formData.content

      // Add event listener to update content
      editor.addEventListener('input', (e) => {
        setFormData({
          ...formData,
          content: (e.target as HTMLDivElement).innerHTML
        })
      })
    }
  }, [])

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
          <Button variant="outline" onClick={() => router.push('blogs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form className="space-y-6">
          <div>
            <Label htmlFor="title">
              Post Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter an engaging title for your blog post..."
              className="text-2xl"
            />
          </div>

          <div>
            <Label htmlFor="description">Description / Excerpt</Label>
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

          <div>
            <Label>
              Content <span className="text-red-500">*</span>
            </Label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#2d8cf0] focus-within:ring-1 focus-within:ring-[#2d8cf0] transition-colors">
              {/* CKEditor Toolbar Simulation */}
              <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                <button
                  type="button"
                  className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
                  title="Bold"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
                  title="Italic"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
                  title="Underline"
                >
                  <u>U</u>
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <select className="px-2 py-1 text-sm border-0 bg-transparent hover:bg-gray-200 rounded">
                  <option>Paragraph</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Heading 3</option>
                </select>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
                  title="Numbered List"
                >
                  1. List
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
                  title="Insert Link"
                >
                  🔗 Link
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
                  title="Insert Image"
                >
                  🖼️ Image
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
                  title="Insert Table"
                >
                  📋 Table
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
                  title="Code Block"
                >
                  {'</>'}
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
                  title="Undo"
                >
                  ↶
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
                  title="Redo"
                >
                  ↷
                </button>
              </div>

              {/* Editor Content Area */}
              <div
                ref={editorRef}
                contentEditable
                className="p-4 min-h-[600px] focus:outline-none prose max-w-none"
                style={{ wordWrap: 'break-word' }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Use the rich text editor to format your content. You can add
              headings, lists, images, tables, and more.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('blogs')}
            >
              Cancel
            </Button>
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="button" className="bg-[#2d8cf0] hover:bg-[#2577d4]">
              {isEdit ? 'Update Post' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
