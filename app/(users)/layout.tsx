'use client'

import { Toaster } from '@/components/ui/sonner'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar'
import { LayoutDashboard, Dumbbell, TrendingUp, BookOpen, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useParams, useRouter } from 'next/navigation'

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
                <AvatarImage src="https://images.unsplash.com/photo-1711006366881-5076ba350008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwcGVyc29ufGVufDF8fHx8MTc1OTQ5Mjk1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">John Doe</div>
                <div className="text-xs text-muted-foreground">Pro Member</div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start rounded-xl"
              onClick={() => router.push('/')}
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
