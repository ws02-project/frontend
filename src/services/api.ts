import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { apiConfig } from "@/config/auth"

// Create axios instances for each service
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      // Token will be added by the useApi hook
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized - could trigger logout
        console.error("Unauthorized request")
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export const taskApi = createApiInstance(apiConfig.taskServiceUrl)
export const projectApi = createApiInstance(apiConfig.projectServiceUrl)
export const userApi = createApiInstance(apiConfig.userServiceUrl)

// Helper to set auth token for requests
export const setAuthToken = (api: AxiosInstance, token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

// Generic API request helper
export const apiRequest = async <T>(
  api: AxiosInstance,
  config: AxiosRequestConfig
): Promise<T> => {
  const response = await api.request<T>(config)
  return response.data
}

