'use client'

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/user/ui/sidebar'
import {
  LayoutDashboard,
  Dumbbell,
  TrendingUp,
  BookOpen,
  User,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/user/ui/button'
import { useParams, useRouter } from 'next/navigation'
import {
  getCurrentUserAPI,
  logoutUserAPI,
  selectCurrentUser,
  selectIsLoading
} from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/user/ui/avatar'
import Link from 'next/link'
import { toast } from 'sonner'


const menuItems = [
  { href: 'dashboard', label: 'Dashboard' },
  { href: 'workouts', label: 'Workouts' },
  { href: 'progress', label: 'Progress' },
  { href: 'exercises', label: 'Exercises' },
  { href: 'profile', label: 'Profile' }
]

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const params = useParams<{ tag: string }>()
  const user = useAppSelector(selectCurrentUser)
  const dispatch = useAppDispatch()
  // const isLoading = useAppSelector(selectIsLoading)

  // Fetch user data on mount (if user data is not available)
  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUserAPI())
    }
  }, [dispatch, user])

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await dispatch(logoutUserAPI()).unwrap()
      toast.success(res.message)
      router.push('/user/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still redirect to login even if error occurs
      router.push('/user/login')
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        {/* Sidebar */}
        <Sidebar className="border-r bg-white hidden md:flex">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <Link href="/">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
              </Link>
              <div>
                <h2 className="font-semibold">FitTrack</h2>
                <p className="text-xs text-muted-foreground">
                  Your Fitness Hub
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    onClick={() => router.push(`/${item.href}`)}
                    isActive={params.tag === item.href}
                    className={`w-full rounded-xl ${
                      params.tag === item.href ? 'font-bold' : ''
                    }`}
                  >
                    <span className="cursor-pointer">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">
                  {user?.displayName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.role}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Mobile Header */}
          <header className="md:hidden sticky top-0 z-40 w-full border-b bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Link href='/'>
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                </Link>
                <h2 className="font-semibold text-lg">FitTrack</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => {
                  const sheet = document.getElementById('mobile-menu-sheet')
                  if (sheet) {
                    sheet.click()
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </Button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>

        {/* Mobile Menu Sheet - Hidden trigger */}
        <input type="checkbox" id="mobile-menu-sheet" className="peer hidden" />
        <label
          htmlFor="mobile-menu-sheet"
          className="fixed inset-0 z-40 bg-black/50 peer-checked:block hidden md:hidden"
        ></label>
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 md:hidden flex flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold">FitTrack</h2>
                  <p className="text-xs text-muted-foreground">
                    Your Fitness Hub
                  </p>
                </div>
              </div>
              <label htmlFor="mobile-menu-sheet" className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </label>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <label
                  key={item.href}
                  htmlFor="mobile-menu-sheet"
                  className="block"
                >
                  <button
                    onClick={() => router.push(`/${item.href}`)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      params.tag === item.href
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                  </button>
                </label>
              ))}
            </nav>
          </div>

          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">
                  {user?.displayName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.role}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
