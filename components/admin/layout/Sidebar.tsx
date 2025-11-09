"use client";

import { useContext } from "react";
import {
  Home,
  Users,
  Dumbbell,
  FileText,
  Settings,
  Activity,
  X,
} from "lucide-react";
import { RouterContext } from "@/app/admin/RouterContext";
import { useRouter, usePathname } from "next/navigation";

const menuItems = [
  { icon: Home, label: "Dashboard", page: "dashboard" as const },
  { icon: Users, label: "User Management", page: "users" as const },
  { icon: Activity, label: "Muscle Groups", page: "muscle-groups" as const },
  { icon: Dumbbell, label: "Exercises", page: "exercises" as const },
  { icon: FileText, label: "Blogs", page: "blogs" as const },
  { icon: Settings, label: "Settings", page: "settings" as const },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  // const { currentPage, navigate } = useContext(RouterContext);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 
        w-60 bg-[#2c3e50] text-white flex flex-col 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-8 h-8 text-[#2d8cf0]" />
              <h1 className="text-xl">FitTrack Admin</h1>
            </div>
            {/* Close button for mobile */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-[#34495e] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // const isActive = currentPage === item.page;

            return (
              <button
                key={item.page}
                onClick={() => {
                  router.push(`/admin/${item.page}`);
                  // Close mobile sidebar after navigation
                  if (onClose && window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
                  pathname.includes(item.page)
                    ? "bg-[#2d8cf0] text-white"
                    : "text-gray-300 hover:bg-[#34495e] hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
