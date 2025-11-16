"use client";

import { useEffect, useState } from "react";
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
import {
  getAllUsersAPI,
  updateUserAPI,
  deleteUserAPI,
  toggleUserStatusAPI,
} from "@/api";
import { toast } from "sonner";

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    user: null as any | null,
  });
  const [editModal, setEditModal] = useState({
    open: false,
    user: null as any | null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await getAllUsersAPI();
      setUsers(result.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      const result = await toggleUserStatusAPI(user._id);
      toast.success(result.message || "User status updated");
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isActive: !u.isActive } : u
        )
      );
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleUpdateUser = async (updatedUser: any) => {
    try {
      const updateData = {
        displayName: updatedUser.displayName,
        isActive: updatedUser.isActive,
        gender: updatedUser.gender || undefined,
        dateOfBirth: updatedUser.dateOfBirth || undefined,
        height: updatedUser.height ? Number(updatedUser.height) : undefined,
        weight: updatedUser.weight ? Number(updatedUser.weight) : undefined,
      };
      
      const result = await updateUserAPI(updatedUser._id, updateData);
      toast.success(result.message || "User updated successfully");
      
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? { ...u, ...result.data } : u))
      );
      setEditModal({ open: false, user: null });
    } catch (error: any) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;
    setIsLoading(true);
    try {
      const result = await deleteUserAPI(deleteModal.user._id);
      toast.success(result.message || "User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== deleteModal.user._id));
      setDeleteModal({ open: false, user: null });
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && user.isActive) ||
      (filter === "inactive" && !user.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExportUsers = () => {
    try {
      // Prepare CSV data
      const csvHeaders = ["Display Name", "Email", "Role", "Status", "Gender", "Date of Birth", "Height (cm)", "Weight (kg)", "Registration Date"];
      const csvRows = filteredUsers.map((user: any) => [
        user.displayName || "N/A",
        user.email,
        user.role,
        user.isActive ? "Active" : "Inactive",
        user.gender || "N/A",
        user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A",
        user.height || "N/A",
        user.weight || "N/A",
        new Date(user.createdAt).toLocaleDateString(),
      ]);

      // Create CSV content
      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${filteredUsers.length} users successfully`);
    } catch (error) {
      console.error("Failed to export users:", error);
      toast.error("Failed to export users");
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="User Management"
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "User Management" },
        ]}
        action={
          <Button 
            className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base px-3 lg:px-4"
            onClick={handleExportUsers}
          >
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
          {paginatedUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No users found
            </div>
          ) : (
            paginatedUsers.map((user: any) => (
              <div
                key={user._id}
                className="p-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12 shrink-0">
                    <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                    <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 truncate text-sm">
                          {user.displayName || "N/A"}
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
                            user.role === "admin"
                              ? "bg-[#2d8cf0] hover:bg-[#2577d4]"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {user.role}
                        </Badge>
                        <Switch 
                          checked={user.isActive} 
                          className="scale-90"
                          onCheckedChange={() => handleToggleStatus(user)}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user: any) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                        <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.displayName || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "admin"
                            ? "bg-[#2d8cf0] hover:bg-[#2577d4]"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={user.isActive}
                        onCheckedChange={() => handleToggleStatus(user)}
                      />
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      size="default"
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      size="default"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>

      {deleteModal.user && (
        <DeleteConfirmModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open, user: null })}
          itemName={deleteModal.user.displayName || deleteModal.user.email}
          onConfirm={handleDeleteUser}
          disLoading={isLoading}
        />
      )}

      {editModal.user && (
        <UserEditModal
          open={editModal.open}
          onOpenChange={(open) => setEditModal({ open, user: null })}
          user={editModal.user}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
}
