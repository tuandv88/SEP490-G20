import React, { useState, useEffect, useCallback } from 'react'
import { DataTable } from './DataTable'
import { columns } from './columns'
import { TRANSACTION_TABLE_PATH } from '@/routers/router'
import { PageContainer } from '@/components/page-container'
import { getTransactionsAudit } from '@/services/api/transactionApi'
import { Button } from '@/components/ui/button'

export function TransactionsTable() {
  const breadcrumbs = [{ label: 'Transaction Table', href: TRANSACTION_TABLE_PATH }]
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0
  })
  const [selectedUser, setSelectedUser] = useState(null)
  const [columnFilters, setColumnFilters] = useState({
    status: null,
    paymentMethod: null
  })

  const fetchData = useCallback(async ({ pageIndex, pageSize, filters = {} }) => {
    setIsLoading(true)
    try {
      const response = await getTransactionsAudit(pageIndex + 1, pageSize, filters)
      if (response?.transactions) {
        setData(response.transactions.data || [])
        setPagination((prev) => ({
          ...prev,
          pageIndex: pageIndex,
          pageSize: pageSize,
          totalCount: response.transactions.count
        }))
      }
    } catch (err) {
      console.error('API Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearFilters = useCallback(async () => {
    setIsLoading(true)
    try {
      setFilters({})
      setColumnFilters({
        status: null,
        paymentMethod: null
      })
      setSelectedUser(null)
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0
      }))

      await fetchData({
        pageIndex: 0,
        pageSize: pagination.pageSize,
        filters: {}
      })
    } catch (error) {
      console.error('Error clearing filters:', error)
    } finally {
      setIsLoading(false)
    }
  }, [pagination.pageSize, fetchData])

  const handleFiltersChange = useCallback(
    async (newFilters) => {
      setIsLoading(true)
      try {
        const combinedFilters = {
          ...filters,
          ...newFilters,
          status: newFilters.status === 'all' ? undefined : newFilters.status,
          paymentMethod: newFilters.paymentMethod === 'all' ? undefined : newFilters.paymentMethod
        }

        setFilters(combinedFilters)
        await fetchData({
          pageIndex: 0,
          pageSize: pagination.pageSize,
          filters: combinedFilters
        })
      } catch (error) {
        console.error('Error applying filters:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [fetchData, pagination.pageSize, filters]
  )

  const handleColumnFiltersChange = useCallback(
    async (column, value) => {
      setIsLoading(true)
      try {
        const newFilters = {
          ...columnFilters,
          [column]: value
        }
        setColumnFilters(newFilters)

        const combinedFilters = {
          ...filters,
          ...newFilters
        }

        await fetchData({
          pageIndex: 0,
          pageSize: pagination.pageSize,
          filters: combinedFilters
        })
      } catch (error) {
        console.error('Error changing column filters:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [filters, pagination.pageSize, fetchData, columnFilters]
  )

  const handlePaginationChange = useCallback(
    async (newPagination) => {
      setIsLoading(true)
      try {
        setPagination((prev) => ({
          ...prev,
          pageIndex: newPagination.pageIndex,
          pageSize: newPagination.pageSize
        }))

        await fetchData({
          pageIndex: newPagination.pageIndex,
          pageSize: newPagination.pageSize,
          filters
        })
      } catch (error) {
        console.error('Error changing pagination:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [fetchData, filters]
  )

  const handleUserSelect = useCallback(
    async (user) => {
      setIsLoading(true)
      try {
        setSelectedUser(user)
        const newFilters = {
          ...filters,
          userId: user.id
        }
        setFilters(newFilters)
        await fetchData({
          pageIndex: 0,
          pageSize: pagination.pageSize,
          filters: newFilters
        })
      } catch (error) {
        console.error('Error selecting user:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [filters, pagination.pageSize, fetchData]
  )

  useEffect(() => {
    fetchData({
      pageIndex: 0,
      pageSize: pagination.pageSize,
      filters
    })
  }, [])

  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <div className='container mx-auto py-10'>
        <h1 className='text-2xl font-bold'>Transaction Table</h1>
        {selectedUser && (
          <div className='mb-4 p-2 bg-blue-50 rounded-md flex justify-between items-center'>
            <span>User: {`${selectedUser.fullname} - (${selectedUser.id})`} </span>
            <Button
              variant='ghost'
              onClick={() => {
                setSelectedUser(null)
                handleFiltersChange({ ...filters, userId: null })
              }}
            >
              Clear filter
            </Button>
          </div>
        )}
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          onFiltersChange={handleFiltersChange}
          onColumnFiltersChange={handleColumnFiltersChange}
          onUserSelect={handleUserSelect}
          onClearFilters={clearFilters}
        />
      </div>
    </PageContainer>
  )
}
