import { reactive } from 'vue'
import type {
  AgentSession,
  AvailableAgent,
  CodexSandboxMode,
  PermissionMode,
  RuntimeName
} from '../api/types'

interface AppState {
  session: AgentSession | null
  currentModel: string
  currentRuntime: RuntimeName
  currentPermissionMode: PermissionMode
  currentCodexSandboxMode: CodexSandboxMode
  availableAgents: AvailableAgent[]
  isSending: boolean
  initError: string | null
}

export const appState = reactive<AppState>({
  session: null,
  currentModel: '',
  currentRuntime: 'claude',
  currentPermissionMode: 'default',
  currentCodexSandboxMode: 'workspace-write',
  availableAgents: [],
  isSending: false,
  initError: null
})

export function syncStateFromSession(session: AgentSession | null): void {
  appState.currentPermissionMode = session?.permissionMode ?? 'default'
  appState.currentCodexSandboxMode = session?.codexSandboxMode ?? 'workspace-write'
  appState.currentRuntime = session?.runtime ?? appState.currentRuntime
  appState.currentModel = session?.model ?? ''
}
