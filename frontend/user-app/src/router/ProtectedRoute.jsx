// src/router/ProtectedRoute.jsx
import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import AuthService from '../oidc/AuthService';
import { Loading } from '@/components/ui/overlay';

const ProtectedRoute = ({ children }) => {
  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    console.log("IN PROTECTED ROUTE")
    const checkUser = async () => {
      if (!user) {
        try {
          const userData = await AuthService.getUser();
          if (userData) {
            updateUser(userData);
          } else {
            console.log("USER NOT FOUND")
            await AuthService.login(); // Chuyển hướng đến trang đăng nhập OIDC
          }
        } catch (error) {
          console.error('Error checking user:', error);
        }
      }
    };

    checkUser();
  }, [user, updateUser]);

  if (!user) {
    // Hiển thị một loading spinner hoặc một thông báo chờ
    return <Loading />;
  }

  return children;
};

export default ProtectedRoute;