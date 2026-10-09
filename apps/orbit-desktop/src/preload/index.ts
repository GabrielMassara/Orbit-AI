import { contextBridge, ipcRenderer } from 'electron'

const orbit = {
  getApiBaseUrl: (): Promise<string> => ipcRenderer.invoke('orbit:get-api-base-url'),
  getDefaultProjectPath: (): Promise<string> => ipcRenderer.invoke('orbit:get-default-project-path')
}

contextBridge.exposeInMainWorld('orbit', orbit)
