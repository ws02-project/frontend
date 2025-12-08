import { useState, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, useTasks } from "@/hooks/useApi"
import { createProjectSchema, type CreateProjectFormData } from "@/lib/validations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  FolderKanban,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
  Users,
  ExternalLink,
  Grid3X3,
  List,
  Search,
  SlidersHorizontal,
  XCircle,
  CheckCircle,
  PauseCircle,
  Archive,
  Tag,
} from "lucide-react"
import { toast } from "sonner"
import type { Project, ProjectStatus } from "@/types"
import { cn } from "@/lib/utils"

// Status config (lowercase to match backend)
const statusConfig: Record<ProjectStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  active: { label: "Active", icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  on_hold: { label: "On Hold", icon: PauseCircle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
  archived: { label: "Archived", icon: Archive, color: "text-slate-500", bg: "bg-slate-500/10" },
}

// Color palette for random project colors
const projectColors = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-400",
  "from-green-500 to-emerald-400",
  "from-orange-500 to-amber-400",
  "from-red-500 to-rose-400",
  "from-indigo-500 to-violet-400",
]

export function ProjectsPage() {
  const { data: projects, isLoading, error } = useProjects()
  const { data: tasks } = useTasks()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()

  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // Calculate project progress based on tasks
  const projectProgress = useMemo(() => {
    const progressMap = new Map<string, number>()
    if (!tasks || !projects) return progressMap

    projects.forEach((project) => {
      const projectTasks = tasks.filter((task) => task.projectId === project.id)
      if (projectTasks.length === 0) {
        progressMap.set(project.id, 0)
      } else {
        const completedTasks = projectTasks.filter((task) => task.status === "completed").length
        const progress = Math.round((completedTasks / projectTasks.length) * 100)
        progressMap.set(project.id, progress)
      }
    })

    return progressMap
  }, [tasks, projects])

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const handleCreate = async (data: CreateProjectFormData) => {
    try {
      await createProject.mutateAsync(data)
      toast.success("Project created successfully")
      setIsCreateOpen(false)
    } catch {
      toast.error("Failed to create project")
    }
  }

  const handleUpdate = async (data: CreateProjectFormData) => {
    if (!editingProject) return
    try {
      await updateProject.mutateAsync({ id: editingProject.id, ...data })
      toast.success("Project updated successfully")
      setEditingProject(null)
    } catch {
      toast.error("Failed to update project")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id)
      toast.success("Project deleted successfully")
    } catch {
      toast.error("Failed to delete project")
    }
  }

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
  }

  const getProjectColor = (id: string) => {
    const index = id.charCodeAt(0) % projectColors.length
    return projectColors[index]
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to load projects</h2>
        <p className="text-muted-foreground mb-4">Please make sure the project service is running.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and organize your projects.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to your workspace.</DialogDescription>
            </DialogHeader>
            <ProjectForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateOpen(false)}
              isLoading={createProject.isPending}
              submitLabel="Create Project"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ProjectStatus | "all")}>
            <SelectTrigger className="w-[140px]">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <config.icon className={cn("h-4 w-4", config.color)} />
                    {config.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex rounded-lg border p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = projects?.filter((p) => p.status === key).length || 0
          return (
            <Card key={key} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setStatusFilter(key as ProjectStatus)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 rounded-lg", config.bg)}>
                    <config.icon className={cn("h-5 w-5", config.color)} />
                  </div>
                  <span className="text-2xl font-bold">{isLoading ? "-" : count}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{config.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Projects Grid/List */}
      {isLoading ? (
        <div className={cn("grid gap-4", viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <FolderKanban className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first project"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const config = statusConfig[project.status as ProjectStatus] || statusConfig.active
            const progress = projectProgress.get(project.id) || 0
            return (
              <Card key={project.id} className="group hover:shadow-lg hover:border-primary/30 transition-all duration-200">
                {/* Gradient header */}
                <div className={cn("h-2 w-full rounded-t-lg bg-gradient-to-r", getProjectColor(project.id))} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      {project.description && (
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEditDialog(project)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={cn("gap-1.5", config.color)}>
                      <config.icon className="h-3.5 w-3.5" />
                      {config.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {progress}% complete
                    </span>
                  </div>

                  {/* Progress */}
                  <Progress value={progress} className="h-1.5" />

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="border-t pt-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(project.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex -space-x-2">
                      {(project.members || []).slice(0, 3).map((member: string, i: number) => (
                        <Tooltip key={i}>
                          <TooltipTrigger>
                            <Avatar className="h-7 w-7 border-2 border-background">
                              <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                {member.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>{member}</TooltipContent>
                        </Tooltip>
                      ))}
                      {(project.members?.length || 0) > 3 && (
                        <Avatar className="h-7 w-7 border-2 border-background">
                          <AvatarFallback className="text-[10px] bg-muted">
                            +{(project.members?.length || 0) - 3}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {(!project.members || project.members.length === 0) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          No members
                        </div>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        // List View
        <Card>
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {filteredProjects.map((project) => {
                const config = statusConfig[project.status as ProjectStatus] || statusConfig.active
                const progress = projectProgress.get(project.id) || 0
                return (
                  <div key={project.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group">
                    <div className={cn("h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center", getProjectColor(project.id))}>
                      <FolderKanban className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold truncate">{project.name}</h4>
                        <Badge variant="outline" className={cn("gap-1 text-xs", config.color)}>
                          <config.icon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{project.description || "No description"}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(project)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Make changes to your project.</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <ProjectForm
              defaultValues={{
                name: editingProject.name,
                description: editingProject.description || "",
                status: editingProject.status,
                tags: editingProject.tags || [],
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingProject(null)}
              isLoading={updateProject.isPending}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Project Form Component
function ProjectForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel,
}: {
  defaultValues?: Partial<CreateProjectFormData>
  onSubmit: (data: CreateProjectFormData) => void
  onCancel: () => void
  isLoading: boolean
  submitLabel: string
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      status: "active",
      tags: [],
    },
  })

  const [tagInput, setTagInput] = useState("")
  const tags = watch("tags") || []

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()], { shouldValidate: true })
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue("tags", tags.filter((t: string) => t !== tagToRemove), { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter project name"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Enter project description"
            rows={3}
            className={errors.description ? "border-destructive" : ""}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status" className={errors.status ? "border-destructive" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className={cn("h-4 w-4", config.color)} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              <Tag className="h-4 w-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {errors.tags && (
            <p className="text-sm text-destructive">{errors.tags.message}</p>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}
