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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {filters.difficulty || 'Difficulty'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, difficulty: 'Easy' })}>
              Easy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilters({ ...filters, difficulty: 'Medium' })}>
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilters({ ...filters, difficulty: 'Hard' })}>
              Hard
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className='flex gap-2'>
          <Button variant='outline' className='text-muted-foreground' onClick={handleReset}>
            <RotateCcw className='h-3 w-3 mr-1' />
            Reset
          </Button>
          <Button className='flex-1 bg-primaryButton' onClick={handleSearch}>Search</Button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
