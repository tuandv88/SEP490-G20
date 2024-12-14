import React, { useState, useCallback } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './DataTableViewOptions'
import { statuses, paymentMethods } from './data'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FilterX, XCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    // Reset local state
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
    
    // Gọi hàm clear từ component cha
    if (onClearFilters) {
      onClearFilters()
    }
  }, [onClearFilters])

  // Prevent auto-filtering when component updates
  const handleFilterChange = useCallback((key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const handleApplyFilter = useCallback(() => {
    if (!onFiltersChange) return;
    
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

  const hasAnyFilter = isFiltered || Object.values(localFilters).some(value => value !== '' && value !== false)

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-4'>
        <div className='flex items-center space-x-2'>
          <Label>Status</Label>
          <Select
            value={localFilters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className='h-8 w-[150px]'>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center space-x-2'>
          <Label>Payment Method</Label>
          <Select
            value={localFilters.paymentMethod}
            onValueChange={(value) => handleFilterChange('paymentMethod', value)}
          >
            <SelectTrigger className='h-8 w-[150px]'>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {paymentMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center space-x-2'>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={localFilters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className='h-8 w-[150px]'
          />
        </div>

        <div className='flex items-center space-x-2'>
          <Label>End Date</Label>
          <Input
            type="date"
            value={localFilters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className='h-8 w-[150px]'
          />
        </div>

        <div className='flex items-center space-x-2'>
          <Label>Min Amount</Label>
          <Input
            type="number"
            value={localFilters.minAmount}
            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
            className='h-8 w-[100px]'
          />
        </div>

        <div className='flex items-center space-x-2'>
          <Label>Max Amount</Label>
          <Input
            type="number"
            value={localFilters.maxAmount}
            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
            className='h-8 w-[100px]'
          />
        </div>

        <div className='flex items-center space-x-2'>
          <Label>Product Name</Label>
          <Input
            type="text"
            value={localFilters.productName}
            onChange={(e) => handleFilterChange('productName', e.target.value)}
            className='h-8 w-[200px]'
            placeholder="Search product..."
          />
        </div>

        <div className='flex items-center space-x-2'>
          <Label>Descending</Label>
          <Switch
            checked={localFilters.isDescending}
            onCheckedChange={(checked) => handleFilterChange('isDescending', checked)}
          />
        </div>

        <Button 
          variant='default'
          onClick={handleApplyFilter}
          className='h-8'
        >
          <FilterX className='mr-2 h-4 w-4' />
          Filter
        </Button>

        {hasAnyFilter && (
          <Button 
            variant='destructive'
            onClick={clearAllFilters}
            className='h-8'
          >
            <XCircle className='mr-2 h-4 w-4' />
            Clear All Filters
          </Button>
        )}
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <p className='text-sm text-muted-foreground'>
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
              selected.
            </p>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
