import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@asgardeo/auth-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { authConfig } from "@/config/auth"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { HomePage } from "@/features/dashboard/pages/HomePage"
import { TasksPage } from "@/features/tasks/pages/TasksPage"
import { ProjectsPage } from "@/features/projects/pages/ProjectsPage"
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute"
import { MainLayout } from "@/components/layout/MainLayout"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="taskflow-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider config={authConfig}>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <HomePage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tasks"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <TasksPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ProjectsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
            <Toaster position="top-right" />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
