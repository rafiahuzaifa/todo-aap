import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  user: any
  token: string | null
  setAuth: (user: any, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem('access_token', token)
    set({ isLoggedIn: true, user, token })
  },
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ isLoggedIn: false, user: null, token: null })
  },
}))

interface TaskState {
  tasks: any[]
  loading: boolean
  setTasks: (tasks: any[]) => void
  addTask: (task: any) => void
  updateTask: (id: string, task: any) => void
  deleteTask: (id: string) => void
  setLoading: (loading: boolean) => void
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
    })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  setLoading: (loading) => set({ loading }),
}))
