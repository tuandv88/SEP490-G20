import { Link } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS } from '../data/constants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { BookOpen, Trophy, Users, Zap } from 'lucide-react'
import Header from '@/layouts/header'
import Footer from '@/layouts/footer'
function About() {
  return (
    <div>
      <Header />
      <div className='flex flex-col min-h-screen'>
        <main className='flex-grow'>
          {/* Hero Section */}
          <section className='py-20 text-white bg-gradient-to-r from-blue-600 to-blue-800'>
            <div className='container px-4 mx-auto'>
              <div className='flex flex-col items-center justify-between md:flex-row'>
                <div className='mb-10 md:w-1/2 md:mb-0'>
                  <h1 className='mb-4 text-4xl font-bold md:text-5xl'>Về EduPlatform</h1>
                  <p className='mb-6 text-xl'>
                    Chúng tôi đang định hình tương lai của giáo dục trực tuyến và thi đấu lập trình.
                  </p>
                  <Button size='lg' variant='secondary'>
                    Tìm hiểu thêm
                  </Button>
                </div>
                <div className='md:w-1/2'>
                  <img
                    src='/placeholder.svg?height=400&width=600&text=About+Us'
                    alt='About EduPlatform'
                    width={600}
                    height={400}
                    className='rounded-lg shadow-lg'
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Mission and Vision Section */}
          <section className='py-20'>
            <div className='container px-4 mx-auto'>
              <div className='mb-12 text-center'>
                <h2 className='mb-4 text-3xl font-bold'>Sứ mệnh và Tầm nhìn</h2>
                <p className='text-xl text-gray-600'>
                  Chúng tôi tin rằng giáo dục chất lượng cao nên được tiếp cận bởi mọi người, mọi nơi.
                </p>
              </div>
              <div className='grid gap-8 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Sứ mệnh</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Cung cấp nền tảng học tập và thi đấu trực tuyến hàng đầu, giúp người học phát triển kỹ năng, kiến
                      thức và đạt được mục tiêu nghề nghiệp của họ.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Tầm nhìn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Trở thành nền tảng giáo dục trực tuyến hàng đầu thế giới, nơi mọi người có thể học tập, thi đấu và
                      phát triển bản thân không giới hạn.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className='py-20 bg-gray-100'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-12 text-3xl font-bold text-center'>Giá trị cốt lõi</h2>
              <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
                {[
                  {
                    icon: <BookOpen className='w-10 h-10 text-blue-500' />,
                    title: 'Học tập liên tục',
                    description: 'Chúng tôi khuyến khích việc học tập suốt đời và luôn cập nhật kiến thức mới.'
                  },
                  {
                    icon: <Trophy className='w-10 h-10 text-blue-500' />,
                    title: 'Xuất sắc',
                    description: 'Chúng tôi luôn hướng tới sự xuất sắc trong mọi khía cạnh của nền tảng.'
                  },
                  {
                    icon: <Users className='w-10 h-10 text-blue-500' />,
                    title: 'Cộng đồng',
                    description: 'Chúng tôi xây dựng một cộng đồng học tập mạnh mẽ và hỗ trợ lẫn nhau.'
                  },
                  {
                    icon: <Zap className='w-10 h-10 text-blue-500' />,
                    title: 'Đổi mới',
                    description: 'Chúng tôi luôn tìm kiếm cách mới để cải thiện trải nghiệm học tập và thi đấu.'
                  }
                ].map((value, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className='flex items-center'>
                        {value.icon}
                        <span className='ml-2'>{value.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className='py-20'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-12 text-3xl font-bold text-center'>Câu chuyện của chúng tôi</h2>
              <Tabs defaultValue='beginning' className='w-full'>
                <TabsList className='grid w-full grid-cols-1 md:grid-cols-4'>
                  <TabsTrigger value='beginning'>Khởi đầu</TabsTrigger>
                  <TabsTrigger value='growth'>Phát triển</TabsTrigger>
                  <TabsTrigger value='expansion'>Mở rộng</TabsTrigger>
                  <TabsTrigger value='future'>Tương lai</TabsTrigger>
                </TabsList>
                <TabsContent value='beginning'>
                  <Card>
                    <CardHeader>
                      <CardTitle>2018: Sự khởi đầu</CardTitle>
                      <CardDescription>
                        EduPlatform được thành lập bởi một nhóm các kỹ sư phần mềm đam mê giáo dục.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Chúng tôi bắt đầu với một ý tưởng đơn giản: tạo ra một nền tảng học tập trực tuyến kết hợp với
                        thi đấu lập trình để giúp sinh viên và lập trình viên nâng cao kỹ năng của họ một cách thú vị và
                        hiệu quả.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value='growth'>
                  <Card>
                    <CardHeader>
                      <CardTitle>2020: Giai đoạn phát triển</CardTitle>
                      <CardDescription>
                        EduPlatform mở rộng danh mục khóa học và tổ chức các cuộc thi lập trình quy mô lớn.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Chúng tôi đã phát triển nhanh chóng, thu hút hàng nghìn học viên và tổ chức các cuộc thi lập
                        trình có sự tham gia của các công ty công nghệ hàng đầu.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value='expansion'>
                  <Card>
                    <CardHeader>
                      <CardTitle>2022: Mở rộng toàn cầu</CardTitle>
                      <CardDescription>EduPlatform bắt đầu mở rộng ra thị trường quốc tế.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Chúng tôi đã ra mắt các phiên bản ngôn ngữ mới và hợp tác với các tổ chức giáo dục trên toàn thế
                        giới để mang EduPlatform đến với nhiều học viên hơn.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value='future'>
                  <Card>
                    <CardHeader>
                      <CardTitle>2024 và xa hơn nữa: Hướng tới tương lai</CardTitle>
                      <CardDescription>EduPlatform tiếp tục đổi mới và mở rộng tầm ảnh hưởng.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Chúng tôi đang tập trung vào việc phát triển các công nghệ học tập mới, tích hợp AI vào quá
                        trình học tập, và mở rộng sang các lĩnh vực mới ngoài lập trình.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Team Section */}
          <section className='py-20 bg-gray-100'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-12 text-3xl font-bold text-center'>Đội ngũ của chúng tôi</h2>
              <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
                {[
                  {
                    name: 'Nguyễn Văn A',
                    role: 'Đồng sáng lập & CEO',
                    image: '/placeholder.svg?height=150&width=150&text=A'
                  },
                  {
                    name: 'Trần Thị B',
                    role: 'Giám đốc Công nghệ',
                    image: '/placeholder.svg?height=150&width=150&text=B'
                  },
                  {
                    name: 'Lê Văn C',
                    role: 'Giám đốc Sản phẩm',
                    image: '/placeholder.svg?height=150&width=150&text=C'
                  },
                  {
                    name: 'Phạm Thị D',
                    role: 'Giám đốc Giáo dục',
                    image: '/placeholder.svg?height=150&width=150&text=D'
                  }
                ].map((member, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <img
                        src={member.image}
                        alt={member.name}
                        width={150}
                        height={150}
                        className='mx-auto rounded-full'
                      />
                    </CardHeader>
                    <CardContent className='text-center'>
                      <h3 className='text-lg font-bold'>{member.name}</h3>
                      <p className='text-gray-600'>{member.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className='py-20 text-white bg-blue-600'>
            <div className='container px-4 mx-auto text-center'>
              <h2 className='mb-4 text-3xl font-bold'>Sẵn sàng bắt đầu hành trình học tập của bạn?</h2>
              <p className='mb-8 text-xl'>
                Tham gia cùng hàng nghìn học viên trên EduPlatform và khám phá tiềm năng của bạn ngay hôm nay.
              </p>
              <Button size='lg' variant='secondary'>
                Đăng ký ngay
              </Button>
            </div>
          </section>
        </main>
      </div>
      <Link to={AUTHENTICATION_ROUTERS.ABOUT}></Link>
      <Footer />
    </div>
  )
}
export default About
