import React from 'react'
import { PageContainer } from '@/components/page-container'
import CourseTable from '@/components/CourseTable/CourseTable'
import { COURSE_TABLE_PATH } from '@/routers/router'

const breadcrumbs = [{ label: 'CourseTable', href: COURSE_TABLE_PATH }]
export default function CoursesPage() {
  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <CourseTable />
    </PageContainer>
  )
}
