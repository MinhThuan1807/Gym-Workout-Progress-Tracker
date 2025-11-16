'use client'

import { Toaster } from '@/components/ui/sonner'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar'
import { LayoutDashboard, Dumbbell, TrendingUp, BookOpen, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { getCurrentUserAPI, logoutUserAPI, selectCurrentUser, selectIsLoading } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const menuItems = [
  { href: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: 'workouts', label: 'Workouts', icon: Dumbbell },
  { href: 'progress', label: 'Progress', icon: TrendingUp },
  { href: 'exercises', label: 'Exercises', icon: BookOpen },
  { href: 'profile', label: 'Profile', icon: User },
]

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const params = useParams<{ tag: string }>();
    const user = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(selectIsLoading);

    // ✅ Fetch user data khi mount (nếu chưa có user)
    useEffect(() => {
      if (!user) {
        dispatch(getCurrentUserAPI());
      }
    }, [dispatch, user]);

    // Handle logout
    const handleLogout = async () => {
      try {
        // Đợi logout API complete
        await dispatch(logoutUserAPI()).unwrap();
        // Redirect về login page
        router.push('/user/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // Vẫn redirect về login dù có lỗi
        router.push('/user/login');
      }
    };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        {/* Sidebar */}
        <Sidebar className="border-r bg-white">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">FitTrack</h2>
                <p className="text-xs text-muted-foreground">Your Fitness Hub</p>
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
                    className="w-full rounded-xl"
                  >
                    <item.icon className="w-5 h-5 " />
                    <span className='cursor-pointer'>{item.label}</span>
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
                <div className="text-sm font-semibold truncate">{user?.displayName}</div>
                <div className="text-xs text-muted-foreground">{user?.role}</div>
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
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  )
}
