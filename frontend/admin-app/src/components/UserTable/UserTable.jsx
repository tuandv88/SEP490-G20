import React, { useState, useEffect } from 'react'
import { DataTable } from './DataTable'
import { columns } from './columns'
import { getAllUsersDetail } from '@/services/api/userApi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllUsersDetail(signal)
        if (!signal.aborted) {
          setUsers(data)
        }
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        } else {
          setError(error.response?.data?.message || error.message || 'Have an error, please try again')
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }
    fetchUsers()

    return () => {
      controller.abort()
    }
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='container mx-auto '>
      <h1 className='text-2xl font-bold mb-5'>User Management</h1>
      <DataTable columns={columns} data={users} />
    </div>
  )
}

export default UsersPage
