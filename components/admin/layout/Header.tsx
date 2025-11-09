"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  ChevronDown,
  User,
  Shield,
  Settings as SettingsIcon,
  Menu,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";

const notifications = [
  {
    id: 1,
    title: "New user registered",
    message: "John Doe just signed up",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Exercise approved",
    message: "Bench Press has been published",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Blog post published",
    message: "Your post is now live",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: 4,
    title: "System update",
    message: "New features available",
    time: "1 day ago",
    unread: false,
  },
];

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  const [notifs, setNotifs] = useState(notifications);
  const unreadCount = notifs.filter((n) => n.unread).length;

  const handleLogout = () => {
    toast.success("Logged out successfully");
    // In a real app, this would clear auth tokens and redirect to login
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 1000);
  };

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 lg:block hidden">
          {/* This can be used for page-specific content */}
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[#2d8cf0] hover:text-[#2577d4]"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifs.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      notif.unread ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {notif.title}
                      </span>
                      {notif.unread && (
                        <span className="w-2 h-2 bg-[#2d8cf0] rounded-full mt-1 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-400">{notif.time}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 text-center">
                <button className="text-xs text-[#2d8cf0] hover:text-[#2577d4]">
                  View all notifications
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 lg:gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors outline-none">
              <Avatar className="w-8 h-8 lg:w-9 lg:h-9">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/admin/profile")}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/admin/account")}
                className="cursor-pointer"
              >
                <Shield className="w-4 h-4 mr-2" />
                Account Security
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/admin/settings")}
                className="cursor-pointer"
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
