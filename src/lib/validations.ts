import { z } from "zod"

// Task validation schemas
export const taskStatusSchema = z.enum(["pending", "in_progress", "completed", "cancelled"])
export const taskPrioritySchema = z.enum(["low", "medium", "high", "urgent"])
export const taskTypeSchema = z.enum(["feature", "bug", "documentation", "improvement"])

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be less than 5000 characters"),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  type: taskTypeSchema.optional(),
  projectId: z.string().uuid("Invalid project ID").optional().or(z.literal("")).nullable(),
  assignedTo: z.string().uuid("Invalid user ID").optional().or(z.literal("")).nullable(),
})

export const updateTaskSchema = createTaskSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "At least one field must be provided"
)

// Project validation schemas
export const projectStatusSchema = z.enum(["active", "archived", "on_hold", "completed"])

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(255, "Project name must be less than 255 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be less than 5000 characters"),
  status: projectStatusSchema.optional(),
  owner: z.string().max(100, "Owner must be less than 100 characters").optional().or(z.literal("")),
  members: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

export const updateProjectSchema = createProjectSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "At least one field must be provided"
)

// Type exports for form data
export type CreateTaskFormData = z.infer<typeof createTaskSchema>
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>
export type CreateProjectFormData = z.infer<typeof createProjectSchema>
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>

