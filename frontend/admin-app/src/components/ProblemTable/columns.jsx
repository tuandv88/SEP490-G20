import { createColumnHelper } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from '@tanstack/react-router'
import { deleteProblemAg } from '@/services/api/problemApi'
import { UPDATE_PROBLEM_AG_PATH } from '@/routers/router'
const columnHelper = createColumnHelper()

export const columns = [
  columnHelper.display({
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
  }),
  columnHelper.accessor('title', {
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='font-bold'
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    }
  }),

  columnHelper.accessor('difficulty', {
    header: 'Difficulty',
    cell: ({ row }) => {
      const value = row.getValue('difficulty')
      return (
        <Badge variant={value === 'Easy' ? 'success' : value === 'Medium' ? 'warning' : 'destructive'}>{value}</Badge>
      )
    }
  }),
  columnHelper.accessor('acceptance', {
    header: 'Acceptance',
    cell: ({ row }) => {
      const value = row.getValue('acceptance')
      if (value === -1) {
        return <span className='text-muted-foreground'>No data</span>
      }
      return <Badge variant='secondary'>{value.toFixed(1)}%</Badge>
    }
  }),
  columnHelper.accessor('isActive', {
    header: 'Status',
    cell: ({ row }) => {
      const value = row.getValue('isActive')
      return <Badge variant={value ? 'success' : 'secondary'}>{value ? 'Active' : 'Inactive'}</Badge>
    }
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row, table }) => {
      const problem = row.original
      const navigate = useNavigate()
      const problemId = problem.problemsId
      const { handleShowDeleteDialog } = table.options.meta

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(problemId)}>
              Copy problem ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: UPDATE_PROBLEM_AG_PATH, params: { problemId } })}>
              Edit problem
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShowDeleteDialog(problemId)}>
              Delete problem
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  })
]
