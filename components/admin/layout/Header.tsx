'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  LogOut,
  ChevronDown,
  User,
  Shield,
  Settings as SettingsIcon,
  Menu
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { logoutUserAPI, selectCurrentUser } from '@/store/slices/authSlice'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const currentUser = useAppSelector(selectCurrentUser)

  const handleLogout = async () => {
    const res = await dispatch(logoutUserAPI()).unwrap()
    toast.success(res.message)
    router.push('/user/login')
  }

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
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 lg:gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors outline-none">
              <Avatar className="w-8 h-8 lg:w-9 lg:h-9">
                <AvatarImage
                  src={
                    currentUser?.avatar ||
                    'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
                  }
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium">
                  {currentUser?.displayName}
                </div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push('/admin/profile')}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push('/admin/account')}
                className="cursor-pointer"
              >
                <Shield className="w-4 h-4 mr-2" />
                Account Security
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
  )
}
