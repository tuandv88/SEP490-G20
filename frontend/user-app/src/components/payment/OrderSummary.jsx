import React from 'react'
import { CreditCard, Lock } from 'lucide-react'

const OrderSummary = ({ summary }) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Summary</h2>
      <div className='space-y-4'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Original price:</span>
          <span className='font-medium'>${summary.originalPrice.toLocaleString()}</span>
        </div>
        <div className='flex justify-between text-red-600'>
          <span>Discount rate:</span>
          <span>${summary.discountRate.toLocaleString()}</span>
        </div>
        {summary.remainingPoints > 0 && (
          <div className='flex justify-between text-green-600'>
            <span>Remaining points:</span>
            <span>{summary.remainingPoints} points</span>
          </div>
        )}
        <div className='border-t pt-4 mt-4'>
          <div className='flex justify-between font-bold'>
            <span>Total:</span>
            <div className='text-right'>
              <span>${summary.total.toLocaleString()}</span>
              <div className='text-sm text-gray-500 font-normal'>({summary.itemCount} course)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
