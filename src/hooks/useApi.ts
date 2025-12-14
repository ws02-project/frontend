import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useCallback } from "react"
import { taskApi, projectApi, setAuthToken } from "@/services/api"
import { useAuth } from "@/hooks/useAuth"
import type { Task, Project, CreateTaskInput, UpdateTaskInput, CreateProjectInput, UpdateProjectInput } from "@/types"

/**
 * Hook to set auth token on API instances
 * Should be used at the top level of authenticated components
 */
export function useAuthenticatedApi() {
  const { isAuthenticated, getAccessToken } = useAuth()

  const setTokens = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const token = await getAccessToken()
        setAuthToken(taskApi, token)
        setAuthToken(projectApi, token)
      } catch (error) {
        console.error("Failed to get access token:", error)
      }
    }
  }, [isAuthenticated, getAccessToken])

  useEffect(() => {
    setTokens()
  }, [setTokens])

  return { refreshTokens: setTokens }
}

// Task hooks
export function useTasks() {
  const { isAuthenticated, getAccessToken } = useAuth()
  
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      // Ensure token is set before request
      if (isAuthenticated) {
        const token = await getAccessToken()
        setAuthToken(taskApi, token)
      }
      const response = await taskApi.get("/tasks")
      // Handle both { data: tasks } and direct array response
      return Array.isArray(response.data) ? response.data : (response.data?.data || []) as Task[]
    },
    enabled: isAuthenticated,
  })
}

export function useTask(id: string) {
  const { isAuthenticated, getAccessToken } = useAuth()
  
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      if (isAuthenticated) {
        const token = await getAccessToken()
        setAuthToken(taskApi, token)
      }
      const response = await taskApi.get(`/tasks/${id}`)
      return response.data as Task
    },
    enabled: !!id && isAuthenticated,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const { getAccessToken } = useAuth()
  
  return useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      const token = await getAccessToken()
      setAuthToken(taskApi, token)
      const response = await taskApi.post("/tasks", data)
      // Backend returns { success: true, data: task }
      return (response.data?.data || response.data) as Task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  const { getAccessToken } = useAuth()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateTaskInput & { id: string }) => {
      const token = await getAccessToken()
      setAuthToken(taskApi, token)
      const response = await taskApi.patch(`/tasks/${id}`, data)
      // Backend returns { success: true, data: task }
      return (response.data?.data || response.data) as Task
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.id] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  const { getAccessToken } = useAuth()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken()
      setAuthToken(taskApi, token)
      await taskApi.delete(`/tasks/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}

// Project hooks
export function useProjects() {
  const { isAuthenticated, getAccessToken } = useAuth()
  
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      if (isAuthenticated) {
        const token = await getAccessToken()
        setAuthToken(projectApi, token)
      }
      const response = await projectApi.get("/projects")
      // Handle both { data: projects } and direct array response
      return Array.isArray(response.data) ? response.data : (response.data?.data || []) as Project[]
    },
    enabled: isAuthenticated,
  })
}

export function useProject(id: string) {
  const { isAuthenticated, getAccessToken } = useAuth()
  
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      if (isAuthenticated) {
        const token = await getAccessToken()
        setAuthToken(projectApi, token)
      }
      const response = await projectApi.get(`/projects/${id}`)
      return response.data as Project
    },
    enabled: !!id && isAuthenticated,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { getAccessToken } = useAuth()
  
  return useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const token = await getAccessToken()
      setAuthToken(projectApi, token)
      const response = await projectApi.post("/projects", data)
      // Backend returns { success: true, data: project }
      return (response.data?.data || response.data) as Project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  const { getAccessToken } = useAuth()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateProjectInput & { id: string }) => {
      const token = await getAccessToken()
      setAuthToken(projectApi, token)
      const response = await projectApi.patch(`/projects/${id}`, data)
      // Backend returns { success: true, data: project }
      return (response.data?.data || response.data) as Project
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const { getAccessToken } = useAuth()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken()
      setAuthToken(projectApi, token)
      await projectApi.delete(`/projects/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}
