import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export function ProblemSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm'>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-48' />
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-5 w-5 rounded-full' />
          <Button className='h-9' variant='outline' disabled>
            <Skeleton className='h-4 w-24' />
          </Button>
        </div>
      </div>
      <div className='flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm'>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-48' />
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-5 w-5 rounded-full' />
          <Button className='h-9' variant='outline' disabled>
            <Skeleton className='h-4 w-24' />
          </Button>
        </div>
      </div>
      <div className='flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm'>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-48' />
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-5 w-5 rounded-full' />
          <Button className='h-9' variant='outline' disabled>
            <Skeleton className='h-4 w-24' />
          </Button>
        </div>
      </div>
      <div className='flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm'>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-48' />
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-5 w-5 rounded-full' />
          <Button className='h-9' variant='outline' disabled>
            <Skeleton className='h-4 w-24' />
          </Button>
        </div>
      </div>
      <div className='flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm'>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-48' />
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-5 w-5 rounded-full' />
          <Button className='h-9' variant='outline' disabled>
            <Skeleton className='h-4 w-24' />
          </Button>
        </div>
      </div>
      <div className='flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm'>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-48' />
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-5 w-5 rounded-full' />
          <Button className='h-9' variant='outline' disabled>
            <Skeleton className='h-4 w-24' />
          </Button>
        </div>
      </div>     
    </div>
  )
}
