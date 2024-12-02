import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Toaster } from '@/components/ui/toaster'
import { Outlet, useNavigate } from '@tanstack/react-router'
import AuthService from '@/oidc/AuthService'
import { useEffect, useState } from 'react'

export default function Layout() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    AuthService.getUser().then((user) => {
      setUser(user)
    })
  }, [])

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
