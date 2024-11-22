import React from 'react'
import PropTypes from 'prop-types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import MultiSelect from './MultiSelect'
import SelectedFilters from './SelectedFilters'

export default function CourseTableFilters({ table }) {
  const [resetKey, setResetKey] = React.useState(0)
  const [statusDropdownOpen, setStatusDropdownOpen] = React.useState(false)
  const [levelDropdownOpen, setLevelDropdownOpen] = React.useState(false)

  const hasActiveFilters = () => {
    return table.getState().columnFilters.length > 0
  }

  const resetFilters = () => {
    table.resetColumnFilters()
    setResetKey((prev) => prev + 1)
    setStatusDropdownOpen(false)
    setLevelDropdownOpen(false)
  }

  return (
    <>
      <div className='flex flex-wrap items-center gap-4 py-0'>
        <Input
          placeholder='Filter courses...'
          value={table.getColumn('title')?.getFilterValue() ?? ''}
          onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <MultiSelect
          options={['Draft', 'Published', 'Scheduled', 'Archived']}
          placeholder='Select Statuses'
          value={table.getColumn('courseStatus')?.getFilterValue() ?? []}
          onChange={(values) => table.getColumn('courseStatus')?.setFilterValue(values)}
          resetKey={resetKey}
          isOpen={statusDropdownOpen}
          setIsOpen={setStatusDropdownOpen}
        />
        <MultiSelect
          options={['Basic', 'Intermediate', 'Advanced', 'Expert']}
          placeholder='Select Levels'
          value={table.getColumn('courseLevel')?.getFilterValue() ?? []}
          onChange={(values) => table.getColumn('courseLevel')?.setFilterValue(values)}
          resetKey={resetKey}
          isOpen={levelDropdownOpen}
          setIsOpen={setLevelDropdownOpen}
        />
        {hasActiveFilters() && (
          <Button variant='outline' onClick={resetFilters}>
            Reset Filters
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='w-4 h-4 ml-2' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='mt-2 mb-4'>
        <SelectedFilters column='courseStatus' table={table} />
        <SelectedFilters column='courseLevel' table={table} />
      </div>
    </>
  )
}

CourseTableFilters.propTypes = {
  table: PropTypes.object.isRequired
}
