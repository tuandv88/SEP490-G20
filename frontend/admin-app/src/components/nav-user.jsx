/* eslint-disable react/prop-types */
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles, UserCog } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import AuthService from '@/oidc/AuthService'
export function NavUser({ user }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='w-8 h-8 rounded-lg'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-sm leading-tight text-left'>
                <span className='font-semibold truncate'>{user.name}</span>
                <span className='text-xs truncate'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='w-8 h-8 rounded-lg'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-sm leading-tight text-left'>
                  <span className='font-semibold truncate'>{user.name}</span>
                  <span className='text-xs truncate'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <a 
                href={`${import.meta.env.VITE_BASE_URL_AUTH}/Profile/Index`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <UserCog className="mr-2 h-4 w-4" />
                <span>Manage Profile</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => AuthService.logout()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
