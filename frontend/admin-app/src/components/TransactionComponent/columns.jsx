import React from 'react'
import { DataTableColumnHeader } from './DataTableColumnHeader'
import { DataTableRowActions } from './DataTableRowActions'
import { Button } from '@/components/ui/button'
import { AmountPopup } from './AmountPopup'
import { Checkbox } from '@/components/ui/checkbox'

import { statuses, paymentMethods } from './data'

export const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'stt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='STT' />,
    cell: ({ row }) => <div className='w-[40px] text-center'>{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'fullname',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Customer' />,
    cell: ({ row, table }) => (
      <Button
        variant="link"
        className="p-0 h-auto font-normal"
        onClick={() => table.options.onUserSelect({
          id: row.original.userId,
          fullname: row.getValue('fullname')
        })}
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
      return <AmountPopup {...row.original} />
    },
    enableColumnFilter: true,
    meta: {
      filterType: 'amount'
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => <div className='capitalize'>{row.getValue('status')}</div>,
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
    accessorKey: 'productName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Product Name' />,
    cell: ({ row }) => <div>{row.original.items[0]?.productName || 'N/A'}</div>
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Quantity' />,
    cell: ({ row }) => <div>{row.original.items[0]?.quantity || 'N/A'}</div>
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
    cell: ({ row }) => <div>{new Date(row.getValue('createdAt')).toLocaleString()}</div>,
    enableColumnFilter: true,
    meta: {
      filterType: 'date'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]
