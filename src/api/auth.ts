import apiClient from './client'
import { User } from '../types'

export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; access_token: string }> => {
    const res = await apiClient.post('/auth/login', { email, password })
    return res.data.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  changePassword: async (current_password: string, new_password: string): Promise<void> => {
    await apiClient.post('/auth/change-password', { current_password, new_password })
  },
}
