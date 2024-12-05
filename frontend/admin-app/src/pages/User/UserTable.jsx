import React from 'react'
import { PageContainer } from '@/components/page-container'
import UserTable from '@/components/UserTable/UserTable'
import { USER_TABLE_PATH } from '@/routers/router'
const breadcrumbs = [{ label: 'UserTable', href: USER_TABLE_PATH }]
export default function CoursesPage() {
  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <UserTable />
    </PageContainer>
  )
}
