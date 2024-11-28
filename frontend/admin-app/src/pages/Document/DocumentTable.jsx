import React from 'react'
import DocumentList from '@/components/Document/DocumentList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DocumentTable() {
  return (
    <div className='container mx-auto py-10'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>AI Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentList />
        </CardContent>
      </Card>
    </div>
  )
}
