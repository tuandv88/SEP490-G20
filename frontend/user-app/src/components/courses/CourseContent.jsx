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

export function CourseContent({ chapters }) {

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
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
      <div className="space-y-2">
        {chapters.map(chapter => (
          <div key={chapter.id} className="border rounded-lg overflow-hidden">
            <button
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
              onClick={() => toggleChapter(chapter.id)}
            >
              <span className="font-medium text-gray-900">{chapter.title}</span>
              {expandedChapters.includes(chapter.id) ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedChapters.includes(chapter.id) && (
              <div className="divide-y">
                {chapter.lectures.map(lecture => (
                  <div
                    key={lecture.id}
                    className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      { lecture.isFree === true ? (
                        <button
                          onClick={() => setActiveVideo(lecture?.videoUrl)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="text-gray-700">{lecture.title}</span>
                    </div>
                    {/* <span className="text-sm text-gray-500">{lecture.duration}</span> */}
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


// {lecture.isCompleted ? (
//   <CheckCircle className="w-5 h-5 text-green-500" />
// ) : lecture.isPreviewable ? (
//   <button
//     onClick={() => setActiveVideo(lecture?.videoUrl)}
//     className="text-blue-500 hover:text-blue-600"
//   >
//     <Play className="w-5 h-5" />
//   </button>
// ) : (
//   <Lock className="w-5 h-5 text-gray-400" />
// )}