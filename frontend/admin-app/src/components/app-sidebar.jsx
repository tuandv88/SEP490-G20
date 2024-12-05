// eslint-disable-next-line no-unused-vars
import AuthService from '@/oidc/AuthService'
import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  BookOpen,
  Codesandbox,
  Bot,
  Frame,
  LayoutDashboard,
  BookOpenText,
  User,
  Map,
  Code,
  CircleHelp,
  MessageSquareMore
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
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import {
  COURSE_TABLE_PATH,
  PROBLEM_TABLE_PATH,
  CREATE_COURSE_PATH,
  EDIT_CURRICULUM_COURSE_PATH,
  EDIT_BASIC_COURSE_PATH,
  CREATE_CODE_PROBLEM_PATH,
  CREATE_PROBLEM_PATH,
  CREATE_PROBLEM_LECTURE_PATH,
  QUIZ_MANAGEMENT_PATH,
  UPDATE_PROBLEM_PATH,
  UPDATE_PROBLEM_LECTURE_PATH,
  DOCUMENT_AI_TABLE_PATH,
  QUIZ_ASSESSMENT_PATH,
  USER_TABLE_PATH,
  USER_DETAIL_PATH,
  DISCUSSION_TABLE_PATH
} from '@/routers/router'

// This is sample data.

export function AppSidebar({ ...props }) {
  const [user, setUser] = useState({ profile: { email: '', urlImagePresigned: '' } })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await AuthService.getUser()
        setUser(fetchedUser)
      } catch (error) {
        console.error('Failed to get user:', error)
      }
    }

    fetchUser()
  }, [])

  const data = {
    user: {
      name: 'Hello admin',
      email: user.profile.email,
      avatar: user.profile.urlImagePresigned
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
            url: USER_TABLE_PATH
          }
          // {
          //   title: 'Role Management',
          //   url: '#'
          // }
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
            url: COURSE_TABLE_PATH
          },
          {
            title: 'Create Course',
            url: CREATE_COURSE_PATH
          }
        ]
      },
      {
        title: 'Problem',
        url: '#',
        icon: Code,
        items: [
          {
            title: 'Problem List',
            url: PROBLEM_TABLE_PATH
          },
          {
            title: 'Create Problem',
            url: CREATE_PROBLEM_PATH
          }
        ]
      },
      {
        title: 'Quiz',
        url: '#',
        icon: CircleHelp,
        items: [
          {
            title: 'Quiz Survey',
            url: QUIZ_ASSESSMENT_PATH
          }
        ]
      },
      {
        title: 'Document',
        url: '#',
        icon: BookOpen,
        items: [
          {
            title: 'For AI',
            url: DOCUMENT_AI_TABLE_PATH
          }
        ]
      },
      {
        title: 'Community',
        url: '#',
        icon: MessageSquareMore,
        items: [
          {
            title: 'Discussion',
            url: DISCUSSION_TABLE_PATH
          }
        ]
      }
    ]
  }

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link to=''>
                <div className='flex items-center'>
                  <div className='flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground'>
                    <Codesandbox className='size-4' />
                  </div>
                  <div className='grid flex-1 text-sm leading-tight text-left ml-4'>
                    <span className='font-semibold truncate'>ICODER</span>
                    <span className='text-xs truncate'>Technology</span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem></SidebarMenuItem>
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
