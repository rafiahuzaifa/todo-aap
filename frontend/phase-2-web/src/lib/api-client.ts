import api from '@/lib/api'

export const authApi = {
  register: (email: string, name: string, password: string) =>
    api.post('/auth/register', { email, name, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

export const taskApi = {
  list: (page = 1, limit = 20) =>
    api.get('/tasks', { params: { page, limit } }),
  create: (data: any) => api.post('/tasks', data),
  get: (id: string) => api.get(`/tasks/${id}`),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  complete: (id: string) => api.post(`/tasks/${id}/complete`),
}

export const statsApi = {
  summary: () => api.get('/stats/summary'),
  trends: () => api.get('/stats/trends'),
}
