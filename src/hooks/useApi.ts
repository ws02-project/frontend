import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { taskApi, projectApi } from "@/services/api"
import type { Task, Project, CreateTaskInput, UpdateTaskInput, CreateProjectInput, UpdateProjectInput } from "@/types"

// Task hooks
export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await taskApi.get("/tasks")
      // Handle both { data: tasks } and direct array response
      return Array.isArray(response.data) ? response.data : (response.data?.data || []) as Task[]
    },
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const response = await taskApi.get(`/tasks/${id}`)
      return response.data as Task
    },
    enabled: !!id,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateTaskInput) => {
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
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateTaskInput & { id: string }) => {
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
  return useMutation({
    mutationFn: async (id: string) => {
      await taskApi.delete(`/tasks/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}

// Project hooks
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await projectApi.get("/projects")
      // Handle both { data: projects } and direct array response
      return Array.isArray(response.data) ? response.data : (response.data?.data || []) as Project[]
    },
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const response = await projectApi.get(`/projects/${id}`)
      return response.data as Project
    },
    enabled: !!id,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateProjectInput) => {
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
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateProjectInput & { id: string }) => {
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
  return useMutation({
    mutationFn: async (id: string) => {
      await projectApi.delete(`/projects/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}
