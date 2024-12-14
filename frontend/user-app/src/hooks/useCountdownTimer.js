import { useState, useEffect } from 'react';

export const useCountdownTimer = (initialMinutes = 5) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let intervalId;

    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(intervalId);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    minutes,
    seconds,
    isActive,
    timeLeft
  };
}; 