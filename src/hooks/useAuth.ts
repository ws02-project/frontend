import { useAuthContext } from "@asgardeo/auth-react"
import { useMemo, useState, useEffect } from "react"
import type { UserRole } from "@/types"
import { userApi, setAuthToken } from "@/services/api"

export interface AuthUser {
  id: string
  email: string
  displayName: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  role: UserRole
  roles: string[]
  groups: string[]
}

interface BackendUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  displayName?: string
  avatarUrl?: string
  role: string
  status: string
}

export interface UseAuthReturn {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  role: UserRole
  roles: string[]
  // Permission helpers
  isAdmin: boolean
  isUser: boolean
  canCreateProject: boolean
  canEditProject: boolean
  canDeleteProject: boolean
  canDeleteTask: boolean
  hasRole: (...roles: UserRole[]) => boolean
  // Auth actions
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  getAccessToken: () => Promise<string>
}

interface DecodedToken {
  sub?: string
  email?: string
  username?: string
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
  roles?: string | string[]
  groups?: string | string[]
  [key: string]: unknown
}

// Global cache to prevent multiple fetches across component instances
let globalBackendUser: BackendUser | null = null
let globalFetchPromise: Promise<BackendUser | null> | null = null

export function useAuth(): UseAuthReturn {
  const { state, signIn, signOut, getAccessToken, getIDToken, getDecodedIDToken } = useAuthContext()
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null)
  const [backendUser, setBackendUser] = useState<BackendUser | null>(globalBackendUser)

  useEffect(() => {
    if (!state.isAuthenticated) {
      setDecodedToken(null)
      setBackendUser(null)
      globalBackendUser = null
      globalFetchPromise = null
      return
    }

    // If we already have the user cached, use it
    if (globalBackendUser) {
      setBackendUser(globalBackendUser)
      getDecodedIDToken().then(token => setDecodedToken(token as DecodedToken)).catch(() => {})
      return
    }

    // If a fetch is already in progress, wait for it
    if (globalFetchPromise) {
      globalFetchPromise.then(user => {
        setBackendUser(user)
        getDecodedIDToken().then(token => setDecodedToken(token as DecodedToken)).catch(() => {})
      })
      return
    }

    // Start a new fetch
    globalFetchPromise = (async () => {
      try {
        const token = await getDecodedIDToken()
        setDecodedToken(token as DecodedToken)
        
        let accessToken: string
        try {
          const idToken = await getIDToken()
          accessToken = idToken || await getAccessToken()
        } catch {
          accessToken = await getAccessToken()
        }
        
        setAuthToken(userApi, accessToken)
        const response = await userApi.get<{ data: BackendUser }>("/users/me")
        globalBackendUser = response.data.data
        setBackendUser(globalBackendUser)
        return globalBackendUser
      } catch {
        setDecodedToken(null)
        setBackendUser(null)
        return null
      }
    })()
  }, [state.isAuthenticated, getDecodedIDToken, getIDToken, getAccessToken])

  const authData = useMemo(() => {
    if (!state.isAuthenticated) {
      return { user: null, role: "user" as UserRole, roles: [] as string[] }
    }

    const backendRole = (backendUser?.role?.toLowerCase() || "user") as UserRole

    let tokenRoles: string[] = []
    if (decodedToken?.roles) {
      tokenRoles = Array.isArray(decodedToken.roles) ? decodedToken.roles : [decodedToken.roles]
    } else if (decodedToken?.groups) {
      tokenRoles = Array.isArray(decodedToken.groups) ? decodedToken.groups : [decodedToken.groups]
    }
    const normalizedRoles = tokenRoles.map((r: string) => r.toLowerCase().trim())

    const user: AuthUser = {
      id: backendUser?.id || decodedToken?.sub || "",
      email: backendUser?.email || state.username || decodedToken?.email || "",
      displayName: backendUser?.displayName || state.displayName || decodedToken?.name || state.username || "",
      firstName: backendUser?.firstName || decodedToken?.given_name,
      lastName: backendUser?.lastName || decodedToken?.family_name,
      avatarUrl: backendUser?.avatarUrl || decodedToken?.picture,
      role: backendRole,
      roles: [backendRole, ...normalizedRoles],
      groups: normalizedRoles,
    }

    return { user, role: backendRole, roles: [backendRole, ...normalizedRoles] }
  }, [state.isAuthenticated, state.username, state.displayName, decodedToken, backendUser])

  const hasRole = (...allowedRoles: UserRole[]): boolean => allowedRoles.includes(authData.role)

  const isAdmin = authData.role === "admin"
  const isUser = authData.role === "user"
  const canCreateProject = isAdmin
  const canEditProject = isAdmin
  const canDeleteProject = isAdmin
  const canDeleteTask = isAdmin

  return {
    user: authData.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    role: authData.role,
    roles: authData.roles,
    isAdmin,
    isUser,
    canCreateProject,
    canEditProject,
    canDeleteProject,
    canDeleteTask,
    hasRole,
    signIn: async () => { await signIn() },
    signOut: async () => { await signOut() },
    getAccessToken: async () => {
      try {
        const idToken = await getIDToken()
        if (idToken) return idToken
      } catch {
        // Fallback to access token
      }
      return await getAccessToken()
    },
  }
}

export default useAuth
