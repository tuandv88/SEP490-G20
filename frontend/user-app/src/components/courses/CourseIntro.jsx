import React, { useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export function CourseIntro({ courseDetail }) {
  const [isExpanded, setIsExpanded] = useState(false);


  const renderSection = (title, content) => {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-700 mb-2">{title}</h2>
        <div
            className='prose prose-invert prose-strong:text-gray-700 prose-headings:text-gray-700
                   text-gray-700 max-w-none mb-8 p-6 
                '
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 border">
      <div className={`space-y-6 ${!isExpanded && 'max-h-[400px] overflow-hidden relative'}`}>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        )}
        {renderSection('Prerequisites', courseDetail?.prerequisites)}
        {renderSection('Target Audiences', courseDetail?.targetAudiences)}
        {renderSection('Objectives', courseDetail?.objectives)}
        {renderSection('Description', courseDetail?.description)}
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-600"
      >
        <span>{isExpanded ? 'Show less' : 'Show more'}</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}
