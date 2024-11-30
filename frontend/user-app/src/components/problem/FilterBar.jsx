/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, RotateCcw } from 'lucide-react'

function FilterBar({ filters, setFilters, availableTags, handleTagToggle, handleReset, searchString, setSearchString, handleSearch }) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Input
          type='search'
          placeholder='Search questions'
          onChange={(e) => setSearchString(e.target.value)}
          value={searchString} 
        />
        <div className='flex gap-2'>
          <Button variant='outline' className='text-muted-foreground' onClick={handleReset}> {/* Gọi handleReset */}
            <RotateCcw className='h-3 w-3 mr-1' />
            Reset
          </Button>
          <Button className='flex-1' onClick={handleSearch}>Search</Button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
