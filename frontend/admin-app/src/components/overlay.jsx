import React from 'react'
import { Loader2 } from 'lucide-react'

export function Loading({ size = 'default' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className='fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
    </div>
  )
}
