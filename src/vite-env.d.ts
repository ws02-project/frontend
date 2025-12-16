/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ASGARDEO_CLIENT_ID: string
  readonly VITE_ASGARDEO_BASE_URL: string
  readonly VITE_REDIRECT_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_USER_SERVICE_URL: string
  readonly VITE_TASK_SERVICE_URL: string
  readonly VITE_PROJECT_SERVICE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}







