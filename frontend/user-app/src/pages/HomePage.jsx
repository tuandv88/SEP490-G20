/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS } from '../data/constants'
import Layout from '@/layouts/layout'
import { useEffect, useState } from 'react'
import { Star, Clock, Users, Trophy, ChevronRight, Cookie } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import CourseLoading from '@/components/loading/CourseLoading'
import CourseItem from '@/components/courses/CourseItem'
import { LearningAPI } from '@/services/api/learningApi'
import { AlgorithmCard } from '@/components/problem/AlgorithmCard'
import { ProblemSection } from '@/components/problem/ProblemSection'
import { CourseCarousel } from '@/components/courses/CourseCarousel'

export const algorithms = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Find two numbers in an array that add up to a target sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    likes: 452,
    submissions: 1250,
    successRate: 85
  },
  {
    id: '2',
    title: 'Binary Tree Level Order Traversal',
    description: 'Traverse a binary tree in level order (breadth-first search)',
    difficulty: 'Medium',
    category: 'Trees',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    likes: 328,
    submissions: 850,
    successRate: 72
  },
  {
    id: '3',
    title: 'Merge K Sorted Lists',
    description: 'Merge k sorted linked lists into one sorted linked list',
    difficulty: 'Hard',
    category: 'Linked Lists',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(n)',
    likes: 275,
    submissions: 620,
    successRate: 65
  }
]

const Button = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 rounded ${className}`} {...props}>
    {children}
  </button>
)

const Input = ({ className, ...props }) => <input className={`px-3 py-2 border rounded ${className}`} {...props} />

const Card = ({ children, className, ...props }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>
    {children}
  </div>
)

const Badge = ({ children, className, ...props }) => (
  <span className={`px-2 py-1 text-sm rounded-full bg-blue-100 text-green-800 ${className}`} {...props}>
    {children}
  </span>
)

const Avatar = ({ src, alt, className, ...props }) => (
  <img src={src} alt={alt} className={`rounded-full ${className}`} {...props} />
)

function HomePage() {
  const [email, setEmail] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const navigate = useNavigate()

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

  const handleSubscribe = (e) => {
    e.preventDefault()
    console.log('Subscribed with email:', email)
    setEmail('')
  }
  return (
    <>
      <Layout>
        <div className='flex flex-col min-h-screen pt-12'>
          {/* Hero Section */}
          <section className='py-12 text-white bg-gradient-to-r from-green-500 to-green-700 md:py-20'>
            <div className='container px-4 mx-auto'>
              <div className='flex flex-col items-center justify-between md:flex-row'>
                <div className='mb-8 md:w-1/2 md:mb-0'>
                  <h1 className='mb-4 text-3xl font-bold md:text-4xl lg:text-6xl'>Học tập và Thi đấu Trực tuyến</h1>
                  <p className='mb-6 text-lg md:text-xl'>
                    Nâng cao kiến thức và kỹ năng của bạn với các khóa học chất lượng cao và thử thách bản thân trong
                    các cuộc thi hấp dẫn.
                  </p>
                  <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
                    <Button className='text-green-300 bg-white hover:bg-blue-100'>Khám phá khóa học</Button>
                    <Button className='border border-white hover:bg-red-600'>Tham gia cuộc thi</Button>
                  </div>
                </div>
                <div className='md:w-5/11'>
                  <img
                    src='https://s3-sgn09.fptcloud.com/codelearnstorage/Upload/Blog/top-5-trang-web-day-lap-trinh-mien-phi-63727982616.0848.jpg?height=300&width=500'
                    alt='Students learning online'
                    className='w-full h-auto rounded-lg shadow-lg'
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Featured Courses Section */}
          <section className='py-12 md:py-20'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-8 text-2xl font-bold text-center md:text-3xl md:mb-10'>Featured Courses</h2>
              {/* <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8'>
                {[1, 2, 3].map((course) => (
                  <Card key={course} className='flex flex-col'>
                    <img
                      src={`https://viettuts.vn/images/java/java-la-gi.png?height=200&width=400&text=Course+${course}`}
                      alt={`Course ${course}`}
                      className='object-cover w-full h-48 rounded-t-lg'
                    />
                    <div className='flex-grow p-4'>
                      <Badge className='mb-2'>Mới</Badge>
                      <h3 className='mb-2 text-xl font-semibold'>Khóa học {course}</h3>
                      <p className='mb-4 text-gray-600'>Mô tả ngắn về khóa học và những gì học viên sẽ học được.</p>
                    </div>
                    <div className='flex items-center justify-between p-4 border-t'>
                      <div className='flex items-center'>
                        <Star className='w-5 h-5 mr-1 text-yellow-400' />
                        <span className='text-sm'>4.8 (120 đánh giá)</span>
                      </div>
                      <Button
                        onClick={() => handleViewDetail('6773706d-dae4-42f8-b58e-5551fa6ebaca')}
                        className='text-white bg-green-500 hover:bg-green-600'
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </Card>
                ))}
              </div> */}
              {loading ? <CourseLoading></CourseLoading> : <CourseCarousel courses={courses} />}
              <div className='mt-8 text-center md:mt-10'>
                <Button className='border border-green-500 hover:bg-blue-50'>
                  View All Courses
                  <ChevronRight className='inline-block ml-2' />
                </Button>
              </div>
            </div>
          </section>

          {/* Upcoming Contests Section */}
          {/* <section className='py-12 bg-gray-100 md:py-20'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-8 text-2xl font-bold text-center md:text-3xl md:mb-10'>Cuộc thi sắp diễn ra</h2>
              <Carousel className='w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl'>
                <CarouselContent>
                  {[1, 2, 3, 4, 5].map((contest) => (
                    <CarouselItem key={contest}>
                      <Card className='flex flex-col h-full'>
                        <div className='flex-grow p-4'>
                          <h3 className='mb-2 text-xl font-semibold'>Cuộc thi Lập trình {contest}</h3>
                          <p className='mb-4 text-gray-600'>Thử thách kỹ năng lập trình của bạn</p>
                          <div className='flex items-center mb-2'>
                            <Clock className='w-5 h-5 mr-2' />
                            <span className='text-sm'>Ngày 15 tháng 5, 2024</span>
                          </div>
                          <div className='flex items-center mb-2'>
                            <Users className='w-5 h-5 mr-2' />
                            <span className='text-sm'>500 người tham gia</span>
                          </div>
                          <div className='flex items-center mb-4'>
                            <Trophy className='w-5 h-5 mr-2' />
                            <span className='text-sm'>Giải thưởng: $1000</span>
                          </div>
                        </div>
                        <div className='p-4 border-t'>
                          <Button className='w-full text-white bg-green-400 hover:bg-green-600'>
                            Đăng ký tham gia
                          </Button>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </section>         */}

          <section className='py-12 md:py-20'>
            <div className='container px-4 mx-auto'>
              <ProblemSection />
            </div>
          </section>

          {/* Testimonials Section */}
          <section className='py-12 md:py-20'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-8 text-2xl font-bold text-center md:text-3xl md:mb-10'>Học viên nói gì về chúng tôi</h2>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8'>
                {[1, 2, 3].map((testimonial) => (
                  <Card key={testimonial} className='p-6'>
                    <div className='flex items-center mb-4'>
                      <Avatar
                        src={`https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?height=40&width=40&text=User+${testimonial}`}
                        alt={`User ${testimonial}`}
                        className='w-10 h-10 mr-4'
                      />
                      <div>
                        <p className='font-semibold'>Học viên {testimonial}</p>
                        <p className='text-sm text-gray-600'>Khóa học: React Nâng cao</p>
                      </div>
                    </div>
                    <p className='text-sm italic md:text-base'>
                      &quot;Tôi đã học được rất nhiều từ khóa học này. Giảng viên rất nhiệt tình và kiến thức được
                      truyền đạt rất dễ hiểu.&quot;
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
        <Link to={AUTHENTICATION_ROUTERS.HOME}></Link>
      </Layout>
    </>
  )
}
export default HomePage
