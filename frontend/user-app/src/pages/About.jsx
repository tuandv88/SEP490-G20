import { Link } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS } from '../data/constants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { BookOpen, FacebookIcon, Trophy, Users, Zap } from 'lucide-react'
import Header from '@/layouts/header'
import Footer from '@/layouts/footer'
function About() {
  return (
    <div>
      <Header />
      <div className='flex flex-col min-h-screen mt-[65px]'>
        <main className='flex-grow'>
          {/* Hero Section */}
          <section className='py-20 text-white bg-gradient-to-r from-primaryButton to-primaryButtonHover'>
            <div className='container px-4 mx-auto'>
              <div className='flex flex-col items-center justify-between md:flex-row'>
                <div className='mb-10 md:w-1/2 md:mb-0'>
                  <h1 className='mb-4 text-4xl font-bold md:text-5xl'>About Smart Programming Learning Platform</h1>
                  <p className='mb-6 text-xl'>Welcome to SPLP, a scholarship fund for programming for all ages</p>

                  <p className='mb-6 text-xl'>
                    Smart Programming Learning Platform (SPLP) is an online learning platform that combines algorithmic
                    programming with the Java language to help students and programmers improve their skills in a fun
                    and effective way.
                  </p>

                  
                </div>
                <div className='md:w-1/2'>
                  <img
                    src='https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/frontend/assets/banner-about-us.jpg'
                    alt='About EduPlatform'
                    width={600}
                    height={400}
                    className='rounded-lg shadow-lg'
                  />
                </div>
              </div>
            </div>
          </section>

          <section className='py-20 bg-gray-100'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-12 text-3xl font-bold text-center text-primaryButton'>Our Team</h2>
              <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-5'>
                {[
                  {
                    name: 'Dam Tuan Dai',
                    role: 'Back-end Developer',
                    image:
                      'https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/frontend/assets/daidt.png',
                    facebook: 'https://www.facebook.com/DamTuanDai'
                  },
                  {
                    name: 'Duong Vinh Tuan',
                    role: 'Front-end Developer',
                    image:
                      'https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/frontend/assets/tuandv.png',
                    facebook: 'https://www.facebook.com/t210114.dev/'
                  },
                  {
                    name: 'Bui Van Truong',
                    role: 'Project Manager (PM)',
                    image:
                      'https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/frontend/assets/truongbv.png',
                    facebook: 'https://www.facebook.com/truongbui2002'
                  },
                  {
                    name: 'Ha Van Manh',
                    role: 'Back-end Developer',
                    image:
                      'https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/frontend/assets/manhhv.png',
                    facebook: 'https://www.facebook.com/hamanh.mee'
                  },
                  {
                    name: 'Nguyen Bao Lam',
                    role: 'Front-end Developer',
                    image:
                      'https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/frontend/assets/lamnb.png',
                    facebook: 'https://www.facebook.com/profile.php?id=100009772893523'
                  }
                ].map((member, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <img
                        src={member.image}
                        alt={member.name}
                        width={150}
                        height={150}
                        className='mx-auto rounded-full w-40 h-40 object-cover'
                      />
                    </CardHeader>
                    <CardContent className='text-center'>
                      <Link to={member.facebook} target='_blank'>
                        <h3 className='text-lg font-bold'>{member.name}</h3>
                      </Link>
                      <p className='text-gray-600'>{member.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Mission and Vision Section */}
          <section className='py-20'>
            <div className='container px-4 mx-auto'>
              <div className='mb-12 text-center'>
                <h2 className='mb-4 text-3xl font-bold text-primaryButton'>Mission and Vision</h2>
                <p className='text-xl text-gray-600'>
                  We believe that quality education should be accessible to everyone, everywhere.
                </p>
              </div>
              <div className='grid gap-8 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Provide the top online learning and competitive platform, helping learners develop skills,
                      knowledge and achieve their career goals.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Vision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Become the leading global online education platform, where everyone can learn, compete and develop
                      themselves without limits.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className='py-20 bg-gray-100'>
            <div className='container px-4 mx-auto'>
              <h2 className='mb-12 text-3xl font-bold text-center text-primaryButton'>Core Values</h2>
              <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
                {[
                  {
                    icon: <BookOpen className='w-10 h-10 text-primaryButton' />,
                    title: 'Continuous Learning',
                    description: 'We encourage lifelong learning and always update new knowledge.'
                  },
                  {
                    icon: <Trophy className='w-10 h-10 text-primaryButton' />,
                    title: 'Excellence',
                    description: 'We always strive for excellence in all aspects of the platform.'
                  },
                  {
                    icon: <Users className='w-10 h-10 text-primaryButton' />,
                    title: 'Community',
                    description: 'We build a strong learning community and support each other.'
                  },
                  {
                    icon: <Zap className='w-10 h-10 text-primaryButton' />,
                    title: 'Innovation',
                    description: 'We always seek new ways to improve the learning and competitive experience.'
                  }
                ].map((value, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className='flex items-center text-primaryButton'>
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
              <h2 className='mb-12 text-3xl font-bold text-center text-primaryButton'>Our Story</h2>
              <Tabs defaultValue='beginning' className='w-full'>
                <TabsList className='grid w-full grid-cols-1 md:grid-cols-3'>
                  <TabsTrigger value='beginning'>Beginning</TabsTrigger>
                  <TabsTrigger value='growth'>Growth</TabsTrigger>
                  <TabsTrigger value='future'>Future</TabsTrigger>
                </TabsList>
                <TabsContent value='beginning'>
                  <Card>
                    <CardHeader>
                      <CardTitle>9/2024: Beginning</CardTitle>
                      <CardDescription>
                        SPLP was founded by a group of software engineers passionate about education.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        We started with a simple idea: Create an online learning platform that combines algorithmic
                        programming with the Java language to help students and programmers improve their skills in a
                        fun and effective way.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value='growth'>
                  <Card>
                    <CardHeader>
                      <CardTitle>10/2024: Growth</CardTitle>
                      <CardDescription>SPLP expands its course catalog and adds outstanding features.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        SPLP expands the course catalog and adds large-scale algorithmic problems. Develops new features
                        for users to interact with AI Chat on the system in the lessons.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value='future'>
                  <Card>
                    <CardHeader>
                      <CardTitle>2025: Future</CardTitle>
                      <CardDescription>SPLP expands its market to the global market.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        We have launched new language versions and partnered with educational organizations around the
                        world to bring EduPlatform to more learners.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Team Section */}

          {/* Call to Action */}
          <section className='py-20 text-white bg-primaryButton'>
            <div className='container px-4 mx-auto text-center'>
              <h2 className='mb-4 text-3xl font-bold'>Ready to start your learning journey?</h2>
              <p className='mb-8 text-xl'>
                Join thousands of learners on EduPlatform and discover your potential today.
              </p>
              <Button size='lg' variant='secondary' className='text-black'>
                Sign up now
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
