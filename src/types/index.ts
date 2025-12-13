// Task Types - aligned with backend
export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  type?: TaskType
  projectId?: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled"
export type TaskPriority = "low" | "medium" | "high" | "urgent"
export type TaskType = "feature" | "bug" | "documentation" | "improvement"

export interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  type?: TaskType
  projectId?: string
  assignedTo?: string
}

export type UpdateTaskInput = Partial<CreateTaskInput>

// Project Types - aligned with backend
export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  owner?: string
  members?: string[]
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export type ProjectStatus = "active" | "archived" | "on_hold" | "completed"

export interface CreateProjectInput {
  name: string
  description?: string
  status?: ProjectStatus
  owner?: string
  members?: string[]
  tags?: string[]
}

export type UpdateProjectInput = Partial<CreateProjectInput>

// User Types
export interface User {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type UserRole = "USER" | "ADMIN"

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
