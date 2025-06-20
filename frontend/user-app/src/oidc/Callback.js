import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';
import { Loading } from '@/components/ui/overlay';


function Callback() {
  console.log("Callback method....");

  const navigate = useNavigate();

  useEffect(() => {
    AuthService.handleCallback()
      .then(() => {
        // Điều hướng về đâu cấu hình ở đây: uriRedirect:" uri  + "/callback"   -> Redirect: " uri " + "url navigate".
        // navigate('/discussions/discuss');
        navigate('/');
      })
      .catch((error) => {
        console.error('Verify Auth Code Failed.');
        navigate('/');
      });
  }, [navigate]);

  // Tạo phần tử React mà không dùng JSX
  return React.createElement(Loading);
}

export default Callback;
