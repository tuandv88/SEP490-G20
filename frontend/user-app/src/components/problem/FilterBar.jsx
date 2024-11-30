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

function FilterBar({ filters, setFilters, availableTags, handleTagToggle, handleReset }) {
  return (
    <div className='space-y-4'>
      {/* <div className='space-y-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-full justify-between'>
              Lists
              <ChevronDown className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setFilters((prev) => ({ ...prev, lists: 'All Problems' }))}>
              All Problems
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilters((prev) => ({ ...prev, lists: 'My Lists' }))}>
              My Lists
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-full justify-between'>
              Difficulty
              <ChevronDown className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setFilters((prev) => ({ ...prev, difficulty: 'Easy' }))}>
              Easy
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilters((prev) => ({ ...prev, difficulty: 'Medium' }))}>
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilters((prev) => ({ ...prev, difficulty: 'Hard' }))}>
              Hard
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-full justify-between'>
              Status
              <ChevronDown className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setFilters((prev) => ({ ...prev, status: 'Todo' }))}>
              Todo
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilters((prev) => ({ ...prev, status: 'Solved' }))}>
              Solved
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-[42%] justify-between'>
              Tags
              {filters.tags.size > 0 && <Badge variant='secondary'>{filters.tags.size}</Badge>}
              <ChevronDown className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {availableTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={filters.tags.has(tag)}
                onCheckedChange={() => handleTagToggle(tag)}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}

      <div className='space-y-2'>
        <Input type='search' placeholder='Search questions' />
        <div className='flex gap-2'>
          <Button variant='outline' className='text-muted-foreground' onClick={handleReset}>
            <RotateCcw className='h-3 w-3 mr-1' />
            Reset
          </Button>
          <Button className='flex-1'>Pick One</Button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
