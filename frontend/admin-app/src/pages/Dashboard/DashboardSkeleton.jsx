import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardSkeleton() {
  return (
    <div className='p-10 space-y-10'>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className='h-[100px]' />
        ))}
      </div>
      <Skeleton className='h-[400px]' />
      <div className='grid gap-6 md:grid-cols-2'>
        <Skeleton className='h-[300px]' />
        <Skeleton className='h-[300px]' />
      </div>
    </div>
  )
}
