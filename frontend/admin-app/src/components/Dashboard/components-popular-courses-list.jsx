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
          {courses.map((course) => (
            <li key={course.id} className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>{course.name}</p>
                <p className='text-sm text-muted-foreground'>{course.enrollments} students</p>
              </div>
              <p className='font-medium'>{course.revenue.toLocaleString()} $</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

PopularCoursesList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      enrollments: PropTypes.number.isRequired,
      revenue: PropTypes.number.isRequired
    })
  ).isRequired
}
export default PopularCoursesList
