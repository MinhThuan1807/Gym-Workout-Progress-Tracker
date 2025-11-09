import { UserManagement } from "@/components/admin/pages/UserManagement";

export const metadata = {
  title: "User Management | FitTrack Admin",
  description: "Manage users and permissions",
};

export default function UsersPage() {
  return <UserManagement />;
}
