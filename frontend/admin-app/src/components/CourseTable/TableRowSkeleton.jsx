import { TableCell, TableRow } from '@/components/ui/table'

export function TableRowSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 7 }).map((_, index) => (
        <TableCell key={index}>
          <div className='h-6 bg-gray-200 rounded animate-pulse'></div>
        </TableCell>
      ))}
    </TableRow>
  )
}
