import React, { createContext, useState, useEffect, useContext, Children } from 'react'
import AuthService from '@/oidc/AuthService'

const AuthContext = createContext(null)

export const AuthProvider = ({ Children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AuthService.getUser().then((user) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const login = AuthService.login()
  const logout = AuthService.logout()

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{Children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
