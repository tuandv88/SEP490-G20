import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

export function PageContainer({
  children,
  breadcrumbs = [], // Array of { label: string, href?: string }
  className
}) {
  const { collapsed } = useSidebar()

  return (
    <SidebarInset className={`flex flex-col h-full ${className}`}>
      <header className='sticky top-0 z-10 flex items-center h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className={`flex items-center gap-4 px-4 ${collapsed ? 'ml-0' : ''}`}>
          <SidebarTrigger />
          <Separator orientation='vertical' className='h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={index}>
                  {index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink href={crumb.href} className='text-base'>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className='text-base'>{crumb.label}</BreadcrumbPage>
                  )}
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className='flex-1 p-6 overflow-auto text-base'>
        <div className='mx-auto max-w-[1600px]'>{children}</div>
      </div>
    </SidebarInset>
  )
}
