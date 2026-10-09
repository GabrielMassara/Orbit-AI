/// <reference types="vite/client" />

interface Window {
  orbit: {
    getApiBaseUrl(): Promise<string>
    getDefaultProjectPath(): Promise<string>
  }
}
