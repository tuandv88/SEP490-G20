import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Lock, CheckCircle } from 'lucide-react';
import { VideoModal } from './VideoModal';


const courseData = [
  {
    id: 1,
    title: 'Kubernetes Roadmap',
    lessons: [
      {
        id: 1,
        title: 'Kubernetes roadmap and important notes',
        duration: '12:22',
        isPreviewable: true,
        isCompleted: true,
        videoUrl: 'https://www.youtube.com/embed/PH-2FfFD2PU'
      },
      {
        id: 2,
        title: 'Understanding Kubernetes Architecture',
        duration: '15:45',
        isPreviewable: false,
        isCompleted: false
      }
    ]
  },
  {
    id: 2,
    title: 'Getting Started with Kubernetes',
    lessons: [
      {
        id: 3,
        title: 'Setting up your first cluster',
        duration: '20:15',
        isPreviewable: true,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/embed/X48VuDVv0do'
      },
      {
        id: 4,
        title: 'Basic Kubernetes Commands',
        duration: '18:30',
        isPreviewable: false,
        isCompleted: false
      }
    ]
  }
];

export function CourseContent() {
  const [expandedChapters, setExpandedChapters] = useState([1]);
  const [activeVideo, setActiveVideo] = useState(null);

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-primary-text mb-4">Course Content</h2>
      <div className="space-y-2">
        {courseData.map(chapter => (
          <div key={chapter.id} className="border border-primary-dark rounded-lg overflow-hidden bg-primary-light">
            <button
              className="w-full px-4 py-3 hover:bg-primary flex items-center justify-between transition-colors"
              onClick={() => toggleChapter(chapter.id)}
            >
              <span className="font-medium text-primary-text">{chapter.title}</span>
              {expandedChapters.includes(chapter.id) ? (
                <ChevronUp className="w-5 h-5 text-primary-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary-muted" />
              )}
            </button>
            
            {expandedChapters.includes(chapter.id) && (
              <div className="divide-y divide-primary-dark">
                {chapter.lessons.map(lesson => (
                  <div
                    key={lesson.id}
                    className="px-4 py-3 flex items-center justify-between hover:bg-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {lesson.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : lesson.isPreviewable ? (
                        <button
                          onClick={() => setActiveVideo(lesson?.videoUrl)}
                          className="text-primary-text hover:text-primary-muted transition-colors"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      ) : (
                        <Lock className="w-5 h-5 text-primary-muted" />
                      )}
                      <span className="text-primary-text">{lesson.title}</span>
                    </div>
                    <span className="text-sm text-primary-muted">{lesson.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {activeVideo && (
        <VideoModal
          videoUrl={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
}