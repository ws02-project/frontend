import { useState, useMemo, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useTasks, useProjects, useCreateTask, useUpdateTask, useDeleteTask, useUsers } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { createTaskSchema, type CreateTaskFormData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  ArrowUpDown,
  Circle,
  CheckCircle2,
  XCircle,
  Timer,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  AlertTriangle,
  PlusCircle,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Bug,
  Sparkles,
  Lightbulb,
  Copy,
} from "lucide-react"
import { toast } from "sonner"
import type { Project, Task, TaskStatus, TaskPriority, TaskType, User } from "@/types"

// Status config with icons and colors (lowercase to match backend)
const statusConfig: Record<TaskStatus, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "Pending", icon: Circle, color: "text-slate-500" },
  in_progress: { label: "In Progress", icon: Timer, color: "text-blue-500" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-green-500" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-500" },
}

// Priority config with icons (lowercase to match backend)
const priorityConfig: Record<TaskPriority, { label: string; icon: React.ElementType; color: string }> = {
  low: { label: "Low", icon: ArrowDown, color: "text-slate-500" },
  medium: { label: "Medium", icon: ArrowRight, color: "text-blue-500" },
  high: { label: "High", icon: ArrowUp, color: "text-orange-500" },
  urgent: { label: "Urgent", icon: AlertTriangle, color: "text-red-500" },
}

// Task type config (lowercase to match backend)
const typeConfig: Record<TaskType, { label: string; icon: React.ElementType; color: string }> = {
  feature: { label: "Feature", icon: Sparkles, color: "text-purple-500 bg-purple-500/10" },
  bug: { label: "Bug", icon: Bug, color: "text-red-500 bg-red-500/10" },
  documentation: { label: "Docs", icon: FileText, color: "text-blue-500 bg-blue-500/10" },
  improvement: { label: "Improvement", icon: Lightbulb, color: "text-yellow-500 bg-yellow-500/10" },
}

export function TasksPage() {
  const { data: tasks, isLoading, error } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const { canDeleteTask } = useAuth()
  const { data: projects } = useProjects()
  const { data: users } = useUsers()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleDelete = useCallback(async (id: string) => {
    if (!canDeleteTask) {
      toast.error("You don't have permission to delete tasks")
      return
    }
    try {
      await deleteTask.mutateAsync(id)
      toast.success("Task deleted successfully")
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } }
      if (error.response?.status === 403) {
        toast.error("You don't have permission to delete tasks")
      } else {
        toast.error("Failed to delete task")
      }
    }
  }, [deleteTask, canDeleteTask])

  const openEditDialog = useCallback((task: Task) => {
    setEditingTask(task)
  }, [])

  const columns: ColumnDef<Task>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: "Task",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.id?.slice(0, 8).toUpperCase()}
          </span>
        ),
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const type = row.original.type || "feature"
          const config = typeConfig[type as TaskType] || typeConfig.feature
          const TypeIcon = config.icon
          return (
            <div className="flex items-center gap-2 max-w-[400px]">
              <Badge variant="outline" className={`shrink-0 gap-1 ${config.color}`}>
                <TypeIcon className="h-3 w-3" />
                {config.label}
              </Badge>
              <span className="truncate font-medium">{row.getValue("title")}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) => {
          const assignedTo = row.original.assignedTo
          if (!assignedTo) {
            return <span className="text-muted-foreground text-sm">Unassigned</span>
          }
          const assignedUser = users?.find((u: User) => u.id === assignedTo)
          if (!assignedUser) {
            return <span className="text-muted-foreground text-sm">Unknown</span>
          }
          // Display name or username (part before @)
          const displayText = assignedUser.displayName || assignedUser.email.split('@')[0]
          return (
            <div className="flex items-center gap-2">
              {assignedUser.avatarUrl && (
                <img
                  src={assignedUser.avatarUrl}
                  alt={displayText}
                  className="h-6 w-6 rounded-full"
                />
              )}
              <span className="text-sm">{displayText}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as TaskStatus
          const config = statusConfig[status] || statusConfig.pending
          const StatusIcon = config.icon
          return (
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${config.color}`} />
              <span>{config.label}</span>
            </div>
          )
        },
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id) as string),
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
            Priority
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const priority = row.getValue("priority") as TaskPriority
          const config = priorityConfig[priority] || priorityConfig.medium
          const PriorityIcon = config.icon
          return (
            <div className={`flex items-center gap-2 ${config.color}`}>
              <PriorityIcon className="h-4 w-4" />
              <span>{config.label}</span>
            </div>
          )
        },
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id) as string),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const task = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(task.id); toast.success("Task ID copied"); }}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openEditDialog(task)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                {canDeleteTask && (
                  <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [handleDelete, openEditDialog, canDeleteTask, users]
  )

  const table = useReactTable({
    data: tasks || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })



  const handleCreate = async (data: CreateTaskFormData) => {
    try {
      // Convert empty/null values to undefined for API compatibility
      const taskData = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        type: data.type,
        projectId: data.projectId || undefined,
        assignedTo: data.assignedTo || undefined,
      }
      await createTask.mutateAsync(taskData)
      toast.success("Task created successfully")
      setIsCreateOpen(false)
    } catch {
      toast.error("Failed to create task")
    }
  }

  const handleUpdate = async (data: CreateTaskFormData) => {
    if (!editingTask) return
    try {
      // Convert empty/null values to undefined for API compatibility
      const taskData = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        type: data.type,
        projectId: data.projectId || undefined,
        assignedTo: data.assignedTo || undefined,
      }
      await updateTask.mutateAsync({ id: editingTask.id, ...taskData })
      toast.success("Task updated successfully")
      setEditingTask(null)
    } catch {
      toast.error("Failed to update task")
    }
  }


  const statuses = Object.keys(statusConfig) as TaskStatus[]
  const priorities = Object.keys(priorityConfig) as TaskPriority[]

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to load tasks</h2>
        <p className="text-muted-foreground mb-4">Please make sure the task service is running.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">Here's a list of your tasks for this month.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <Input
            placeholder="Filter tasks..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
            className="h-9 w-[200px]"
          />

          {/* Status Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-dashed">
                <PlusCircle className="mr-2 h-4 w-4" />
                Status
                {(table.getColumn("status")?.getFilterValue() as string[] | undefined)?.length ? (
                  <Badge variant="secondary" className="ml-2">{(table.getColumn("status")?.getFilterValue() as string[]).length}</Badge>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2" align="start">
              <div className="space-y-1">
                {statuses.map((status) => {
                  const config = statusConfig[status]
                  const StatusIcon = config.icon
                  const filterValue = (table.getColumn("status")?.getFilterValue() as string[]) || []
                  const isSelected = filterValue.includes(status)
                  return (
                    <div
                      key={status}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer"
                      onClick={() => {
                        const newValue = isSelected ? filterValue.filter((v) => v !== status) : [...filterValue, status]
                        table.getColumn("status")?.setFilterValue(newValue.length ? newValue : undefined)
                      }}
                    >
                      <Checkbox checked={isSelected} />
                      <StatusIcon className={`h-4 w-4 ${config.color}`} />
                      <span className="text-sm">{config.label}</span>
                    </div>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Priority Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-dashed">
                <PlusCircle className="mr-2 h-4 w-4" />
                Priority
                {(table.getColumn("priority")?.getFilterValue() as string[] | undefined)?.length ? (
                  <Badge variant="secondary" className="ml-2">{(table.getColumn("priority")?.getFilterValue() as string[]).length}</Badge>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2" align="start">
              <div className="space-y-1">
                {priorities.map((priority) => {
                  const config = priorityConfig[priority]
                  const PriorityIcon = config.icon
                  const filterValue = (table.getColumn("priority")?.getFilterValue() as string[]) || []
                  const isSelected = filterValue.includes(priority)
                  return (
                    <div
                      key={priority}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer"
                      onClick={() => {
                        const newValue = isSelected ? filterValue.filter((v) => v !== priority) : [...filterValue, priority]
                        table.getColumn("priority")?.setFilterValue(newValue.length ? newValue : undefined)
                      }}
                    >
                      <Checkbox checked={isSelected} />
                      <PriorityIcon className={`h-4 w-4 ${config.color}`} />
                      <span className="text-sm">{config.label}</span>
                    </div>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>

          {((table.getColumn("status")?.getFilterValue() as string[] | undefined)?.length || (table.getColumn("priority")?.getFilterValue() as string[] | undefined)?.length) ? (
            <Button variant="ghost" size="sm" onClick={() => { table.getColumn("status")?.setFilterValue(undefined); table.getColumn("priority")?.setFilterValue(undefined); }}>
              Reset <X className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><SlidersHorizontal className="mr-2 h-4 w-4" />View</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task to your list.</DialogDescription>
              </DialogHeader>
              <TaskForm
                projects={projects}
                users={users}
                onSubmit={handleCreate}
                onCancel={() => setIsCreateOpen(false)}
                isLoading={createTask.isPending}
                submitLabel="Create"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (<TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No tasks found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page</span>
            <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
              <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
              <SelectContent>{[10, 20, 30, 50].map((size) => (<SelectItem key={size} value={`${size}`}>{size}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="text-sm">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Make changes to your task.</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              projects={projects}
              users={users}
              defaultValues={{
                title: editingTask.title,
                description: editingTask.description || "",
                status: editingTask.status,
                priority: editingTask.priority,
                type: editingTask.type || "feature",
                projectId: editingTask.projectId || "",
                assignedTo: editingTask.assignedTo || "",
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTask(null)}
              isLoading={updateTask.isPending}
              submitLabel="Save"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Task Form Component
function TaskForm({
  projects,
  users,
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel
}: {
  projects?: Project[]
  users?: User[]
  defaultValues?: Partial<CreateTaskFormData>
  onSubmit: (data: CreateTaskFormData) => void
  onCancel: () => void
  isLoading: boolean
  submitLabel: string
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      type: "feature",
      projectId: "",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter task title"
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Enter description"
            rows={3}
            className={errors.description ? "border-destructive" : ""}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="project">Project</Label>
          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "none"}
                onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
              >
                <SelectTrigger id="project" className={errors.projectId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground">No project</span>
                  </SelectItem>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.projectId && (
            <p className="text-sm text-destructive">{errors.projectId.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="assignedTo">Assign To</Label>
          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "none"}
                onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
              >
                <SelectTrigger id="assignedTo" className={errors.assignedTo ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a user (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground">Unassigned</span>
                  </SelectItem>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        {user.avatarUrl && (
                          <img src={user.avatarUrl} alt={user.displayName} className="h-5 w-5 rounded-full" />
                        )}
                        <span>{user.displayName || user.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.assignedTo && (
            <p className="text-sm text-destructive">{errors.assignedTo.message}</p>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="type" className={errors.type ? "border-destructive" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <config.icon className="h-4 w-4" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
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
                          <config.icon className={`h-4 w-4 ${config.color}`} />
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
            <Label htmlFor="priority">Priority</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="priority" className={errors.priority ? "border-destructive" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className={`flex items-center gap-2 ${config.color}`}>
                          <config.icon className="h-4 w-4" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-sm text-destructive">{errors.priority.message}</p>
            )}
          </div>
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
