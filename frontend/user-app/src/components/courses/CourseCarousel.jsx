import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Clock, ExternalLink, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '../ui/card'
import { CourseBadge } from './CourseBadge'
import { useNavigate } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'

export function CourseCarousel({ courses }) {
  const carouselRef = useRef(null)
  const navigate = useNavigate()

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { current } = carouselRef
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleViewDetail = (courseId) => {
    navigate(AUTHENTICATION_ROUTERS.COURSEDETAIL.replace(':id', courseId))
  }

  return (
    <div className='relative'>
      <div className='flex justify-end gap-2 mb-4'>
        <Button
          variant='outline'
          size='icon'
          className='rounded-full bg-white shadow-sm hover:shadow-md'
          onClick={() => scroll('left')}
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          className='rounded-full bg-white shadow-sm hover:shadow-md'
          onClick={() => scroll('right')}
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
      <div
        ref={carouselRef}
        className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {courses.map((course) => (
          <div key={course.id} className='min-w-[300px] snap-start'>
            <Card className='h-[500px] flex flex-col overflow-hidden bg-card transition-all hover:shadow-lg'>
              <CardHeader className='p-0'>
                <div className='relative'>
                  <img src={course.imageUrl} alt={course.title} className='w-full h-48 object-cover' />
                  <div className='absolute top-4 right-4'>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        course.price === 0 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                      }`}
                    >
                      {course?.price === 0 ? 'Free' : `$${course?.price}`}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-4 flex flex-col flex-1'>
                <div className='flex-1'>
                  <div className='mb-4'>
                    <CourseBadge level={course.courseLevel} />
                  </div>

                  <h3 className='text-xl font-bold text-gray-900 mb-4 line-clamp-2'>{course.title}</h3>
                  <p className='text-gray-600 mb-4 line-clamp-2'>{course.headline}</p>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center text-gray-600'>
                      <Clock size={16} className='mr-1' />
                      <span>11 practices</span>
                    </div>
                    <div className='flex items-center text-gray-600'>
                      <Star size={16} className='mr-1 fill-yellow-400 text-yellow-400' />
                      <span>12</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetail(course.id)}
                  className='w-full bg-primaryButton text-white py-3 px-4 rounded-lg hover:bg-primaryButton transition-colors flex items-center justify-center gap-2 font-medium mt-4'
                >
                  View Course
                  <ExternalLink size={18} />
                </button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
