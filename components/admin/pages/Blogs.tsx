"use client";

import React, { useState, useContext } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { RouterContext } from "@/app/admin/RouterContext";
import { PageHeader } from "../shared/PageHeader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Exercises for Building Muscle",
    description:
      "Learn the most effective compound movements to maximize your muscle growth and strength gains.",
    createdDate: "2024-10-15",
    updatedDate: "2024-10-20",
  },
  {
    id: 2,
    title: "The Complete Guide to Nutrition for Athletes",
    description:
      "Everything you need to know about fueling your body for optimal performance and recovery.",
    createdDate: "2024-10-10",
    updatedDate: "2024-10-18",
  },
  {
    id: 3,
    title: "How to Create an Effective Workout Plan",
    description:
      "Step-by-step guide to designing a personalized training program that fits your goals.",
    createdDate: "2024-10-05",
    updatedDate: "2024-10-05",
  },
  {
    id: 4,
    title: "Rest and Recovery: Why They Matter",
    description:
      "Understanding the importance of rest days and recovery techniques for long-term progress.",
    createdDate: "2024-09-28",
    updatedDate: "2024-10-12",
  },
  {
    id: 5,
    title: "Cardio vs Strength Training: Finding Balance",
    description:
      "How to combine cardiovascular exercise and resistance training for optimal fitness.",
    createdDate: "2024-09-20",
    updatedDate: "2024-09-20",
  },
];

export function Blogs() {
  const { navigate } = useContext(RouterContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    post: (typeof blogPosts)[0] | null;
  }>({
    open: false,
    post: null,
  });

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="Blog Posts"
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Blogs" },
        ]}
        action={
          <Button
            className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-3 lg:px-4"
            onClick={() => navigate("blogs-new")}
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
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 border-b border-gray-100 last:border-0"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">
                    {post.title}
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
                      onClick={() =>
                        navigate("blogs-edit", { id: post.id.toString() })
                      }
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
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-xs">
                    <div className="truncate font-medium">{post.title}</div>
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
                      <Button variant="ghost" size="sm" title="Preview">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate("blogs-edit", { id: post.id.toString() })
                        }
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
      </div>

      {deleteModal.post && (
        <DeleteConfirmModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open, post: null })}
          itemName={deleteModal.post.title}
          onConfirm={() => console.log("Delete post:", deleteModal.post)}
        />
      )}
    </div>
  );
}
