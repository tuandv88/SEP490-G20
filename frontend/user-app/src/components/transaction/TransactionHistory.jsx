import React, { useEffect, useState } from 'react'
import { History } from 'lucide-react'
import TransactionTable from './TransactionTable'
import { transactions } from './mockTransactions'
import TransactionSkeleton from '../loading/TransactionSkeleton'

const TransactionHistory = () => {
  const totalPointsUsed = transactions.reduce((sum, t) => sum + t.pointsUsed, 0)
  const totalPointsValue = transactions.reduce((sum, t) => sum + t.pointsValue, 0)

  const [loading, setLoading] = useState(true)
  // const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        //const response = await paymentApi.getTransactions(1, 20)
        //console.log(response)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setLoading(true)
      }
    }
    fetchTransactions()
  }, [])

  if (loading) {
    return <TransactionSkeleton />
  }

  return (
    <div className='min-h-screen py-8 px-4 sm:px-6 lg:px-8'>
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
                <span className='font-medium'>Total Points Used:</span> {totalPointsUsed} points
              </div>
              <div className='text-sm text-indigo-800'>
                <span className='font-medium'>Total Points Value:</span> ${totalPointsValue.toFixed(2)}
              </div>
            </div>
          </div>

          <div className='p-6'>
            <TransactionTable transactions={transactions} />
          </div>

          <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
            <p className='text-sm text-gray-600'>Showing {transactions.length} transactions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory
