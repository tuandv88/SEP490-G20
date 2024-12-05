import React from 'react'
import DocumentList from '@/components/Document/DocumentList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageContainer } from '@/components/page-container'
import { DOCUMENT_AI_TABLE_PATH } from '@/routers/router'
export default function DocumentTable() {
  const breadcrumb = [
    {
      title: 'Document Management',
      href: DOCUMENT_AI_TABLE_PATH
    }
  ]
  return (
    <PageContainer breadcrumb={breadcrumb}>
      <div className='container mx-auto py-10 mt-0'>
        <h1 className='text-2xl font-bold'>AI Document Management</h1>
        <DocumentList />
      </div>
    </PageContainer>
  )
}
