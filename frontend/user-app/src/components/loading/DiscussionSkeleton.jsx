import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DiscussionSkeleton({ count }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card className='hover:shadow-md transition-all'>
          <CardContent className='p-4'>
            <div className='flex gap-3'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <div className='flex-1'>
                <Skeleton className='h-5 w-3/4 mb-2' />
                <Skeleton className='h-4 w-full mb-1' />
                <Skeleton className='h-4 w-2/3' />
                <div className='flex items-center gap-4 mt-2'>
                  <div className='flex items-center gap-1'>
                    <Skeleton className='h-3.5 w-3.5' />
                    <Skeleton className='h-3.5 w-8' />
                  </div>
                  <div className='flex items-center gap-1'>
                    <Skeleton className='h-3.5 w-3.5' />
                    <Skeleton className='h-3.5 w-8' />
                  </div>
                  <Skeleton className='h-3.5 w-16' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
