import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Toaster } from '@/components/ui/toaster'
import { Outlet, useNavigate } from '@tanstack/react-router'
import authServiceInstance from '@/oidc/AuthService'
import { useEffect, useState } from 'react'
import { Loading } from '@/components/ui/overlay'
import Unauthorized from '@/pages/Login/Unauthorized'

export default function Layout() {
  const navigate = useNavigate()
  const [isAuthorized, setIsAuthorized] = useState(null)

  useEffect(() => {
    let isMounted = true // Tránh cập nhật state khi component đã unmount

    authServiceInstance.getUser().then((user) => {
      if (!isMounted) return
      if (user && !user.expired) {
        // Kiểm tra vai trò
        const userRoles = user.profile.role || user.profile.roles || []
        if (Array.isArray(userRoles) ? userRoles.includes('admin') : userRoles === 'admin') {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
          navigate({ to: '/unauthorized' })
        }
      } else {
        setIsAuthorized(false)
        navigate({ to: '/' })
      }
    })

    return () => {
      isMounted = false
    }
  }, [navigate])

  if (isAuthorized === null) {
    return <Loading />
  }
  if (isAuthorized === false) {
    return <Unauthorized />
  }
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
