// eslint-disable-next-line no-unused-vars
import * as React from 'react'

import {
  BookOpen,
  Codesandbox,
  Bot,
  Frame,
  LayoutDashboard,
  BookOpenText,
  User,
  Map,
  PieChart,
  Settings2,
  Code
} from 'lucide-react'
import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { ModeToggle } from './mode-toggle'

// This is sample data.
const data = {
  user: {
    name: 'Lamnb',
    email: 'lamnbicoder.com',
    avatar: '/avatars/shadcn.jpg'
  },

  navMain: [
    {
      title: 'User',
      url: '#',
      icon: User,
      isActive: false,
      items: [
        {
          title: 'User Management',
          url: '/userList'
        },
        {
          title: 'TestUser',
          url: '#'
        }
      ]
    },
    {
      title: 'Course',
      url: '#',
      icon: BookOpenText,
      isActive: false,
      items: [
        {
          title: 'Course List',
          url: '/course-table'
        },
        {
          title: 'Create Course',
          url: '/create-course'
        }
      ]
    },
    {
      title: 'Problem',
      url: '/problem-table',
      icon: Code,
      items: [
        {
          title: 'Problem List',
          url: '/problem-table'
        },
        {
          title: 'Create Problem',
          url: '/create-problem'
        }
      ]
    },
    {
      title: 'Competitons',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#'
        },
        {
          title: 'Explorer',
          url: '#'
        },
        {
          title: 'Quantum',
          url: '#'
        }
      ]
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#'
        },
        {
          title: 'Get Started',
          url: '#'
        },
        {
          title: 'Tutorials',
          url: '#'
        },
        {
          title: 'Changelog',
          url: '#'
        }
      ]
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Team',
          url: '#'
        }
      ]
    }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame
    }
  ]
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Codesandbox className='size-4' />
                </div>
                <div className='grid flex-1 text-sm leading-tight text-left'>
                  <span className='font-semibold truncate'>ICODER</span>
                  <span className='text-xs truncate'>Technology</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
