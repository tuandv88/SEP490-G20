import React, { useState, useCallback } from 'react'
import { ResetIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './DataTableViewOptions'
import { statuses, paymentMethods } from './data'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Filter, FilterX, XCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export function DataTableToolbar({ table, onFiltersChange, onClearFilters }) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [localFilters, setLocalFilters] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    productName: '',
    isDescending: false,
    status: 'all',
    paymentMethod: 'all'
  })

  const clearAllFilters = useCallback(() => {
    setLocalFilters({
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      productName: '',
      isDescending: false,
      status: 'all',
      paymentMethod: 'all'
    })

    if (onClearFilters) {
      onClearFilters()
    }
  }, [onClearFilters])

  const handleFilterChange = useCallback((key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const handleApplyFilter = useCallback(() => {
    if (!onFiltersChange) return

    const processedFilters = {
      ...localFilters,
      startDate: localFilters.startDate || undefined,
      endDate: localFilters.endDate || undefined,
      minAmount: localFilters.minAmount ? Number(localFilters.minAmount) : undefined,
      maxAmount: localFilters.maxAmount ? Number(localFilters.maxAmount) : undefined,
      productName: localFilters.productName || undefined,
      status: localFilters.status === 'all' ? undefined : localFilters.status,
      paymentMethod: localFilters.paymentMethod === 'all' ? undefined : localFilters.paymentMethod
    }

    onFiltersChange(processedFilters)
  }, [localFilters, onFiltersChange])

  const hasAnyFilter =
    isFiltered || Object.values(localFilters).some((value) => value !== '' && value !== false && value !== 'all')

  const activeFilterCount = Object.values(localFilters).filter(
    (value) => value !== '' && value !== false && value !== 'all'
  ).length

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' size='sm' className='h-9'>
              <Filter className='mr-2 h-4 w-4' />
              Filter
              {activeFilterCount > 0 && (
                <Badge variant='secondary' className='ml-2 px-1 py-0'>
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[300px] sm:w-[400px]'>
            <div className='grid gap-4'>
              <div className='space-y-2'>
                <h4 className='font-medium leading-none'>Filters</h4>
                <p className='text-sm text-muted-foreground'>Customize your table view</p>
              </div>
              <Separator />
              <div className='grid gap-2'>
                <div className='flex flex-col space-y-1.5'>
                  <Label htmlFor='productName'>Product Name</Label>
                  <Input
                    id='productName'
                    placeholder='Search products...'
                    value={localFilters.productName}
                    onChange={(e) => handleFilterChange('productName', e.target.value)}
                  />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='status'>Status</Label>
                    <Select value={localFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                      <SelectTrigger id='status'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All</SelectItem>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='paymentMethod'>Payment Method</Label>
                    <Select
                      value={localFilters.paymentMethod}
                      onValueChange={(value) => handleFilterChange('paymentMethod', value)}
                    >
                      <SelectTrigger id='paymentMethod'>
                        <SelectValue placeholder='Select method' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All</SelectItem>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='startDate'>Start Date</Label>
                    <Input
                      id='startDate'
                      type='date'
                      value={localFilters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                  </div>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='endDate'>End Date</Label>
                    <Input
                      id='endDate'
                      type='date'
                      value={localFilters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='minAmount'>Min Amount</Label>
                    <Input
                      id='minAmount'
                      type='number'
                      value={localFilters.minAmount}
                      onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    />
                  </div>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='maxAmount'>Max Amount</Label>
                    <Input
                      id='maxAmount'
                      type='number'
                      value={localFilters.maxAmount}
                      onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    />
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='isDescending'
                    checked={localFilters.isDescending}
                    onCheckedChange={(checked) => handleFilterChange('isDescending', checked)}
                  />
                  <Label htmlFor='isDescending'>Descending Order</Label>
                </div>
              </div>
              <div className='flex justify-between'>
                <Button variant='outline' size='sm' onClick={clearAllFilters}>
                  <ResetIcon className='mr-2 h-4 w-4' />
                  Reset
                </Button>
                <Button size='sm' onClick={handleApplyFilter}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <DataTableViewOptions table={table} />
      </div>
      {hasAnyFilter && (
        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            {table.getFilteredRowModel().rows.length} of {table.getPreFilteredRowModel().rows.length} row(s) visible
          </p>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <p className='text-sm text-muted-foreground'>
              {table.getFilteredSelectedRowModel().rows.length} row(s) selected
            </p>
          )}
        </div>
      )}
    </div>
  )
}
