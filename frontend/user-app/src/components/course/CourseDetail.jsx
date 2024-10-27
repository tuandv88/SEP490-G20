/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import Layout from '@/layouts/layout'
import {
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  FileText,
  Download,
  Smartphone,
  BadgeCheck,
  Users,
  Youtube,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const courseSections = [
  {
    title: 'Course Introduction',
    lessons: []
  },
  {
    title: 'Basics of Blender 3D',
    lessons: [
      { title: 'Absolute Tuan', duration: '03:28', progress: 100 },
      { title: 'Object Editing', duration: '04:12', progress: 72 },
      { title: 'Modifiers', duration: '03:32', progress: 16 },
      { title: 'Shaders, Textures & UV', duration: '07:15', progress: 0 },
      { title: 'Lighting', duration: '03:18', progress: 0 }
    ]
  },
  {
    title: 'Mesh Modeling',
    lessons: []
  },
  {
    title: 'Mesh Editing Operations',
    lessons: []
  },
  {
    title: 'Most Common Modifiers',
    lessons: []
  },
  {
    title: 'Orthographic References',
    lessons: []
  },
  {
    title: 'Sculpting',
    lessons: []
  },
  {
    title: 'Subdivision Methods',
    lessons: []
  },
  {
    title: 'Sculpting with Symmetry',
    lessons: []
  },
  {
    title: 'Retopology',
    lessons: []
  },
  {
    title: 'Files and tools',
    lessons: []
  }
]

export default function CourseDetail() {
  const [expandedSections, setExpandedSections] = useState([1])

  const toggleSection = (index) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  // useEffect(() => {
  //   window.scrollTo(0, 0)
  // }, [])

  const feedbackData = {
    averageRating: 4.9,
    totalReviews: 202,
    ratingDistribution: [
      { stars: 5, percentage: 88 },
      { stars: 4, percentage: 11 },
      { stars: 3, percentage: 0 },
      { stars: 2, percentage: 0 },
      { stars: 1, percentage: 0 }
    ],
    reviews: [
      { name: 'Le Tran M.', rating: 5, date: '2 tuần trước', comment: 'Cơ bản dễ hiểu' },
      { name: 'Vu D.', rating: 5, date: '1 tháng trước', comment: 'Các bài giảng của thầy quá chi tiết và dễ hiểu' },
      { name: 'Trần Trọng Y.', rating: 5, date: '3 tháng trước', comment: 'tuyệt vời' },
      { name: 'Nguyen Tan T.', rating: 5, date: '3 tháng trước', comment: 'Thật sự chất lượng !!! Legit 100%' }
    ]
  }

  const markdown = `
## Mô tả
- Khóa học "Thực chiến, xây dựng ứng dụng bán hàng với Java Springboot API và Angular" sẽ giúp bạn học cách tạo một ứng dụng web thực tế hoàn chỉnh từ đầu đến cuối, bao gồm cả phía back-end và front-end.
- Bạn sẽ học cách sử dụng Java Springboot để xây dựng một RESTful API, cung cấp các tính năng cần thiết cho ứng dụng bán hàng như đăng nhập, đăng ký người dùng, quản lý sản phẩm và đơn hàng. Ngoài ra, bạn cũng sẽ được hướng dẫn cách áp dụng các công nghệ an toàn trong việc xây dựng API như JWT, Spring Security và OAuth 2.0.
- Bên cạnh đó, khóa học cũng sẽ giới thiệu về Angular - một framework front-end phổ biến để xây dựng các ứng dụng web động. Bạn sẽ học cách sử dụng Angular để tạo giao diện người dùng cho ứng dụng bán hàng của mình, kết hợp với API đã xây dựng để hiển thị thông tin sản phẩm và quản lý đơn hàng.
- Sau khi hoàn thành khóa học này, bạn sẽ có kiến thức và kỹ năng để xây dựng một ứng dụng web hoàn chỉnh với Java Springboot API và Angular, đáp ứng được các yêu cầu của một ứng dụng bán hàng thực tế.
## Mục tiêu của khóa học:
- Giúp bạn học C++ từ con số 0 một cách nhanh chóng và dễ hiểu.
- Trang bị cho bạn kiến thức và kỹ năng cần thiết để viết các chương trình C++ đơn giản.
- Giúp bạn hiểu và sử dụng các khái niệm quan trọng trong C++.
- Tạo nền tảng cho bạn để tự học và phát triển các chương trình C++ phức tạp hơn.
## Đối tượng học viên:
- Khóa học này dành cho những người mới bắt đầu hoàn toàn chưa có kiến thức về lập trình, hoặc những bạn mất căn bản muốn lấy lại kiến thức nền tảng lập trình, cụ thể là C++.
## Phương pháp giảng dạy:
- Khóa học được kết hợp giữa lý thuyết và thực hành.
- Học viên sẽ được học qua các video bài giảng, bài đọc lý thuyết, bài tập thực hành và bài tập trắc nghiệm lý thuyết.
- Học viên sẽ được trao đổi hỏi đáp những thắc mắc trực tiếp với các bạn cùng khóa và với người quản lý khóa học.
`

  return (
    <Layout>
      <div className='min-h-screen bg-gray-100 p-4 mt-[124px]'>
        <div className='max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Left Column - Course Content */}
            <div className='md:col-span-1 p-6 border-r'>
              <h2 className='text-xl font-bold mb-4'>Blender 3D Fundamentals</h2>
              <div className='text-sm text-gray-600 mb-4'>15 sections • 128 lectures • 25h 28m total length</div>
              <div className='space-y-2'>
                {courseSections.map((section, index) => (
                  <div key={index}>
                    <button
                      className='flex justify-between items-center w-full text-left py-2 hover:bg-gray-100 rounded transition-colors'
                      onClick={() => toggleSection(index)}
                    >
                      <span className='font-medium'>{section.title}</span>
                      {expandedSections.includes(index) ? (
                        <ChevronDown className='w-5 h-5 text-gray-500' />
                      ) : (
                        <ChevronRight className='w-5 h-5 text-gray-500' />
                      )}
                    </button>
                    {expandedSections.includes(index) && section.lessons.length > 0 && (
                      <div className='ml-4 mt-2 space-y-2'>
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex}>
                            <div className='flex justify-between items-center mb-1'>
                              <span className='text-sm'>{lesson.title}</span>
                              <span className='text-xs text-gray-500'>{lesson.duration}</span>
                            </div>
                            <div className='w-full bg-gray-200 rounded-full h-1'>
                              <div
                                className='bg-purple-600 h-1 rounded-full'
                                style={{ width: `${lesson.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className='md:col-span-2 gridgap-4 mt-8'>
              <div className='max-w-3xl mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  {/* Publisher Information */}
                  <div className='bg-white p-6 rounded-lg shadow-lg'>
                    <h3 className='font-bold mb-4'>Publisher</h3>
                    <div className='flex items-center mb-4'>
                      <img
                        src='https://static1.cafeland.vn/cafeautoData/upload/tintuc/thitruong/2021/01/tuan-02/elonmusk2020-1610108461.jpg'
                        alt='Elon Musk'
                        className='w-12 h-12 rounded-full mr-4 object-cover'
                      />
                      <div>
                        <div className='font-medium'>Ryan Curtis</div>
                        <div className='text-sm text-gray-600'>3D Artist</div>
                      </div>
                    </div>
                    <p className='text-sm mb-4'>
                      Hey! My name is Ryan. I'm 26 and I'm a freelance 3D Artist with around four years of experience.
                    </p>
                    <div className='text-sm space-y-2'>
                      <div className='flex items-center'>
                        <Star className='w-4 h-4 mr-2 text-yellow-400' />
                        <span>4.8 Instructor rating</span>
                      </div>
                      <div className='flex items-center'>
                        <BadgeCheck className='w-4 h-4 mr-2 text-gray-300' />
                        <span>889 Reviews</span>
                      </div>
                      <div className='flex items-center'>
                        <Users className='w-4 h-4 mr-2 text-gray-300' />
                        <span>4,887 Students</span>
                      </div>
                      <div className='flex items-center'>
                        <Youtube className='w-4 h-4 mr-2 text-gray-300' />
                        <span>6 Courses</span>
                      </div>
                    </div>
                  </div>

                  {/* Course Information and CTA */}
                  <div className='shadow-xl p-6 rounded-lg'>
                    <div className='mb-4'>
                      <span className='text-3xl font-bold'>$15.99</span>
                      <span className='text-lg line-through text-gray-500 ml-2'>$39.99</span>
                      <span className='ml-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded'>
                        60% OFF
                      </span>
                    </div>
                    <button className='w-full mb-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'>
                      Add to cart
                    </button>
                    <button className='w-full mb-4 border border-purple-600 text-purple-600 font-bold py-2 px-4 rounded hover:bg-purple-100'>
                      Buy now
                    </button>
                    <div className='text-center text-sm mb-4'>30-day money-back guarantee</div>
                    <div className='space-y-2 text-sm'>
                      <div className='font-bold'>Course includes:</div>
                      <div className='flex items-center'>
                        <Clock className='w-4 h-4 mr-2' />
                        <span>25 hours on-demand video</span>
                      </div>
                      <div className='flex items-center'>
                        <FileText className='w-4 h-4 mr-2' />
                        <span>6 articles</span>
                      </div>
                      <div className='flex items-center'>
                        <Download className='w-4 h-4 mr-2' />
                        <span>8 downloadable resources</span>
                      </div>
                      <div className='flex items-center'>
                        <Smartphone className='w-4 h-4 mr-2' />
                        <span>Mobile version</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Banner */}
                <div className='relative w-full aspect-video bg-purple-900 rounded-lg overflow-hidden mb-8'>
                  <img
                    src='https://cdn.dribbble.com/userupload/16309930/file/original-7e3f86941c500094183e158b3ce11a39.png?resize=1024x768'
                    alt='Blender 3D Fundamentals'
                    className='w-[800] h-[450] object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent'></div>
                  <div className='absolute bottom-0 left-0 p-6 text-white'>
                    <h2 className='text-3xl font-bold mb-2'>BLENDER 3D FUNDAMENTALS</h2>
                    <p className='text-lg'>Learn The Basics of 3D in Blender with a Project Based Approach</p>
                  </div>
                </div>

                {/* Course Description */}
                <div className='prose max-w-none mb-8 bg-[#dae4f3] p-6 rounded-lg shadow-lg'>
                  <ReactMarkdown
                    // eslint-disable-next-line react/no-children-prop
                    children={markdown}
                    components={{
                      h1: ({ node, ...props }) => <h1 className='text-3xl font-bold' {...props} />,
                      h2: ({ node, ...props }) => <h2 className='text-2xl font-bold' {...props} />,
                      p: ({ node, ...props }) => <p className='my-4 text-base' {...props} />,
                      ul: ({ node, ...props }) => <ul className='list-disc pl-5 py-3' {...props} />,
                      li: ({ node, ...props }) => <li className='text-base my-2 pb-2' {...props} />
                    }}
                  />
                </div>

                {/* Feedback Section */}
                <FeedbackSection feedbackData={feedbackData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const FeedbackSection = ({ feedbackData }) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-4'>Đánh giá</h2>
      <div className='flex items-center mb-6'>
        <div className='text-5xl font-bold mr-4'>{feedbackData.averageRating}</div>
        <div>
          <Star rating={Math.round(feedbackData.averageRating)} />
          <div className='text-sm text-gray-600'>({feedbackData.totalReviews} đánh giá)</div>
        </div>
      </div>
      <div className='space-y-2 mb-6'>
        {feedbackData.ratingDistribution.map((item) => (
          <div key={item.stars} className='flex items-center'>
            <div className='w-12 text-sm'>{item.stars} sao</div>
            <div className='flex-grow mx-2 bg-gray-200 rounded-full h-2'>
              <div className='bg-yellow-400 h-2 rounded-full' style={{ width: `${item.percentage}%` }}></div>
            </div>
            <div className='w-12 text-sm text-right'>{item.percentage}%</div>
          </div>
        ))}
      </div>
      <div className='space-y-4'>
        {feedbackData.reviews.map((review, index) => (
          <div key={index} className='border-b pb-4 last:border-b-0'>
            <div className='flex items-center mb-2'>
              <div className='w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center'>
                {review.name.charAt(0)}
              </div>
              <div>
                <div className='font-medium'>{review.name}</div>
                <div className='flex items-center'>
                  <Star rating={review.rating} />
                  <span className='text-sm text-gray-600 ml-2'>{review.date}</span>
                </div>
              </div>
            </div>
            <p className='text-gray-700'>{review.comment}</p>
            <div className='flex items-center mt-2 text-sm text-gray-600'>
              <button className='flex items-center mr-4'>
                <ThumbsUp className='w-4 h-4 mr-1' />
                Hữu ích
              </button>
              <button className='flex items-center'>
                <ThumbsDown className='w-4 h-4 mr-1' />
                Không hữu ích
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className='mt-4 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-100'>
        Hiển thị tất cả đánh giá
      </button>
    </div>
  )
}
