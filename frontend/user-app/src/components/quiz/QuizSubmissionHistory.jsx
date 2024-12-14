import { ClipboardList } from 'lucide-react';
import React from 'react'; 

export function QuizSubmissionHistory({ submissions }) {
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isPassed = (score, passingMark, totalScore) => {
    const percentageScore = (score / totalScore) * 100;
    return percentageScore >= passingMark;
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Quiz Submission History</h2>
      </div>
      
      {submissions && submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow"
              style={{
                borderLeftColor: isPassed(submission.score, submission.passingMark, submission.totalScore) 
                  ? '#22c55e' 
                  : '#ef4444'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between md:justify-start md:gap-8">
                    <span className="text-gray-600">Start:</span>
                    <span className="font-medium">{formatDateTime(submission.startTime)}</span>
                  </div>
                  <div className="flex items-center justify-between md:justify-start md:gap-8">
                    <span className="text-gray-600">End:</span>
                    <span className="font-medium">{formatDateTime(submission.submissionDate)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between md:justify-start md:gap-8">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-bold">{submission.score}/{submission.totalScore}</span>
                  </div>
                  <div className="flex items-center justify-between md:justify-start md:gap-8">
                    <span className="text-gray-600">Correct Answers:</span>
                    <span className="font-medium">{submission.correctAnswers}/{submission.totalQuestions}</span>
                  </div>
                </div>
              </div>
    
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Result:</span>
                  {isPassed(submission.score, submission.passingMark, submission.totalScore) ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Passed ({submission.passingMark}%)
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      Failed ({submission.passingMark}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No Submission Found</p>
        </div>
      )}
    </div>
  );
};


