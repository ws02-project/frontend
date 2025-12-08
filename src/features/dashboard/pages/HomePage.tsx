import { useTasks, useProjects } from "@/hooks/useApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
// Tooltip, Avatar imports removed - not used in this component
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FolderKanban,
  CheckSquare,
  Clock,
  ArrowRight,
  Activity,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Bug,
  FileText,
  ArrowUpRight,
  Lightbulb,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Status indicator colors (lowercase to match backend)
const statusColors = {
  pending: "bg-slate-400",
  in_progress: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-400",
}

const priorityConfig = {
  low: { color: "text-slate-500", bg: "bg-slate-500/10" },
  medium: { color: "text-blue-500", bg: "bg-blue-500/10" },
  high: { color: "text-orange-500", bg: "bg-orange-500/10" },
  urgent: { color: "text-red-500", bg: "bg-red-500/10" },
}

export function HomePage() {
  const { data: tasks, isLoading: tasksLoading } = useTasks()
  const { data: projects, isLoading: projectsLoading } = useProjects()

  const taskStats = {
    total: tasks?.length || 0,
    todo: tasks?.filter((t) => t.status === "pending").length || 0,
    inProgress: tasks?.filter((t) => t.status === "in_progress").length || 0,
    done: tasks?.filter((t) => t.status === "completed").length || 0,
  }

  const projectStats = {
    total: projects?.length || 0,
    active: projects?.filter((p) => p.status === "active").length || 0,
  }

  const completionRate = taskStats.total > 0 ? Math.round((taskStats.done / taskStats.total) * 100) : 0

  const recentTasks = tasks?.slice(0, 4) || []
  const recentProjects = projects?.slice(0, 4) || []

  const isLoading = tasksLoading || projectsLoading

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back! 👋</h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/projects">
              <FolderKanban className="h-4 w-4 mr-2" />
              View Projects
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/tasks">
              <CheckSquare className="h-4 w-4 mr-2" />
              View Tasks
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Projects */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FolderKanban className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{projectStats.total}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="gap-1 text-green-600 bg-green-500/10 hover:bg-green-500/20">
                    <TrendingUp className="h-3 w-3" />
                    +12%
                  </Badge>
                  <span className="text-xs text-muted-foreground">{projectStats.active} active</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{taskStats.total}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="gap-1 text-green-600 bg-green-500/10 hover:bg-green-500/20">
                    <TrendingUp className="h-3 w-3" />
                    +8%
                  </Badge>
                  <span className="text-xs text-muted-foreground">{taskStats.inProgress} in progress</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{completionRate}%</div>
                <Progress value={completionRate} className="h-2 mt-3" />
                <span className="text-xs text-muted-foreground mt-2 block">
                  {taskStats.done} of {taskStats.total} completed
                </span>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Tasks
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{taskStats.todo}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="gap-1 text-orange-600 bg-orange-500/10 hover:bg-orange-500/20">
                    <TrendingDown className="h-3 w-3" />
                    -5%
                  </Badge>
                  <span className="text-xs text-muted-foreground">needs attention</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Tasks - Wider */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckSquare className="h-5 w-5 text-primary" />
                Recent Tasks
              </CardTitle>
              <CardDescription>Your latest task activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/tasks" className="gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentTasks.length > 0 ? (
                <div className="divide-y">
                  {recentTasks.map((task) => {
                    const type = (task as { type?: string }).type || "feature"
                    const typeIcons = {
                      feature: Sparkles,
                      bug: Bug,
                      documentation: FileText,
                      improvement: Lightbulb,
                    }
                    const TypeIcon = typeIcons[type as keyof typeof typeIcons] || Sparkles
                    const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium
                    
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group"
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                          priority.bg
                        )}>
                          <TypeIcon className={cn("h-5 w-5", priority.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{task.title}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1.5">
                              <div className={cn(
                                "h-2 w-2 rounded-full",
                                statusColors[task.status as keyof typeof statusColors] || "bg-slate-400"
                              )} />
                              <span className="text-xs text-muted-foreground capitalize">
                                {task.status.toLowerCase().replace("_", " ")}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {task.priority.toLowerCase()}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
                  <CheckSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No tasks yet</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link to="/tasks">Create your first task</Link>
                  </Button>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Projects - Narrower */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FolderKanban className="h-5 w-5 text-primary" />
                Recent Projects
              </CardTitle>
              <CardDescription>Your active projects</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/projects" className="gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg border space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : recentProjects.length > 0 ? (
                <div className="divide-y">
                  {recentProjects.map((project, index) => {
                    // Rotating colors for project icons
                    const iconColors = [
                      "bg-blue-500",
                      "bg-orange-400", 
                      "bg-red-400",
                      "bg-pink-400",
                      "bg-purple-500",
                      "bg-teal-500",
                    ]
                    const iconColor = iconColors[index % iconColors.length]
                    
                    // Status badge config
                    const statusBadge = {
                      active: { label: "Active", className: "bg-green-100 text-green-700 border-green-200" },
                      on_hold: { label: "On Hold", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                      completed: { label: "Completed", className: "bg-blue-100 text-blue-700 border-blue-200" },
                      archived: { label: "Archived", className: "bg-gray-100 text-gray-700 border-gray-200" },
                    }
                    const badge = statusBadge[project.status as keyof typeof statusBadge] || statusBadge.active
                    
                    return (
                      <div
                        key={project.id}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
                      >
                        {/* Colored icon */}
                        <div className={cn(
                          "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                          iconColor
                        )}>
                          <FolderKanban className="h-5 w-5 text-white" />
                        </div>
                        
                        {/* Project info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground truncate">
                              {project.name}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs font-medium shrink-0", badge.className)}
                            >
                              {badge.label}
                            </Badge>
                          </div>
                          {project.description && (
                            <p className="text-sm text-muted-foreground truncate mt-0.5">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
                  <FolderKanban className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No projects yet</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link to="/projects">Create your first project</Link>
                  </Button>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
