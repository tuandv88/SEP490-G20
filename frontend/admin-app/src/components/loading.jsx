import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
}

const loadingContainerVariants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

const pulseVariants = {
  initial: { scale: 0.95, opacity: 0.5 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }
  }
}

export function LoadingSpinner({ variant = 'default' }) {
  if (variant === 'minimal') {
    return (
      <div className='flex flex-col items-center justify-center w-full h-screen gap-4'>
        <motion.div className='flex items-center gap-4' initial='hidden' animate='show' variants={containerVariants}>
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <Loader2 className='w-8 h-8 text-primary' />
          </motion.div>
          <motion.h2 className='text-2xl font-semibold tracking-tight' variants={itemVariants}>
            Loading...
          </motion.h2>
        </motion.div>
        <motion.p className='text-sm text-muted-foreground' variants={itemVariants}>
          Please wait while we load your content
        </motion.p>
      </div>
    )
  }

  return (
    <motion.div className='w-full min-h-screen p-4' initial='hidden' animate='show' variants={containerVariants}>
      <div className='container mx-auto max-w-7xl'>
        {/* Header Skeleton */}
        <motion.div className='flex items-center justify-between mb-8' variants={itemVariants}>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-[200px]' />
            <Skeleton className='h-4 w-[300px]' />
          </div>
          <Skeleton className='w-10 h-10 rounded-full' />
        </motion.div>

        {/* Content Skeleton */}
        <motion.div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3' variants={containerVariants}>
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} variants={itemVariants} custom={i}>
              <Card className='overflow-hidden'>
                <CardHeader className='pb-4'>
                  <Skeleton className='w-2/3 h-4' />
                </CardHeader>
                <CardContent className='space-y-4'>
                  <Skeleton className='w-full h-20' />
                  <div className='space-y-2'>
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-4/5 h-4' />
                    <Skeleton className='w-3/5 h-4' />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          className='fixed flex items-center gap-2 p-2 px-4 border rounded-full shadow-lg bottom-4 right-4 bg-background/80 backdrop-blur-sm'
          variants={loadingContainerVariants}
          animate='animate'
        >
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <Loader2 className='w-4 h-4' />
          </motion.div>
          <span className='text-sm font-medium'>Loading...</span>
        </motion.div>

        {/* Background Effect */}
        <motion.div
          className='fixed inset-0 pointer-events-none'
          variants={pulseVariants}
          initial='initial'
          animate='animate'
        >
          <div className='absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent' />
        </motion.div>
      </div>
    </motion.div>
  )
}
