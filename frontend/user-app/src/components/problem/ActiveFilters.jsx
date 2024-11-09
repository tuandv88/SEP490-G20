/* eslint-disable react/prop-types */
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

function ActiveFilters({ filters, handleRemoveFilter }) {
  if (!filters.lists && !filters.difficulty && !filters.status && !filters.tags.size && !filters.favorite) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-2 mt-4'>
      {filters.favorite && (
        <Badge className='gap-1'>
          Favorite
          <button onClick={() => handleRemoveFilter('favorite')} className='ml-1'>
            <X className='h-3 w-3' />
          </button>
        </Badge>
      )}
      {filters.lists && (
        <Badge className='gap-1'>
          {filters.lists}
          <button onClick={() => handleRemoveFilter('lists')} className='ml-1'>
            <X className='h-3 w-3' />
          </button>
        </Badge>
      )}
      {filters.difficulty && (
        <Badge className='gap-1'>
          {filters.difficulty}
          <button onClick={() => handleRemoveFilter('difficulty')} className='ml-1'>
            <X className='h-3 w-3' />
          </button>
        </Badge>
      )}
      {filters.status && (
        <Badge className='gap-1'>
          {filters.status}
          <button onClick={() => handleRemoveFilter('status')} className='ml-1'>
            <X className='h-3 w-3' />
          </button>
        </Badge>
      )}
      {Array.from(filters.tags).map((tag) => (
        <Badge key={tag} className='gap-1'>
          {tag}
          <button onClick={() => handleRemoveFilter('tags', tag)} className='ml-1'>
            <X className='h-3 w-3' />
          </button>
        </Badge>
      ))}      
    </div>
  )
}

export default ActiveFilters
