import React, { useState, useEffect, useCallback } from 'react'
import { DataTable } from './DataTable'
import { columns } from './columns'
import { TRANSACTION_TABLE_PATH } from '@/routers/router'
import { PageContainer } from '@/components/page-container'
import { getTransactionsAudit } from '@/services/api/transactionApi'

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

  const handleFiltersChange = useCallback(
    (newFilters) => {
      setFilters(newFilters)
      fetchData({
        pageIndex: 0, // Reset về trang 1
        pageSize: pagination.pageSize,
        filters: newFilters
      })
    },
    [fetchData, pagination.pageSize]
  )

  const handlePaginationChange = useCallback(
    (newPagination) => {
      setPagination((prev) => ({
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize
      }))

      fetchData({
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
        filters
      })
    },
    [fetchData, filters]
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
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    </PageContainer>
  )
}
