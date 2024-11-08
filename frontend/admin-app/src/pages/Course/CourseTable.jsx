import React from 'react'
import CourseTable from '@/components/CourseTable/index'
import { PageContainer } from '@/components/page-container'

const breadcrumbs = [{ label: 'CourseTable', href: '/course-table' }]
export default function CoursesPage() {
  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <CourseTable />
    </PageContainer>
  )
}
