import React from 'react'
import { PageContainer } from '@/components/page-container'
import UserTable from '@/components/UserTable/UserTable'

const breadcrumbs = [{ label: 'UserTable', href: '/user-table' }]
export default function CoursesPage() {
  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <UserTable />
    </PageContainer>
  )
}
