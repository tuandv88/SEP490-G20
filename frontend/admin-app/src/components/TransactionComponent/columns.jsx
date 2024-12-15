import React from 'react'
import { DataTableColumnHeader } from './DataTableColumnHeader'
import { DataTableRowActions } from './DataTableRowActions'
import { Button } from '@/components/ui/button'
import { AmountPopup } from './AmountPopup'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { statuses, paymentMethods } from './data'

export const columns = [
  {
    accessorKey: 'fullname',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Customer' />,
    cell: ({ row, table }) => (
      <Button
        variant='link'
        className='p-0 h-auto font-medium'
        onClick={() =>
          table.options.onUserSelect({
            id: row.original.userId,
            fullname: row.getValue('fullname')
          })
        }
      >
        {row.getValue('fullname')}
      </Button>
    )
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Amount' />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formattedAmount = `${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)}`
      return <AmountPopup {...row.original}>{formattedAmount}</AmountPopup>
    },
    enableColumnFilter: true,
    meta: {
      filterType: 'amount'
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.getValue('status')
      return (
        <Badge
          variant={
            status.toLowerCase() === 'completed'
              ? 'success'
              : status.toLowerCase() === 'processing'
                ? 'warning'
                : 'default'
          }
        >
          {status}
        </Badge>
      )
    },
    enableColumnFilter: true,
    filterFn: 'arrIncludesSome',
    meta: {
      filterType: 'select',
      filterOptions: statuses
    }
  },
  {
    accessorKey: 'paymentMethod',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Payment Method' />,
    cell: ({ row }) => <div className='capitalize'>{row.getValue('paymentMethod')}</div>,
    enableColumnFilter: true,
    filterFn: 'arrIncludesSome',
    meta: {
      filterType: 'select',
      filterOptions: paymentMethods
    }
  },
  {
    accessorKey: 'items',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Products' />,
    cell: ({ row }) => {
      const items = row.original.items
      return (
        <div>
          {items.map((item, index) => (
            <div key={index} className='text-sm'>
              <span className='font-medium'>{item.productName}</span>
              <span className='text-muted-foreground ml-2'>x{item.quantity}</span>
            </div>
          ))}
        </div>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return (
        <div>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      )
    },
    enableColumnFilter: true,
    meta: {
      filterType: 'date'
    }
  }
]
