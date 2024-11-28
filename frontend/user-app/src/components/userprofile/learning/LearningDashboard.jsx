import React from 'react';
import { BookOpen, Clock, Trophy } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { StatsCard } from './StatsCard';

export function LearningDashboard() {
  const courses = [
    {
      id: 1,
      title: 'Khóa học Kubernetes thực tế',
      progress: 1,
      total: 86,
      rating: 5.0,
      status: 'in-progress',
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      title: 'ReactJS Advanced',
      progress: 45,
      total: 45,
      rating: 4.8,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400',
    }
  ];

  const stats = [
    { icon: BookOpen, label: 'Các khóa học của bạn', value: 2, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { icon: Clock, label: 'Đang học', value: 1, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { icon: Trophy, label: 'Đã hoàn thành', value: 1, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Khóa học đang học</h2>
        <div className="space-y-4">
          {courses.filter(course => course.status === 'in-progress').map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Khóa học đã hoàn thành</h2>
        <div className="space-y-4">
          {courses.filter(course => course.status === 'completed').map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}