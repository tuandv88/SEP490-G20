/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS } from '../data/constants'
import Layout from '@/layouts/layout'
import { useState } from 'react'
import { Star, Clock, Users, Trophy, ChevronRight, Cookie } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import CourseItem from '@/components/course/CourseItem'

// Giả lập các component UI
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

  const navigate = useNavigate()

  // eslint-disable-next-line no-unused-vars
  const handleViewDetail = (courseId) => {
    navigate(AUTHENTICATION_ROUTERS.COURSEDETAIL.replace(':id', courseId))
  }

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
              <h2 className='mb-8 text-2xl font-bold text-center md:text-3xl md:mb-10'>Khóa học nổi bật</h2>
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
              <CourseItem/>
              <div className='mt-8 text-center md:mt-10'>
                <Button className='text-green-500 border border-green-500 hover:bg-blue-50'>
                  Xem tất cả khóa học
                  <ChevronRight className='inline-block ml-2' />
                </Button>
              </div>
            </div>
          </section>

          {/* Upcoming Contests Section */}
          <section className='py-12 bg-gray-100 md:py-20'>
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

          {/* Call-to-Action Section */}
          <section className='py-12 text-white bg-green-500 md:py-20'>
            <div className='container px-4 mx-auto text-center'>
              <h2 className='mb-4 text-2xl font-bold md:text-3xl'>Sẵn sàng bắt đầu hành trình học tập của bạn?</h2>
              <p className='mb-8 text-lg md:text-xl'>
                Đăng ký ngay để nhận thông tin về các khóa học mới và cuộc thi hấp dẫn!
              </p>
              <form
                onSubmit={handleSubscribe}
                className='flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'
              >
                <Input
                  type='email'
                  placeholder='Nhập địa chỉ email của bạn'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full text-black bg-white sm:w-64'
                  required
                />
                <Button type='submit' className='w-full text-blue-500 bg-white sm:w-auto hover:bg-blue-100'>
                  Đăng ký ngay
                </Button>
              </form>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className='py-12 md:py-20'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-8 text-2xl font-bold text-center md:text-3xl md:mb-10'>Tại sao chọn chúng tôi?</h2>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8'>
                {[
                  {
                    icon: '🎓',
                    title: 'Chất lượng đào tạo',
                    description: 'Các khóa học được thiết kế và giảng dạy bởi các chuyên gia hàng đầu trong ngành.'
                  },
                  {
                    icon: '🏆',
                    title: 'Cơ hội thực hành',
                    description: 'Tham gia các cuộc thi để áp dụng kiến thức và nâng cao kỹ năng thực tế.'
                  },
                  {
                    icon: '🌐',
                    title: 'Cộng đồng học tập',
                    description: 'Kết nối với hàng nghìn học viên khác để chia sẻ kinh nghiệm và học hỏi lẫn nhau.'
                  },
                  {
                    icon: '📈',
                    title: 'Linh hoạt học tập',
                    description: 'Học bất cứ lúc nào, bất cứ nơi đâu với nền tảng học tập trực tuyến tiên tiến.'
                  },
                  {
                    icon: '🎯',
                    title: 'Chứng chỉ có giá trị',
                    description: 'Nhận chứng chỉ được công nhận rộng rãi sau khi hoàn thành khóa học.'
                  },
                  {
                    icon: '💼',
                    title: 'Cơ hội nghề nghiệp',
                    description: 'Tiếp cận các cơ hội việc làm thông qua mạng lưới đối tác của chúng tôi.'
                  }
                ].map((feature, index) => (
                  <Card key={index} className='p-6'>
                    <div className='mb-2 text-4xl'>{feature.icon}</div>
                    <h3 className='mb-2 text-xl font-semibold'>{feature.title}</h3>
                    <p className='text-sm md:text-base'>{feature.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Partners Section */}
          <section className='py-12 bg-gray-100 md:py-20'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-8 text-2xl font-bold text-center md:text-3xl md:mb-10'>Đối tác của chúng tôi</h2>
              <div className='flex flex-wrap items-center justify-center gap-4 md:gap-8'>
                {[1, 2, 3, 4, 5, 6].map((partner) => (
                  <div
                    key={partner}
                    className='flex items-center justify-center w-24 h-24 bg-white rounded-lg shadow-md md:w-32 md:h-32'
                  >
                    <img
                      src={`https://cmctelecom.vn/wp-content/uploads/2017/02/microsoft-logo-microsoft-icon-transparent-free-png.png?height=60&width=60&text=Partner+${partner}`}
                      alt={`Partner ${partner}`}
                      className='w-16 h-16 md:w-20 md:h-20'
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className='py-12 md:py-20'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-8 text-2xl font-bold text-center md:text-3xl md:mb-10'>Câu hỏi thường gặp</h2>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8'>
                {[
                  {
                    question: 'Làm thế nào để bắt đầu một khóa học?',
                    answer:
                      'Để bắt đầu một khóa học, bạn chỉ cần đăng ký tài khoản, chọn khóa học mong muốn và thanh toán. Sau đó, bạn có thể truy cập nội dung khóa học ngay lập tức.'
                  },
                  {
                    question: 'Các khóa học có chứng chỉ không?',
                    answer:
                      'Có, sau khi hoàn thành khóa học, bạn sẽ nhận được chứng chỉ điện tử có thể chia sẻ trên các nền tảng mạng xã hội chuyên nghiệp.'
                  },
                  {
                    question: 'Tôi có thể học thử miễn phí không?',
                    answer:
                      'Có, chúng tôi cung cấp một số bài học miễn phí cho mỗi khóa học để bạn có thể trải nghiệm trước khi quyết định đăng ký.'
                  },
                  {
                    question: 'Làm thế nào để tham gia một cuộc thi?',
                    answer:
                      'Để tham gia cuộc thi, bạn cần có tài khoản trên nền tảng của chúng tôi. Sau đó, bạn có thể duyệt qua danh sách các cuộc thi sắp diễn ra và đăng ký tham gia.'
                  }
                ].map((faq, index) => (
                  <Card key={index} className='p-6'>
                    <h3 className='mb-2 text-lg font-semibold md:text-xl'>{faq.question}</h3>
                    <p className='text-sm md:text-base'>{faq.answer}</p>
                  </Card>
                ))}
              </div>
              <div className='mt-8 text-center md:mt-10'>
                <Button className='text-blue-500 border border-blue-500 hover:bg-blue-50'>
                  Xem tất cả câu hỏi
                  <ChevronRight className='inline-block ml-2' />
                </Button>
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
