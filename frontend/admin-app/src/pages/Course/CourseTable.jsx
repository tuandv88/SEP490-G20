import React from 'react'
import CourseTable from '@/components/CourseTable/CourseTableMain'
import { PageContainer } from '@/components/page-container'
import CoursesManagement from '@/components/CourseTable/CoursesManagement'

const breadcrumbs = [{ label: 'CourseTable', href: '/course-table' }]
export default function CoursesPage() {
  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <CoursesManagement />
    </PageContainer>
  )
}
