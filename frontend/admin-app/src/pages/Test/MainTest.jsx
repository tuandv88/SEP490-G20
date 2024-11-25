import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { testRoute } from '@/routers/router'
import { Button } from '@/components/ui/button';

const MainTest = () => {
  const navigate = useNavigate()

  const handleEditCourse = (testId) => {
    navigate({
      to: testRoute.id, 
      params: { testId },  
    });
  };

  return (
    <div>
      <Button onClick={() => handleEditCourse(123)}>Click Here</Button>
    </div>
  )
};

export default MainTest;