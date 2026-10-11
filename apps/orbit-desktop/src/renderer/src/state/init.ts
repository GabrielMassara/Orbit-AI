import { createSession, getSession, loadAvailableAgents } from '../api/agentcore'
import { appState, setSendingState, syncStateFromSession } from './app-state'
import { clearMessages } from './chat'
import { connectEvents } from './events'
import { loadStoredSessionRef, saveState } from './persistence'

async function refreshAvailableAgents(): Promise<void> {
  appState.availableAgents = await loadAvailableAgents()

  if (!appState.availableAgents.some((a) => a.runtime === appState.currentRuntime)) {
    appState.currentRuntime = appState.availableAgents[0]!.runtime
  }
}

export async function init(): Promise<void> {
  appState.initError = null
  void refreshAvailableAgents()

  try {
    const stored = loadStoredSessionRef()
    let session = stored.sessionId ? await getSession(stored.sessionId) : null

    if (!session) {
      const projectPath = stored.projectPath ?? (await window.orbit.getDefaultProjectPath())
      session = await createSession(projectPath, appState.currentRuntime)
    }

    appState.session = session
    syncStateFromSession(session)
    saveState(session)
    clearMessages()
    setSendingState(session.status === 'running' || session.status === 'waiting_permission')
    await connectEvents(session.id)
  } catch (error) {
    appState.initError =
      error instanceof Error ? error.message : 'Não foi possível iniciar a sessão.'
  }
}
