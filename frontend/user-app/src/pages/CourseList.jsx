/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { FaSearch /*FaFilter*/ } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS } from '../data/constants'
import Header from '@/layouts/header'
import Footer from '@/layouts/footer'
import { LearningAPI } from '@/services/api/learningApi'
import ErrorPage from './ErrorPage'
import NotFound from './NotFound'
import CourseLoading from '@/components/loading/CourseLoading'

const levels = ['Beginner', 'Advanced', 'Expert']
const categories = ['Programming', 'Computer Science', 'AI', 'Software Engineering', 'Web Development', 'Data Science']

function CourseList() {
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [coursesPerPage] = useState(5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Filter courses based on search term, level, and category
  // useEffect(() => {
  //   let filteredCourses = courses.filter(
  //     (course) =>
  //       course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //       (selectedLevel === '' || course.level === selectedLevel) &&
  //       (selectedCategory === '' || course.category === selectedCategory)
  //   )
  //   setCourses(filteredCourses)
  //   setCurrentPage(1) // Reset to first page when filters change
  // }, [searchTerm, selectedLevel, selectedCategory, courses])

  const navigate = useNavigate()

  const handleViewDetail = (courseId) => {
    navigate(AUTHENTICATION_ROUTERS.COURSEDETAIL.replace(':id', courseId))
  }

  useEffect(() => {
    const fetchCourseDetail = async () => {
      setLoading(true)
      setError(false)
      try {
        const data = await LearningAPI.getCourseList(1, 20)
        setCourses(data?.courseDtos?.data)
        console.log(data?.courseDtos?.data)
        //console.log(data.courseDetailsDto?.chapterDetailsDtos?.length)
      } catch (error) {
        console.error('Error fetching course detail:', error)
        if (error.response) {
          if (error.response.status >= 500) {
            setError(true)
          } else if (error.response.status === 404) {
            setCourses(null)
          }
        } else {
          setError(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCourseDetail()
  }, [])

  // Pagination logic
  // const indexOfLastCourse = currentPage * coursesPerPage
  // const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  // const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse)

  // const paginate = (pageNumber) => setCurrentPage(pageNumber)
  if (error) {
    return <ErrorPage />
  }

  if (!courses && !loading) {
    return <NotFound mess='There is no course on the list. Please contact Admin.' />
  }

  return (
    <div>
      <Header />
      <div className='container px-4 pt-40 pb-12 mx-auto bg-gray-50'>
        <h1 className='mb-8 text-4xl font-bold text-center text-gray-800'>Khám phá khóa học</h1>

        {/* Search and Filter Section */}
        <div className='flex flex-col gap-4 p-6 mb-8 bg-white rounded-lg shadow-md md:flex-row'>
          <div className='flex-1'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Tìm kiếm khóa học...'
                className='w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className='absolute left-3 top-3.5 text-gray-400' />
            </div>
          </div>
          <div className='flex gap-4'>
            <select
              className='px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value=''>Tất cả cấp độ</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <select
              className='px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value=''>Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course List */}
        {loading ? (
          <CourseLoading></CourseLoading>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {courses &&
              courses.map((course) => (
                <div
                  key={course.id}
                  className='overflow-hidden transition-shadow duration-300 bg-white border rounded-lg shadow-lg hover:shadow-xl'
                >
                  <div className='p-6'>
                    <h2 className='mb-2 text-xl font-semibold text-gray-800'>{course.title}</h2>
                    <p className='mb-2 text-sm text-gray-600'>
                      Cấp độ:
                      <span
                        className={`ml-1 px-2 py-1 rounded-full text-xs font-medium
            ${
              course.courseLevel === 'Basic'
                ? 'bg-green-100 text-green-800'
                : course.courseLevel === 'Advanced'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}
                      >
                        {course.courseLevel}
                      </span>
                    </p>
                    <p className='mb-2 text-sm text-gray-600'>
                      Headline:
                      <span className='px-2 py-1 ml-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full'>
                        {course.headline}
                      </span>
                    </p>
                    <p className='mb-4 text-lg font-bold text-gray-800'>${course.price}</p>
                    <button
                      onClick={() => handleViewDetail(course.id)}
                      className='w-full px-4 py-2 text-white transition duration-300 bg-blue-600 rounded-md hover:bg-blue-700'
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
        {/* Pagination */}
        <div className='flex justify-center mt-12'>
          <nav className='inline-flex -space-x-px rounded-md shadow-sm' aria-label='Pagination'>
            {Array.from({ length: Math.ceil(courses.length / coursesPerPage) }, (_, i) => (
              <button
                key={i}
                // onClick={() => paginate(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
          ${
            currentPage === i + 1
              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          } ${i === 0 ? 'rounded-l-md' : ''} ${i === Math.ceil(courses.length / coursesPerPage) - 1 ? 'rounded-r-md' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <Link to={AUTHENTICATION_ROUTERS.COURSELIST}></Link>
      <Footer />
    </div>
  )
}
export default CourseList
