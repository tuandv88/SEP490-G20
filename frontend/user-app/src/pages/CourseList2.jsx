import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock } from 'lucide-react';


const courses = [
  {
    id: 1,
    title: 'Behavioral Interview Practice for Computer Science Students',
    level: 'BEGINNER',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    courseCount: 3,
    practiceCount: 36
  },
  {
    id: 2,
    title: 'AI Interviews - Software Design, Architecture, and More',
    level: 'INTERMEDIATE',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    courseCount: 4,
    practiceCount: 40
  },
  {
    id: 3,
    title: 'How to Win Friends & Influence People in Practice',
    level: 'BEGINNER',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    courseCount: 4,
    practiceCount: 48
  }
];

export function CourseList() {
  return (
    <main className="flex-grow py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-primary-text mb-4">All Courses</h1>
          <p className="text-primary-muted">Explore our comprehensive collection of courses</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-primary-light rounded-lg overflow-hidden border border-primary-dark hover:border-primary-text transition-colors"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.level === 'BEGINNER' ? 'bg-green-500 text-white' :
                    course.level === 'INTERMEDIATE' ? 'bg-yellow-500 text-black' :
                    'bg-red-500 text-white'
                  }`}>
                    {course.level}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary-text mb-4">
                  {course.title}
                </h3>
                
                <div className="flex items-center gap-6 text-primary-muted">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.courseCount} courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.practiceCount} practices</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}