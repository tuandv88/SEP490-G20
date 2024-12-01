import React, { useState, useEffect, useCallback } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { MoreHorizontal, FileText, Search, ExternalLink, ChevronDown, Trash2, Loader2 } from 'lucide-react'
import { getDocuments, deleteDocuments } from '@/services/api/documentApi'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTablePagination } from './DataTablePagination'
import { DataTableViewOptions } from './DataTableViewOptions'
import { ImportDialog } from './ImportDialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Skeleton } from './skeleton'
import { useToast } from '@/hooks/use-toast'
import { useSearch } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { DOCUMENT_AI_TABLE_PATH } from '@/routers/router'

const TagsCell = ({ tags }) => {
  const [isOpen, setIsOpen] = useState(false)

  const generateTagItems = (tags) => {
    const mainTags = ['type', 'mime_type', 'learning']
    const primaryTags = {}
    const secondaryTags = {}

    Object.entries(tags).forEach(([key, value]) => {
      if (mainTags.includes(key)) {
        primaryTags[key] = value
      } else {
        secondaryTags[key] = value
      }
    })

    return { primaryTags, secondaryTags }
  }

  const formatTagLabel = (key) => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatTagValue = (value) => {
    return value.split('_').join(' ')
  }

  const { primaryTags, secondaryTags } = generateTagItems(tags)
  const hasSecondaryTags = Object.keys(secondaryTags).length > 0

  return (
    <div className='space-y-2 max-w-xl'>
      <div className='flex flex-wrap gap-2'>
        {Object.entries(primaryTags).map(([key, value]) => (
          <Badge
            key={key}
            variant='secondary'
            className='px-2 py-0.5 text-xs font-medium bg-secondary/50 hover:bg-secondary/60 transition-colors'
          >
            <span className='text-muted-foreground'>{formatTagLabel(key)}:</span>{' '}
            <span className='font-semibold'>{formatTagValue(value)}</span>
          </Badge>
        ))}
        {hasSecondaryTags && (
          <Badge variant='outline' className='px-2 py-0.5 text-xs font-medium hover:bg-accent cursor-pointer'>
            +{Object.keys(secondaryTags).length} more
          </Badge>
        )}
      </div>

      {hasSecondaryTags && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className='space-y-2'>
          <CollapsibleTrigger className='flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors'>
            <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isOpen ? 'rotate-180' : '')} />
            <span className='hover:underline'>{isOpen ? 'Hide' : 'Show'} all tags</span>
          </CollapsibleTrigger>
          <CollapsibleContent className='space-y-2'>
            <div className='flex flex-wrap gap-2 pt-2'>
              {Object.entries(secondaryTags).map(([key, value]) => (
                <Badge key={key} variant='outline' className='px-2 py-0.5 text-xs font-medium'>
                  <span className='text-muted-foreground'>{formatTagLabel(key)}:</span>{' '}
                  <span className='font-semibold truncate max-w-[200px]' title={value}>
                    {value}
                  </span>
                </Badge>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

export default function DocumentList() {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const search = useSearch({ from: DOCUMENT_AI_TABLE_PATH })
  const navigate = useNavigate()
  const pageIndex = search.page ? parseInt(search.page) - 1 : 0
  const pageSize = search.pageSize ? parseInt(search.pageSize) : 10

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await getDocuments(pageIndex + 1, pageSize)
      setData(response.documents.data)
      setPageCount(Math.ceil(response.documents.count / pageSize))
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pageIndex, pageSize])

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
      accessorKey: 'index',
      header: () => <div className='text-left'>Index</div>,
      cell: ({ row }) => <div className='text-left font-medium'>{row.getValue('index')}</div>
    },
    {
      accessorKey: 'fileName',
      header: () => <div className='text-left'>File Name</div>,
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <FileText className='h-4 w-4 text-muted-foreground flex-shrink-0' />
          <span className='font-medium truncate'>{row.getValue('fileName')}</span>
        </div>
      )
    },
    {
      accessorKey: 'tags',
      header: () => <div className='text-left'>Tags</div>,
      cell: ({ row }) => <TagsCell tags={row.getValue('tags')} />
    },
    {
      accessorKey: 'mimeType',
      header: () => <div className='text-left'>Type</div>,
      cell: ({ row }) => <div className='text-left font-medium'>{row.getValue('mimeType')}</div>
    },
    {
      accessorKey: 'fileSize',
      header: () => <div className='text-right'>File Size</div>,
      cell: ({ row }) => {
        const size = parseFloat(row.getValue('fileSize'))
        const formatted = size === -1 ? 'Unknown' : `${size.toLocaleString()} bytes`
        return <div className='text-right font-medium text-muted-foreground'>{formatted}</div>
      }
    },
    {
      accessorKey: 'url',
      header: () => <div className='text-center'>URL</div>,
      cell: ({ row }) => {
        const url = row.getValue('url')
        return url ? (
          <div className='text-center'>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 text-primary hover:text-primary/90 hover:underline'
            >
              <span>Link</span>
              <ExternalLink className='h-3.5 w-3.5' />
            </a>
          </div>
        ) : (
          <div className='text-center text-muted-foreground'>-</div>
        )
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const document = row.original
        const isLearningDocument = document.tags && document.tags.learning

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(document.id)}>
                Copy document ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View document details</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteDocument(document.id)}
                disabled={isDeleting || isLearningDocument}
              >
                {isLearningDocument ? 'Protected document' : isDeleting ? 'Deleting...' : 'Delete document'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex, pageSize }
    },
    enableRowSelection: (row) => {
      const selectedCount = Object.keys(rowSelection).length
      return selectedCount < 4 || row.getIsSelected()
    },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({ pageIndex, pageSize })
        navigate({
          search: (prev) => ({
            ...prev,
            page: newPagination.pageIndex + 1,
            pageSize: newPagination.pageSize
          })
        })
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true
  })

  const handleDeleteSelected = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedIds = selectedRows.map((row) => row.original.id)

    if (selectedIds.length === 0) {
      toast({
        title: 'No documents selected',
        description: 'Please select at least one document to delete.',
        variant: 'destructive'
      })
      return
    }

    if (selectedIds.length > 4) {
      toast({
        title: 'Too many documents selected',
        description: 'You can delete up to 4 documents at once.',
        variant: 'destructive'
      })
      return
    }

    const documentsToDelete = selectedRows.filter((row) => !row.original.tags || !row.original.tags.learning)
    const protectedDocuments = selectedRows.length - documentsToDelete.length

    if (documentsToDelete.length === 0) {
      toast({
        title: 'Cannot delete selected documents',
        description: 'All selected documents are protected and cannot be deleted.',
        variant: 'destructive'
      })
      return
    }

    setIsDeleting(true)
    try {
      await deleteDocuments(documentsToDelete.map((row) => row.original.id))
      toast({
        title: 'Documents deleted',
        description: `Successfully deleted ${documentsToDelete.length} document(s). ${protectedDocuments > 0 ? `${protectedDocuments} protected document(s) were not deleted.` : ''}`
      })
      await fetchData()
      setRowSelection({})
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while deleting documents.',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteDocument = async (documentId) => {
    const documentToDelete = data.find((doc) => doc.id === documentId)
    if (documentToDelete && documentToDelete.tags && documentToDelete.tags.learning) {
      toast({
        title: 'Cannot delete document',
        description: 'This document is protected and cannot be deleted.',
        variant: 'destructive'
      })
      return
    }

    setIsDeleting(true)
    try {
      await deleteDocuments([documentId])
      toast({
        title: 'Document deleted',
        description: 'Successfully deleted the document.'
      })
      await fetchData()
      setRowSelection({})
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while deleting the document.',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    if (Object.keys(rowSelection).length > 4) {
      setRowSelection({})
    }
  }, [rowSelection])

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Search className='h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Filter file names...'
            value={table.getColumn('fileName')?.getFilterValue() ?? ''}
            onChange={(event) => table.getColumn('fileName')?.setFilterValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        </div>
        <div className='flex items-center space-x-2'>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant='destructive'
              size='sm'
              onClick={handleDeleteSelected}
              className='h-8 px-2 lg:px-3'
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete {table.getFilteredSelectedRowModel().rows.length} (max 4)
                </>
              )}
            </Button>
          )}
          <ImportDialog />
        </div>
      </div>
      <div className='rounded-md border'>
        <Table className='[&_th]:px-4 [&_td]:px-4'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className='h-6 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
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
        </Table>
      </div>
      <div className='flex items-center justify-between'>
        <DataTableViewOptions table={table} />
        <DataTablePagination
          table={table}
          setPageIndex={(newPageIndex) => {
            navigate({
              search: (prev) => ({ ...prev, page: newPageIndex + 1 })
            })
          }}
          setPageSize={(newPageSize) => {
            navigate({
              search: (prev) => ({ ...prev, pageSize: newPageSize, page: 1 })
            })
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
