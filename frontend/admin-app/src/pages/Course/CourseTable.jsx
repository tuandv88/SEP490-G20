import React from 'react'
import { PageContainer } from '@/components/page-container'
import CourseTable from '@/components/CourseTable/CourseTable'

const breadcrumbs = [{ label: 'CourseTable', href: '/course-table' }]
export default function CoursesPage() {
  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <CourseTable />
    </PageContainer>
  )
}
