import React from 'react'
import PropTypes from 'prop-types'
import { TableHeader, TableRow, TableHead } from '@/components/ui/table'
import { flexRender } from '@tanstack/react-table'

export default function CourseTableHeader({ table }) {
  return (
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
  )
}

CourseTableHeader.propTypes = {
  table: PropTypes.object.isRequired
}
