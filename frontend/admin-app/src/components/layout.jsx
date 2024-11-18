import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Toaster } from '@/components/ui/toaster'
import { Outlet } from '@tanstack/react-router'

export default function Layout() {
  return (
    <SidebarProvider>
      <div className={`flex w-full min-h-screen bg-background `}>
        <AppSidebar className='flex-shrink-0' />
        <main className='flex-1'>
          <Outlet />
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
