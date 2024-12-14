import React, { useEffect, useState } from 'react'
import { History } from 'lucide-react'
import TransactionTable from './TransactionTable'
import TransactionSkeleton from '../loading/TransactionSkeleton'
import { PaymentAPI } from '../../services/api/paymentApi'
import { Button } from '../ui/button'
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const TransactionHistory = () => {
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [transactionData, setTransactionData] = useState({
    totalPointUsed: 0,
    transactions: {
      data: [],
      count: 0
    }
  })

  const totalPages = Math.ceil(transactionData.transactions.count / pageSize)

  const fetchTransactions = async (page) => {
    try {
      setLoading(true)
      const response = await PaymentAPI.getTransactions(page, pageSize)
      setTransactionData(response)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions(currentPage)
  }, [currentPage])

  const handleTransactionCancelled = () => {
    fetchTransactions(currentPage)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading) {
    return <TransactionSkeleton />
  }

  return (
    <div className='min-h-screen py-8 px-4 sm:px-6 lg:px-8 !max-w-full'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              <History className='w-6 h-6 text-indigo-600' />
              <h2 className='text-xl font-semibold text-gray-800'>Course Transaction History</h2>
            </div>
            <p className='mt-1 text-sm text-gray-600'>
              View all your course purchase transactions and their current status
            </p>
          </div>

          <div className='px-6 py-4 bg-indigo-50'>
            <div className='flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4'>
              <div className='text-sm text-indigo-800'>
                <span className='font-medium'>Total Points Used:</span> {transactionData?.totalPointUsed || 0} points
              </div>
            </div>
          </div>

          <div className='p-6'>
            <TransactionTable 
              transactions={transactionData.transactions.data} 
              onTransactionCancelled={handleTransactionCancelled}
            />
          </div>

          <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
            <div className='flex justify-between items-center'>
              <p className='text-sm text-gray-600'>
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, transactionData.transactions.count)} of {transactionData.transactions.count} transactions
              </p>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index + 1}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory
