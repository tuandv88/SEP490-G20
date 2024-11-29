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
          // Kiểm tra xem request có bị hủy không
          setUsers(data)
        }
      } catch (error) {
        // Không set error nếu request bị hủy
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
          console.log('Request was canceled', error)
        } else {
          setError(error.response?.data?.message || error.message || 'Có lỗi xảy ra, vui lòng thử lại')
        }
      } finally {
        if (!signal.aborted) {
          // Chỉ set loading false nếu request không bị hủy
          setLoading(false)
        }
      }
    }

    fetchUsers()

    return () => {
      controller.abort() // Hủy request khi component unmount
    }
  }, [])

  // ... phần code render giữ nguyên
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
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-5'>User Management</h1>
      <DataTable columns={columns} data={users} />
    </div>
  )
}

export default UsersPage
