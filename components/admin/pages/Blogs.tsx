'use client'

import React, { useState, useContext, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { PageHeader } from '../shared/PageHeader'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal'
import { getAllBlogsAPI, deleteBlogAPI } from '@/api'
import { toast } from 'sonner'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination'

export function Blogs() {
  const router = useRouter()
  const itemsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean
    post: Blog | null
  }>({
    open: false,
    post: null
  })

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const response = await getAllBlogsAPI()

      const formattedPosts = response.data.map((post: any) => ({
        id: post._id,
        name: post.name,
        description: post.description,
        createdDate: new Date(post.createdAt).toLocaleDateString(),
        updatedDate: post.updatedAt
          ? new Date(post.updatedAt).toLocaleDateString()
          : null
      }))

      // console.log(formattedPosts)

      setBlogPosts(formattedPosts || [])
    }

    fetchBlogPosts()
  }, [])

  // Pagination, Search, and Sorting can be added here
  const filteredBlogPosts = blogPosts.filter((post) => {
    const matchSearch =
      post?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post?.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchSearch
  })

  const totalPages = Math.ceil(filteredBlogPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBlogPosts = filteredBlogPosts.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleDeleteBlog = async (post: any) => {
    try {
      const res = await deleteBlogAPI(post.id)
      setBlogPosts((prev) => prev.filter((p) => p.id !== post.id))
      setDeleteModal({ open: false, post: null })
      toast.success(res.message)
    } catch (error) {
      console.error('Error deleting blog post:', error)
    }
  }

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="Blog Posts"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Blogs' }
        ]}
        action={
          <Button
            className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-3 lg:px-4"
            onClick={() => router.push('blogs/new')}
          >
            <Plus className="w-4 h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Create New</span>
            <span className="sm:hidden">New</span>
            <span className="hidden md:inline ml-1">Post</span>
          </Button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="block lg:hidden">
          {paginatedBlogPosts.map((post: any) => (
            <div
              key={post.id}
              className="p-4 border-b border-gray-100 last:border-0"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">
                    {post.name}
                  </h3>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {post.description}
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div>
                    <div>Created: {post.createdDate}</div>
                    <div>Updated: {post.updatedDate}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Preview"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => router.push(`blogs/edit/${post.id}`)}
                      title="Edit"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setDeleteModal({ open: true, post })}
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Updated Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBlogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-xs">
                    <div className="truncate font-medium">{post.name}</div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="text-gray-600 text-sm line-clamp-2">
                      {post.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {post.createdDate}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {post.updatedDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* <Button variant="ghost" size="sm" title="Preview">
                        <Eye className="w-4 h-4" />
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`blogs/edit/${post.id}`)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteModal({ open: true, post })}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {paginatedBlogPosts.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to{' '}
                {Math.min(endIndex, filteredBlogPosts.length)} of{' '}
                {filteredBlogPosts.length} blog posts
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                      size="default"
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                          size="default"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                      size="default"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>

      {deleteModal.post && (
        <DeleteConfirmModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open, post: null })}
          itemName={deleteModal.post.name}
          onConfirm={() => {
            handleDeleteBlog(deleteModal.post)
          }}
          disLoading={false}
        />
      )}
    </div>
  )
}
