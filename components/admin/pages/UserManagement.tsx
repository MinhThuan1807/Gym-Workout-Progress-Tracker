"use client";

import { useState } from "react";
import { Search, Download, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "../shared/PageHeader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";
import { UserEditModal } from "../modals/UserEditModal";

const users = [
  {
    id: 1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    displayName: "John Smith",
    email: "john.smith@example.com",
    role: "Member",
    status: true,
    registrationDate: "2024-01-15",
  },
  {
    id: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    displayName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Admin",
    status: true,
    registrationDate: "2024-02-20",
  },
  {
    id: 3,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    displayName: "Mike Wilson",
    email: "mike.wilson@example.com",
    role: "Member",
    status: false,
    registrationDate: "2024-03-10",
  },
  {
    id: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    displayName: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Member",
    status: true,
    registrationDate: "2024-04-05",
  },
  {
    id: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    displayName: "David Brown",
    email: "david.brown@example.com",
    role: "Member",
    status: true,
    registrationDate: "2024-05-12",
  },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    user: (typeof users)[0] | null;
  }>({
    open: false,
    user: null,
  });
  const [editModal, setEditModal] = useState<{
    open: boolean;
    user: (typeof users)[0] | null;
  }>({
    open: false,
    user: null,
  });

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="User Management"
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "User Management" },
        ]}
        action={
          <Button className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-3 lg:px-4">
            <Download className="w-4 h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Export</span>
            <span className="hidden md:inline ml-1">Users</span>
          </Button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="block lg:hidden">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-start space-x-3">
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 truncate text-sm">
                        {user.displayName}
                      </h3>
                      <p className="text-xs text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setEditModal({ open: true, user })}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setDeleteModal({ open: true, user })}
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs ${
                          user.role === "Admin"
                            ? "bg-[#2d8cf0] hover:bg-[#2577d4]"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {user.role}
                      </Badge>
                      <Switch checked={user.status} className="scale-90" />
                    </div>
                    <span className="text-xs text-gray-500">
                      {user.registrationDate}
                    </span>
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
                <TableHead>Avatar</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.displayName}
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.role === "Admin"
                          ? "bg-[#2d8cf0] hover:bg-[#2577d4]"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={user.status} />
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {user.registrationDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditModal({ open: true, user })}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteModal({ open: true, user })}
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

        <div className="p-4 border-t border-gray-200">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" size="default" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive size="default">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" size="default">
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" size="default">
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" size="default" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {deleteModal.user && (
        <DeleteConfirmModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open, user: null })}
          itemName={deleteModal.user.displayName}
          onConfirm={() => console.log("Delete user:", deleteModal.user)}
        />
      )}

      {editModal.user && (
        <UserEditModal
          open={editModal.open}
          onOpenChange={(open) => setEditModal({ open, user: null })}
          user={editModal.user}
          onSave={(updatedUser) => console.log("Update user:", updatedUser)}
        />
      )}
    </div>
  );
}
