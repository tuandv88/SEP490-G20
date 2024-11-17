import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CourseItem() {
  const courses = [
    {
      title: 'Implementing MVC ToDo App with Flask',
      level: 'INTERMEDIATE',
      image: 'https://d3dq4v2xxejk8c.cloudfront.net/uploads/97d786d6-bddc-4106-9fcf-e032907357fc_optimized.jpg',
      rating: 4.8,
      practices: 87,
      price: 49.99
    },
    {
      title: 'Implementing ToDo App with NestJS',
      level: 'BEGINNER',
      image: 'https://k3-production-bucket.s3.amazonaws.com/uploads/0337b82a-cbb3-4f6d-9882-2f569b8af8bc_optimized.jpg',
      rating: 4.5,
      practices: 79,
      price: 39.99
    },
    {
      title: 'Introduction to Elixir',
      level: 'BEGINNER',
      image: 'https://d3dq4v2xxejk8c.cloudfront.net/uploads/640d8a47-511d-40e4-a349-f54ba44c81d6_optimized.jpg',
      rating: 4.9,
      practices: 106,
      price: 44.99
    },
    {
      title: 'Coding Interview Prep for Senior Engineers in JavaScript',
      level: 'INTERMEDIATE',
      image: 'https://d3dq4v2xxejk8c.cloudfront.net/uploads/6604fb70-38fa-4b49-912d-9ae94fbe652c_optimized.jpg',
      rating: 4.7,
      practices: 100,
      price: 59.99
    }
  ]

  return (
    <div className='grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4'>
      {courses.map((course, index) => (
        <Card key={index} className='overflow-hidden bg-card transition-all hover:shadow-lg'>
          <CardHeader className='p-0'>
            <img src={course.image} alt={course.title} className='h-[200px] w-full object-cover' />
          </CardHeader>
          <CardContent className='p-4'>
            <Badge variant={course.level === 'INTERMEDIATE' ? 'secondary' : 'default'} className='mb-2'>
              {course.level}
            </Badge>
            <h3 className='mb-3 line-clamp-2 min-h-[48px] text-lg font-semibold'>{course.title}</h3>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <Star color='#ede607' className='h-4 w-4 fill-primary text-primary ' />
                <span className='text-sm font-medium'>{course.rating}</span>
              </div>
              <div className='flex items-center gap-2'>
                <svg
                  className='h-4 w-4 text-muted-foreground'
                  fill='none'
                  height='24'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  width='24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M12 13V2l8 4-8 4' />
                  <path d='M20.55 10.23A9 9 0 1 1 8 4.94' />
                </svg>
                <span className='text-sm text-muted-foreground'>{course.practices} practices</span>
              </div>
            </div>
            <div className='mt-3 text-right'>
              <span className='text-lg font-bold text-primary'>${course.price}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
