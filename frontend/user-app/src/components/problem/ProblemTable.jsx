import { Check, Star } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

function ProblemTable({ problems, currentPage, totalPages, onPageChange }) {

  const navigate = useNavigate()

  const handleSolveChallenge = (problemId) => {
    navigate(`/problems/${problemId}`)
  }


  const renderPaginationItems = () => {
    const items = []
    const maxVisible = 5
    const halfVisible = Math.floor(maxVisible / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    items.push(
      <PaginationItem key='prev'>
        <PaginationPrevious
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        />
      </PaginationItem>
    )

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
        </PaginationItem>
      )
      if (startPage > 2) {
        items.push(
          <PaginationItem key='ellipsis1'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => onPageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key='ellipsis2'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      )
    }

    items.push(
      <PaginationItem key='next'>
        <PaginationNext
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        />
      </PaginationItem>
    )

    return items
  }

  return (
    <div className='space-y-4'>
      {problems.map((problem) => (
        <div key={problem.problemsId} className='flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm'>
          <div className='flex-1 space-y-1'>
            <div className='flex items-center gap-2'>
              <h3 className='font-semibold hover:text-blue-500'>
                <a href='#'>{problem.title}</a>
              </h3>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <span
                className={cn(
                  'font-medium',
                  problem.difficulty === 'Easy' && 'text-emerald-500',
                  problem.difficulty === 'Medium' && 'text-yellow-500',
                  problem.difficulty === 'Hard' && 'text-red-500'
                )}
              >
                {problem.difficulty}
              </span>
              <span className='text-muted-foreground'>Max Score: {problem.maxScore || 10}</span>
              <span className='text-muted-foreground'>Acceptance: {problem.acceptance === -1 ? '0%' : `${problem.acceptance}%`}</span>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            {problem.solved && (
              <div className='text-emerald-500'>
                <Check className='h-5 w-5' />
              </div>
            )}
            <Button className='h-9' variant='outline' onClick={() => handleSolveChallenge(problem.problemsId)}>
              Solve Challenge
            </Button>
          </div>
        </div>
      ))}

      <div className='flex items-center justify-center py-4'>
        <Pagination>
          <PaginationContent>{renderPaginationItems()}</PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default ProblemTable