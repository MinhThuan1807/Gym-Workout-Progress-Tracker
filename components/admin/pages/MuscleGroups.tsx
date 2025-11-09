"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, Activity } from "lucide-react";
import { PageHeader } from "../shared/PageHeader";
import { Button } from "../ui/button";
import { EmptyState } from "../shared/EmptyState";
import { MuscleGroupModal } from "../modals/MuscleGroupModal";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";

const muscleGroups = [
  {
    id: 1,
    name: "Chest",
    description: "Pectoralis major and minor muscles",
    image:
      "https://images.unsplash.com/photo-1750698544932-c7471990f1ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwd29ya291dHxlbnwxfHx8fDE3NjI0ODQxOTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    name: "Back",
    description: "Latissimus dorsi, trapezius, and rhomboids",
    image:
      "https://images.unsplash.com/photo-1725398753361-b867935f811e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNjdWxhciUyMGJvZHklMjBhbmF0b215fGVufDF8fHx8MTc2MjQ5NzI2NHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    name: "Shoulders",
    description: "Deltoid muscles (anterior, lateral, posterior)",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdW1iYmVsbCUyMHdlaWdodHN8ZW58MXx8fHwxNzYyNDk3MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    name: "Legs",
    description: "Quadriceps, hamstrings, glutes, and calves",
    image:
      "https://images.unsplash.com/photo-1737736193172-f3b87a760ad5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkaW8lMjBydW5uaW5nfGVufDF8fHx8MTc2MjM4MTEzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 5,
    name: "Arms",
    description: "Biceps, triceps, and forearms",
    image:
      "https://images.unsplash.com/photo-1630857539167-e68ecccf3854?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVyY2lzZSUyMHRyYWluaW5nfGVufDF8fHx8MTc2MjQ2NTU1OHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 6,
    name: "Core",
    description: "Abdominals and obliques",
    image:
      "https://images.unsplash.com/photo-1607909599990-e2c4778e546b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwc3RyZXRjaGluZ3xlbnwxfHx8fDE3NjI0MjE5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function MuscleGroups() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<
    (typeof muscleGroups)[0] | null
  >(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    group: (typeof muscleGroups)[0] | null;
  }>({
    open: false,
    group: null,
  });

  const handleEdit = (group: (typeof muscleGroups)[0]) => {
    setEditingGroup(group);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingGroup(null);
    setModalOpen(true);
  };

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="Muscle Groups"
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Muscle Groups" },
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

      {muscleGroups.length === 0 ? (
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
          {muscleGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-full object-cover"
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

      <MuscleGroupModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        muscleGroup={editingGroup}
        onSave={(data) => console.log("Save muscle group:", data)}
      />

      {deleteModal.group && (
        <DeleteConfirmModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open, group: null })}
          itemName={deleteModal.group.name}
          onConfirm={() =>
            console.log("Delete muscle group:", deleteModal.group)
          }
        />
      )}
    </div>
  );
}
