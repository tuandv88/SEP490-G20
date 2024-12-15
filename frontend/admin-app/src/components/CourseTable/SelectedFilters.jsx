import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function SelectedFilters({ column, table }) {
  const selectedValues = table.getColumn(column)?.getFilterValue() ?? []

  if (selectedValues.length === 0) return null

  return (
    <div className='inline-flex gap-2 mr-2'>
      {selectedValues.map((value) => (
        <Badge key={value} variant='secondary' className='text-xs'>
          {value}
          <Button
            variant='ghost'
            size='sm'
            className='h-auto p-0 ml-1 text-xs'
            onClick={() => {
              const newValues = selectedValues.filter((v) => v !== value)
              table.getColumn(column)?.setFilterValue(newValues.length ? newValues : undefined)
            }}
          >
            ×
          </Button>
        </Badge>
      ))}
    </div>
  )
}

SelectedFilters.propTypes = {
  column: PropTypes.string.isRequired,
  table: PropTypes.object.isRequired
}
