import React from 'react';
import { BookOpen } from 'lucide-react';

const AssessmentPrompt = ({
  isOpen,
  onClose,
  onAccept,
  onDecline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className='bg-white rounded-lg p-8 max-w-md mx-4 text-center'>
        <BookOpen className='w-16 h-16 mx-auto mb-6 text-primaryButton' />
        <h2 className='text-2xl font-bold mb-4 text-gray-800'>Let's Find Your Perfect Path!</h2>
        <p className='text-gray-600 mb-8 text-lg'>
          Would you like to answer a few more questions to help us create your personalized learning journey?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onAccept}
            className='bg-primaryButton text-white px-8 py-3 rounded-lg hover:bg-primaryButtonHover transition-colors font-medium'
          >
            Yes, guide me!
          </button>
          <button
            onClick={onDecline}
            className='bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium'
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPrompt;