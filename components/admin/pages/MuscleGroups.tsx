'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Activity, Search } from 'lucide-react'
import { PageHeader } from '../shared/PageHeader'
import { Button } from '../ui/button'
import { EmptyState } from '../shared/EmptyState'
import { MuscleGroupModal } from '../modals/MuscleGroupModal'
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal'
import {
  getAllMuscleGroupsAPI,
  createMuscleGroupAPI,
  updateMuscleGroupAPI,
  deleteMuscleGroupAPI
} from '@/api'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination'

export function MuscleGroups() {
  const itemsPerPage = 8
  const [currentPage, setCurrentPage] = useState(1)
  const [muscleGroups, setMuscleGroups] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    group: null as any | null
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const result = await getAllMuscleGroupsAPI()
        setMuscleGroups(result.data || [])
      } catch (error) {
        console.error('Failed to fetch muscle groups:', error)
      }
    }
    fetchMuscleGroups()
  }, [])

  const filteredMuscleGroups = muscleGroups.filter((group) => {
    const matchSearch =
      group?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group?.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchSearch
  })

  const totalPages = Math.ceil(filteredMuscleGroups.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedMuscleGroups = filteredMuscleGroups.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleEdit = (group: any) => {
    setEditingGroup(group)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setEditingGroup(null)
    setModalOpen(true)
  }

  const handleSave = async (data: any) => {
    try {
      if (editingGroup) {
        // update existing
        const res = await updateMuscleGroupAPI(editingGroup._id, data)
        const updated = res.data
        toast.success(res.message)
        setMuscleGroups((prev) =>
          prev.map((g) => (g._id === updated._id ? updated : g))
        )
      } else {
        // create new

        const res = await createMuscleGroupAPI(data)
        const created = res.data
        toast.success(res.message)
        setMuscleGroups((prev) => [created, ...prev])
      }
      setModalOpen(false)
      setEditingGroup(null)
    } catch (error) {
      console.error('Failed to save muscle group:', error)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.group) return
    setIsLoading(true)
    try {
      const res = await deleteMuscleGroupAPI(deleteModal.group._id)
      toast.success(res.message)
      setMuscleGroups((prev) =>
        prev.filter((g) => g._id !== deleteModal.group._id)
      )
      setDeleteModal({ open: false, group: null })
    } catch (error) {
      console.error('Failed to delete muscle group:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="Muscle Groups"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Muscle Groups' }
        ]}
        action={
          <Button
            className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-3 lg:px-4"
            onClick={handleAdd}
          >
            <Plus className="w-4 h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Add New</span>
            <span className="sm:hidden">Add</span>
            <span className="hidden md:inline ml-1">Muscle Group</span>
          </Button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm p-1 mb-4 lg:mb-6">
        <div className="p-4 lg:p-6 border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search muscle groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {paginatedMuscleGroups.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm">
          <EmptyState
            icon={Activity}
            title="No muscle groups yet"
            description="Get started by creating your first muscle group to organize exercises."
            actionLabel="Add Muscle Group"
            onAction={handleAdd}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {paginatedMuscleGroups.map((group: any) => (
            <div
              key={group._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={group.imageUrl}
                  alt={group.name}
                  className="w-full h-full object-center bg-center"
                />
              </div>
              <div className="p-4 lg:p-5">
                <h3 className="text-lg lg:text-xl text-gray-900 mb-2 font-medium">
                  {group.name}
                </h3>
                <p className="text-gray-600 text-sm lg:text-base mb-4 line-clamp-2">
                  {group.description}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs lg:text-sm"
                    onClick={() => handleEdit(group)}
                  >
                    <Edit className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs lg:text-sm"
                    onClick={() => setDeleteModal({ open: true, group })}
                  >
                    <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {paginatedMuscleGroups.length > 0 && (
        <div className="p-4 ">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to{' '}
              {Math.min(endIndex, filteredMuscleGroups.length)} of{' '}
              {filteredMuscleGroups.length} muscle groups
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

      <MuscleGroupModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        muscleGroup={editingGroup}
        onSave={handleSave}
      />

      {deleteModal.group && (
        <DeleteConfirmModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open, group: null })}
          itemName={deleteModal.group.name}
          onConfirm={handleDeleteConfirm}
          disLoading={isLoading}
        />
      )}
    </div>
  )
}
