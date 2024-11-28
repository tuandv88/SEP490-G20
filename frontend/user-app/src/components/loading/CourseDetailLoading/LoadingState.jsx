import React from 'react';
import { CourseHeaderSkeleton } from './CourseHeaderSkeleton';
import { CourseContentSkeleton } from './CourseContentSkeleton';
import { CourseIntroSkeleton } from './CourseIntroSkeleton';
import { CourseSidebarSkeleton } from './CourseSidebarSkeleton';


export function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 mt-[70px]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-4">
          <CourseHeaderSkeleton />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <div className="lg:col-span-2 space-y-8">
              {/* Course Banner */}
              <div className="aspect-video rounded-xl bg-gray-200" />
              
              {/* Tabs */}
              <div className="border-b">
                <div className="flex gap-8">
                  <div className="w-24 h-8 bg-gray-200 rounded" />
                  <div className="w-24 h-8 bg-gray-200 rounded" />
                </div>
              </div>

              <CourseIntroSkeleton />
              <CourseContentSkeleton />
            </div>

            <div className="lg:col-span-1">
              <CourseSidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}