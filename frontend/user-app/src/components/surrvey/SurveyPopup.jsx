import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import InitialSurvey from './InitialSurvey';
import JavaSurvey from './JavaSurvey';
import QuizComponent from '../learning/Quiz1';

const SurveyPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showJavaSurvey, setShowJavaSurvey] = useState(false);
  const [initialSurveyCompleted, setInitialSurveyCompleted] = useState(false);

  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => {
    setShowPopup(false);
    setShowJavaSurvey(false);
    setInitialSurveyCompleted(false);
  };

  const handleInitialSurveyComplete = () => setInitialSurveyCompleted(true);

  const handleJavaSurveyChoice = (choice) => {
    if (choice === 'yes') {
      setShowJavaSurvey(true);
    } else {
      handleClosePopup();
    }
  };

  return (
    <div>
      <Button onClick={handleOpenPopup}>Mở Khảo sát</Button>
      <Dialog open={showPopup} onOpenChange={setShowPopup} >
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] m-0 p-0 overflow-auto">
          <DialogHeader>
            <DialogTitle>Khảo sát Lập trình</DialogTitle>
          </DialogHeader>
          {!initialSurveyCompleted ? (
            <QuizComponent />
          ) : !showJavaSurvey ? (
            <div className="flex flex-col space-y-4">
              <h2 className="text-lg font-semibold">Bạn có muốn làm bài khảo sát để hệ thống gợi ý lộ trình không?</h2>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleJavaSurveyChoice('no')}>Không</Button>
                <Button onClick={() => handleJavaSurveyChoice('yes')}>Có</Button>
              </div>
            </div>
          ) : (
            <JavaSurvey onComplete={handleClosePopup} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SurveyPopup;

