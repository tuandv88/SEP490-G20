import React, { useState } from 'react';
import { X } from 'lucide-react';


const questions = [
  {
    id: 1,
    question: "What interests you most about programming?",
    options: [
      "Creating websites and apps",
      "Solving puzzles and problems",
      "Making games",
      "Automating tasks"
    ],
    correctAnswer: 0 // All answers are valid, this is more about understanding interests
  },
  {
    id: 2,
    question: "Which of these activities do you enjoy most?",
    options: [
      "Building or crafting things",
      "Solving puzzles",
      "Drawing and designing",
      "Writing stories"
    ],
    correctAnswer: 0 // All answers are valid, helps understand learning style
  },
  {
    id: 3,
    question: "How do you prefer to learn new things?",
    options: [
      "By watching videos",
      "By reading tutorials",
      "By trying things hands-on",
      "By following step-by-step guides"
    ],
    correctAnswer: 2 // All answers are valid, helps understand learning preference
  },
  {
    id: 4,
    question: "What kind of projects would you like to create first?",
    options: [
      "A personal website",
      "A simple game",
      "A mobile app",
      "A tool to help with daily tasks"
    ],
    correctAnswer: 0 // All answers are valid, helps understand project interests
  },
  {
    id: 5,
    question: "What's your main goal in learning programming?",
    options: [
      "To start a new career",
      "To create something fun",
      "To understand technology better",
      "To solve personal problems with code"
    ],
    correctAnswer: 0 // All answers are valid, helps understand motivation
  }
];

const QuizModal = ({ isOpen, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  if (!isOpen) return null;

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // For this quiz, we're not really scoring - it's more about understanding preferences
      onComplete(5); // Always return 5 as it's more of a preference quiz
    }
  };

  const question = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <h2 className="text-xl font-bold mb-6 text-gray-800">{question.question}</h2>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;