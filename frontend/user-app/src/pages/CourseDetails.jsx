import { CourseSidebar } from '@/components/courses/CodeSidebar'
import { CourseContent } from '@/components/courses/CourseContent'
import { CourseEvaluate } from '@/components/courses/CourseEvaluate'
import { CourseIntro } from '@/components/courses/CourseIntro'
import Layout from '@/layouts/layout'
import { BookmarkPlus, Share2, Star } from 'lucide-react'
import React, { useState } from 'react'

function CourseDetails() {
  const [activeTab, setActiveTab] = useState('introduce')

  return (
    <Layout>
      <div className='min-h-screen bg-primary mt-[70px]'>
        {/* Header */}
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <div className='flex flex-col gap-4'>
            {/* Rating and Title */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className='w-5 h-5 fill-yellow-400 text-yellow-400' />
                ))}
                <span className='text-primary-muted'>4.99 (532 Reviews)</span>
              </div>

              <div className='flex justify-between items-start'>
                <h1 className='text-3xl font-bold text-primary-text'>DevOps for Freshers</h1>
                <div className='flex gap-4'>
                  <button className='flex items-center gap-2 text-primary-muted hover:text-primary-text transition-colors'>
                    <BookmarkPlus className='w-5 h-5' />
                    <span>Wishlist</span>
                  </button>
                  <button className='flex items-center gap-2 text-primary-muted hover:text-primary-text transition-colors'>
                    <Share2 className='w-5 h-5' />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <span className='px-3 py-1 bg-primary-light text-primary-text rounded-full text-sm'>
                  Category: devops
                </span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6'>
              {/* Course Content - Left Side */}
              <div className='lg:col-span-2 space-y-8'>
                {/* Course Image */}
                <div className='relative aspect-video rounded-xl overflow-hidden bg-gradient-to-r from-primary-dark to-primary-light'>
                  <img
                    src='https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2022/03/hoc-java-co-ban-1.png'
                    alt='Java OOP'
                    className='w-[800] h-[450] object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent'></div>
                  <div className='absolute bottom-0 left-0 p-6 text-white'>
                    <h2 className='text-3xl font-bold mb-2'>Java For Freshers</h2>
                    <p className='text-lg'>
                      Java is a high-level, class-based, object-oriented programming language.
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className='border-b border-primary-light'>
                  <div className='flex gap-8'>
                    <button
                      className={`px-4 py-2 ${
                        activeTab === 'introduce'
                          ? 'text-primary-text border-b-2 border-primary-text font-medium'
                          : 'text-primary-muted hover:text-primary-text'
                      }`}
                      onClick={() => setActiveTab('introduce')}
                    >
                      Introduce
                    </button>
                    <button
                      className={`px-4 py-2 ${
                        activeTab === 'evaluate'
                          ? 'text-primary-text border-b-2 border-primary-text font-medium'
                          : 'text-primary-muted hover:text-primary-text'
                      }`}
                      onClick={() => setActiveTab('evaluate')}
                    >
                      Evaluate
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === 'introduce' ? (
                    <>
                      <CourseIntro />
                      <CourseContent />
                    </>
                  ) : (
                    <CourseEvaluate />
                  )}
                </div>
              </div>

              {/* Sidebar - Right Side */}
              <div className='lg:col-span-1'>
                <CourseSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CourseDetails
