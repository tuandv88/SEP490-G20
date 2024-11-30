import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate, Outlet } from '@tanstack/react-router'
import { Loading } from '@/components/ui/overlay'

export const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  return user ? <Outlet /> : <Navigate to='/' />
}
