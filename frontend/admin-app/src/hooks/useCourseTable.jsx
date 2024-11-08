import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
import { fakeCourses } from '@/utils/fakeCourses'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

export default function useCourseTable() {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const columns = [
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
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div className='pl-4 capitalize'>{row.getValue('title')}</div>
    },
    {
      accessorKey: 'timeEstimate',
      header: ({ column }) => (
        <div className='text-left'>
          <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='pl-0'>
            Time Estimate
            <ArrowUpDown className='w-4 h-4 ml-2' />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left'>{row.getValue('timeEstimate')} hours</div>
    },
    {
      accessorKey: 'scheduledPublishDate',
      header: ({ column }) => (
        <div className='text-left'>
          <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='pl-0'>
            Scheduled Publish Date
            <ArrowUpDown className='w-4 h-4 ml-2' />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left'>{row.getValue('scheduledPublishDate').toLocaleDateString()}</div>
    },
    {
      accessorKey: 'courseStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('courseStatus')
        return (
          <div className='text-left'>
            <Badge
              variant={
                status === 'Published'
                  ? 'default'
                  : status === 'Draft'
                    ? 'secondary'
                    : status === 'Scheduled'
                      ? 'outline'
                      : 'destructive'
              }
            >
              {status}
            </Badge>
          </div>
        )
      },
      filterFn: (row, id, filterValues) => {
        if (!filterValues || filterValues.length === 0) return true
        const value = row.getValue(id)
        return filterValues.includes(value)
      }
    },
    {
      accessorKey: 'courseLevel',
      header: 'Level',
      cell: ({ row }) => <div className='text-left'>{row.getValue('courseLevel')}</div>,
      filterFn: (row, id, filterValues) => {
        if (!filterValues || filterValues.length === 0) return true
        const value = row.getValue(id)
        return filterValues.includes(value)
      }
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <div className='text-right'>
          <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='pr-0'>
            Price (USD)
            <ArrowUpDown className='w-4 h-4 ml-2' />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('price'))
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(amount)
        return <div className='pr-4 text-right'>{formatted}</div>
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const course = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='w-8 h-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(course.id)}>
                Copy course ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View course details</DropdownMenuItem>
              <DropdownMenuItem>Edit course</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  const table = useReactTable({
    data: fakeCourses,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return { table }
}
