import { useState, useCallback } from 'react'
import { useAuthStore } from '@/lib/store'
import { authApi } from '@/lib/api-client'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth, logout } = useAuthStore()

  const register = useCallback(async (email: string, name: string, password: string) => {
    try {
      setLoading(true)
      const res = await authApi.register(email, name, password)
      setAuth(res.data.user, res.data.session.access_token)
      localStorage.setItem('refresh_token', res.data.session.refresh_token)
      return res.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setAuth])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      const res = await authApi.login(email, password)
      setAuth(res.data.user, res.data.session.access_token)
      localStorage.setItem('refresh_token', res.data.session.refresh_token)
      return res.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setAuth])

  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      logout()
    }
  }, [logout])

  return { register, login, logout: handleLogout, loading, error }
}
