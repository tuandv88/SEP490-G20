import { ExternalLink, Star, UserRoundPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CourseBadge } from './CourseBadge'
import { useNavigate } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'
import { CourseCountdown } from './CourseCountdown'

export default function CourseItem({ courses }) {
  const navigate = useNavigate()

  const handleViewDetail = (courseId) => {
    navigate(AUTHENTICATION_ROUTERS.COURSEDETAIL.replace(':id', courseId))
  }

  if (!Array.isArray(courses) || courses.length === 0) {
    return <p>No courses available.</p>
  }

  return (
    <div className='grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4'>
      {courses.map((course, index) => (
        <Card key={index} className="flex flex-col overflow-hidden bg-card transition-all hover:shadow-lg">
          <CardHeader className="p-0 relative">
            <div className="relative">
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className={`w-full h-48 object-cover ${
                  course.courseStatus === "Scheduled" ? "opacity-60" : ""
                }`} 
              />
              {course.courseStatus === "Scheduled" && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 to-black/20">
                  <div className="text-center p-6">
                    <div className="text-white font-semibold mb-2">Course will open in</div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl">
                      <CourseCountdown scheduledDate={course.scheduledPublishDate} />
                    </div>

                  </div>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    course.price === 0 ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col flex-1">
            <div className="flex-1">
              <div className="mb-4">
                <CourseBadge level={course.courseLevel} />
              </div>
    
              <h3 className="text-xl font-bold text-gray-900 mb-4">{course.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.headline}</p>
    
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <UserRoundPlus size={16} className="mr-1" />
                  <span>{course.totalParticipants || 0} participants</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Star size={16} className="mr-1 fill-yellow-400 text-yellow-400" />
                  <span>{course.averageRating || 0}</span>
                </div>
              </div>
            </div>
    
            <button 
              onClick={() => handleViewDetail(course.id)} 
              className="w-full bg-primaryButton text-white py-3 px-4 rounded-lg hover:bg-primaryButton transition-colors flex items-center justify-center gap-2 font-medium"
            >
              View Course
              <ExternalLink size={18} />
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
