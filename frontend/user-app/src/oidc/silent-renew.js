import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';
import { Loading } from '@/components/ui/overlay';


function SlientRenew() {

  const navigate = useNavigate();

  useEffect(() => {
    AuthService.handleCallback()
      .then(() => {
        console.log('Verify Auth Code - Get Access_Token & Save Storage..');

        navigate('/');
      })
      .catch((error) => {
        console.error('Error handling callback:', error);
        console.error('Verify Auth Code Failed.');
        navigate('/');
      });
  }, [navigate]);

  // Tạo phần tử React mà không dùng JSX
  return React.createElement(Loading);
}

export default SlientRenew;