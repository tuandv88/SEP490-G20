import React, { useState, useRef } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { PlusCircle } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { PROBLEM_TABLE_PATH, CREATE_PROBLEM_PATH } from '@/routers/router'
import { columns } from './columns'
import { deleteProblemAg, getProblemAg, getProblems } from '@/services/api/problemApi'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import { useToast } from '@/hooks/use-toast'

export default function ProblemsTable() {
  const { toast } = useToast()
  const search = useSearch({ from: PROBLEM_TABLE_PATH })
  const navigate = useNavigate()
  const pageFromUrl = React.useMemo(() => {
    try {
      return search.page ? parseInt(search.page) : 1
    } catch (error) {
      return 1
    }
  }, [search.page])
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [totalCount, setTotalCount] = React.useState(0)

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: pageFromUrl - 1,
    pageSize: 10
  })

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [problemToDelete, setProblemToDelete] = useState(null)
  const [isUpdate, setIsUpdate] = useState(false)

  const [inputValue, setInputValue] = useState('')
  const [searchString, setSearchString] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const debounceTimeout = useRef(null)

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  React.useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const params = {
          PageIndex: pagination.pageIndex + 1,
          PageSize: pagination.pageSize,
          SearchString: inputValue || undefined,
          DifficultyType: selectedDifficulty === 'all' ? undefined : selectedDifficulty
        }

        const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined))

        const queryString = new URLSearchParams(filteredParams).toString()
        const response = await getProblemAg(queryString)
        setData(response.problems.data)
        setTotalCount(response.problems.count)
      } catch (error) {
        setError('An error occurred while fetching data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      fetchData()
    }, 300)
  }, [pagination.pageIndex, pagination.pageSize, inputValue, selectedDifficulty, refreshTrigger])

  React.useEffect(() => {
    navigate(
      {
        search: (old) => ({
          ...old,
          page: pagination.pageIndex + 1
        })
      },
      { replace: true }
    )
  }, [pagination.pageIndex, navigate, isUpdate])

  const handleAddNewProblem = () => {
    navigate({ to: CREATE_PROBLEM_PATH })
  }

  const handleShowDeleteDialog = (problemId) => {
    setProblemToDelete(problemId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteProblem = async () => {
    try {
      await deleteProblemAg(problemToDelete)
      toast({
        title: 'Problem deleted',
        description: 'The problem has been deleted successfully.',
        variant: 'default',
        duration: 1500
      })
      setIsDeleteDialogOpen(false)
      triggerRefetch()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the problem.',
        variant: 'destructive',
        duration: 1500
      })
    }
  }

  const triggerRefetch = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    },
    manualPagination: true,
    meta: {
      handleShowDeleteDialog,
      triggerRefetch
    }
  })

  const isFiltered = table.getState().columnFilters.length > 0

  const clearFilters = React.useCallback(() => {
    table.resetColumnFilters()
  }, [table])

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableBody>
          {[...Array(pagination.pageSize)].map((_, index) => (
            <TableRow key={index}>
              {columns.map((column, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className='h-6 w-full' />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      )
    }

    if (error) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className='h-24 text-center'>
              Error: {error}
            </TableCell>
          </TableRow>
        </TableBody>
      )
    }

    return (
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className='h-24 text-center'>
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Problems</h2>
        <Button onClick={handleAddNewProblem} className='flex items-center gap-2'>
          <PlusCircle className='h-5 w-5' />
          Add New Problem
        </Button>
      </div>
      <div className='flex flex-col sm:flex-row items-center py-4 gap-2'>
        <Input
          placeholder='Filter titles...'
          value={inputValue}
          onChange={(event) => {
            const value = event.target.value
            setInputValue(value)
            table.setPageIndex(0)
          }}
          className='max-w-sm'
        />

        <Select
          value={selectedDifficulty}
          onValueChange={(value) => {
            setSelectedDifficulty(value)
            table.setPageIndex(0)
          }}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select difficulty' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='Easy'>Easy</SelectItem>
            <SelectItem value='Medium'>Medium</SelectItem>
            <SelectItem value='Hard'>Hard</SelectItem>
          </SelectContent>
        </Select>

        {(inputValue || selectedDifficulty !== 'all') && (
          <Button
            onClick={() => {
              setInputValue('')
              setSelectedDifficulty('all')
              table.setPageIndex(0)
            }}
            variant='outline'
            size='sm'
          >
            Clear Filters
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='font-bold'>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {renderTableContent()}
        </Table>
      </div>
      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {loading ? (
            <Skeleton className='h-4 w-[250px]' />
          ) : (
            `${table.getFilteredSelectedRowModel().rows.length} of ${totalCount} row(s) selected.`
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || loading}
          >
            Previous
          </Button>
          <div className='flex items-center'>
            <span className='flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground'>
              {loading ? <Skeleton className='h-4 w-4' /> : table.getState().pagination.pageIndex + 1}
            </span>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || loading}
          >
            Next
          </Button>
        </div>
      </div>
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteProblem}
        title='Delete Problem'
        description='Are you sure you want to delete this problem? This action cannot be undone.'
      />
    </div>
  )
}
