import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

export function AmountPopup({ amount, grossAmount, netAmount, feeAmount, pointsUsed }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' className='p-0 font-normal'>
          {amount}$
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Amount Details</h4>
            <p className='text-sm text-muted-foreground'>Breakdown of the transaction amount</p>
          </div>
          <div className='grid gap-2'>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium'>Gross Amount:</span>
              <span className='col-span-2'>{grossAmount.toFixed(2)}$</span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium'>Net Amount:</span>
              <span className='col-span-2'>{netAmount.toFixed(2)}$</span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium'>Fee Amount:</span>
              <span className='col-span-2'>{feeAmount.toFixed(2)}$</span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium'>Points Used:</span>
              <span className='col-span-2'>
                {pointsUsed} {pointsUsed <= 1 ? 'point' : 'points'}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
