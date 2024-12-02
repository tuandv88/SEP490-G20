import { useAuth } from '@/contexts/AuthContext'

export const useAuthorization = () => {
  const { user } = useAuth()
  const hasRole = (role) => {
    return user?.role && user?.profile?.role && user?.profile?.role.includes(role)
  }

  const canAccess = (resource) => {
    switch (resource) {
      case 'dashboard':
        return hasRole('admin')
      default:
        return false
    }
  }

  return { hasRole, canAccess }
}
