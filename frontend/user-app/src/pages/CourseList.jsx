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
import CourseItem from '@/components/courses/CourseItem'

const levels = ['Basic', 'Intermediate', 'Advanced', 'Expert']

function CourseList() {
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [coursesPerPage] = useState(5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [courses])

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

  useEffect(() => {
    const fetchCourseDetail = async () => {
      setLoading(true)
      setError(false)
      try {
        const data = await LearningAPI.getCourseList(1, 20)
        setCourses(data?.courseDtos?.data)
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
                placeholder='Search course...'
                className='w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className='absolute left-3 top-3.5 text-gray-400' />
            </div>
          </div>
          <div className='gap-4 ml-10'>
            <select
              className='mr-5 px-10 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={selectedLevel}
            >
              <option value=''>All levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course List */}
        {loading ? <CourseLoading></CourseLoading> : <CourseItem courses={courses} />}
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
