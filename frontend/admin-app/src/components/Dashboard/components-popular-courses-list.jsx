import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PropTypes from 'prop-types'
function PopularCoursesList({ courses }) {
  return (
    <Card className='bg-card text-card-foreground'>
      <CardHeader>
        <CardTitle>Popular Courses</CardTitle>
        <CardDescription>Top 4 courses with the most enrollments</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='space-y-4'>
          {courses?.map((course) => (
            <li key={course.courseId} className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>{course.title}</p>
                <p className='text-sm text-muted-foreground'>{course.enrollmentCount} learners</p>
              </div>
              <p className='font-medium'>{course.price.toLocaleString()} $</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default PopularCoursesList
