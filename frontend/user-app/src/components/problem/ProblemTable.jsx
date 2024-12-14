import { Check, RotateCcw, Star } from 'lucide-react'
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
import { useContext } from 'react'
import { UserContext } from '@/contexts/UserContext'
import authServiceInstance from '@/oidc/AuthService'

function ProblemTable({ problems, currentPage, totalPages, onPageChange }) {

  const { user } = useContext(UserContext)

  const navigate = useNavigate()

  const handleSolveChallenge = (problemId) => {
    if (user) {
      navigate(`/problem-solve/${problemId}`)
    } else {
      authServiceInstance.login()
    }
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
      {problems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border">
          <div className="text-6xl mb-4">🤔</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No problem found
          </h3>
          <p className="text-gray-600 text-center mb-4">
            No problem found
            Please try adjusting the filters or searching with a different keyword.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reload page
          </Button>
        </div>
      ) : (
        <>
          {problems.map((problem) => (
            <div key={problem.problemsId} className='flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm'>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center gap-2'>
                  <h3 className='font-semibold hover:text-blue-500 cursor-pointer'>
                    <a onClick={() => handleSolveChallenge(problem.problemsId)}>{problem.title}</a>
                  </h3>
                </div>
                <div className='flex items-center gap-2 text-sm cursor-default'>
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
                  <span className='text-muted-foreground'> - </span>
                  <span className='text-muted-foreground'>Acceptance: {problem.acceptance === -1 ? '0%' : `${problem.acceptance}%`}</span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                {problem.status === 'Solved' && (
                  <div className='text-emerald-500'>
                    <Check className='h-5 w-5' />
                  </div>
                )}
                {problem.status === 'Attempted' && (
                  <div className='text-yellow-500'>
                    <Star className='h-5 w-5' />
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
        </>
      )}
    </div>
  )
}

export default ProblemTable