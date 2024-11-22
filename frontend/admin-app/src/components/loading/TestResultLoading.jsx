import React from 'react'
import { Skeleton } from '../ui/skeleton'

const TestResultLoading = () => {
  return (
    <div className="w-full space-y-6">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-20 rounded-full bg-emerald-100" />
        <Skeleton className="h-10 w-20 rounded-full bg-emerald-100" />
        <Skeleton className="h-10 w-20 rounded-full bg-emerald-100" />
        <Skeleton className="h-10 w-20 rounded-full bg-emerald-100" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-full rounded-md bg-slate-100" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-full rounded-md bg-slate-100" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-full rounded-md bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

export default React.memo(TestResultLoading)