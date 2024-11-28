import React, { useEffect, useState } from 'react';
import SurveyModal from './SurveyModal';
import AssessmentPrompt from './AssessmentPrompt';
import QuizModal from './QuizModal';
import { useUser } from '../../contexts/UserContext';

const SurveyFirstLogin = () => {
  const { user, updateUserFirstLogin } = useUser();
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isAssessmentPromptOpen, setIsAssessmentPromptOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    if (user?.isFirstLogin) {
      setIsSurveyOpen(true);
    }
  }, [user?.isFirstLogin]);

  const handleSurveySubmit = (data) => {
    console.log('Survey submitted:', data);
    setIsSurveyOpen(false);
    setIsAssessmentPromptOpen(true);
  };

  const handleAssessmentAccept = () => {
    setIsAssessmentPromptOpen(false);
    setIsQuizOpen(true);
  };

  const handleAssessmentDecline = () => {
    setIsAssessmentPromptOpen(false);
    updateUserFirstLogin();
  };

  const handleQuizComplete = (score) => {
    console.log('Quiz completed with score:', score);
    setIsQuizOpen(false);
    updateUserFirstLogin();
  };

  return (
    <>
      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => {
          setIsSurveyOpen(false);
          updateUserFirstLogin();
        }}
        onSubmit={handleSurveySubmit}
      />
      
      <AssessmentPrompt
        isOpen={isAssessmentPromptOpen}
        onClose={() => {
          setIsAssessmentPromptOpen(false);
          updateUserFirstLogin();
        }}
        onAccept={handleAssessmentAccept}
        onDecline={handleAssessmentDecline}
      />
      
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => {
          setIsQuizOpen(false);
          updateUserFirstLogin();
        }}
        onComplete={handleQuizComplete}
      />
    </>
  );
};

export default SurveyFirstLogin;