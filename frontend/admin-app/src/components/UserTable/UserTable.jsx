import React, { useState, useEffect } from 'react'
import { DataTable } from './DataTable'
import { columns } from './columns'
import { getAllUsersDetail, getAllRoles } from '@/services/api/userApi'
import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

function UsersPage() {
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorMessage,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsersDetail,
    staleTime: 0,
    cacheTime: 0
  })

  const {
    data: roles,
    isLoading: rolesLoading,
    isError: rolesError,
    error: rolesErrorMessage
  } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles
  })
  if (usersLoading || rolesLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (usersError || rolesError) {
    return (
      <Alert variant='destructive'>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {usersErrorMessage?.message || rolesErrorMessage?.message || 'Có lỗi xảy ra, vui lòng thử lại.'}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='container mx-auto '>
      <h1 className='text-2xl font-bold mb-5'>User Management</h1>
      <DataTable columns={columns} data={users} roles={roles} onDataChange={refetch} />
    </div>
  )
}

export default UsersPage
