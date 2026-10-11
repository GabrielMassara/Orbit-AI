import { createSession, getSession, loadAvailableAgents } from '../api/agentcore'
import { appState } from './app-state'
import { connectEvents } from './events'
import { loadStoredSessionRef } from './persistence'
import { activateSession, loadRecentSessions, loadSessionHistory } from './sessions'

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

    activateSession(session)
    await loadSessionHistory(session.id)
    await connectEvents(session.id)
    void loadRecentSessions()
  } catch (error) {
    appState.initError =
      error instanceof Error ? error.message : 'Não foi possível iniciar a sessão.'
  }
}
