import { ref } from 'vue'
import {
  createSession,
  deleteSessionApi,
  getSession,
  getSessionHistory,
  listSessions,
  renameSessionApi,
  setModelApi,
  tagSessionApi
} from '../api/agentcore'
import type { AgentSession, RuntimeName } from '../api/types'
import { appState, setSendingState, syncStateFromSession } from './app-state'
import {
  appendSystemMessage,
  appendUserMessage,
  clearMessages,
  finalizeAssistantMessage
} from './chat'
import { confirmDialog, promptDialog } from './dialogs'
import { connectEvents, disconnectEvents } from './events'
import { saveState } from './persistence'
import { showToast } from './toasts'
import { closeSidebarOnMobile } from './ui'

export const recentSessions = ref<AgentSession[]>([])

let transitionToken = 0

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}

export function sessionLabel(session: AgentSession): string {
  if (session.title) return session.title

  const parts = (session.projectPath || '').split(/[\\/]/).filter(Boolean)
  return parts.at(-1) ?? (session.projectPath || 'Sessão sem nome')
}

export async function loadRecentSessions(): Promise<void> {
  recentSessions.value = await listSessions()
}

export function activateSession(session: AgentSession): void {
  appState.session = session
  syncStateFromSession(session)
  saveState(session)
  setSendingState(session.status === 'running' || session.status === 'waiting_permission')
}

export async function loadSessionHistory(sessionId: string): Promise<void> {
  const events = await getSessionHistory(sessionId)

  const session = appState.session
  if (!session || session.id !== sessionId) return

  clearMessages()

  if (!events.length && session.providerSessionId) {
    appendSystemMessage(
      'Não foi possível carregar o histórico desta conversa. Tente novamente.',
      true
    )
    return
  }

  for (const event of events) {
    if (event.type === 'user.message') appendUserMessage(event.text, event.messageId)
    else if (event.type === 'assistant.message')
      finalizeAssistantMessage(event.text, event.messageId)
  }
}

export async function startSession(
  runtime: RuntimeName,
  model = ''
): Promise<AgentSession | null> {
  const current = appState.session
  if (!current) return null

  const token = ++transitionToken

  const session = await createSession(current.projectPath, runtime)
  if (model) {
    await setModelApi(session.id, model)
    session.model = model
  }
  if (token !== transitionToken) return null

  activateSession(session)
  clearMessages()
  await connectEvents(session.id)
  void loadRecentSessions()
  closeSidebarOnMobile()
  return session
}

export async function newChat(): Promise<void> {
  const current = appState.session
  if (!current) return

  try {
    await startSession(current.runtime)
  } catch (error) {
    showToast({
      title: 'Não foi possível criar uma nova conversa',
      message: errorMessage(error, 'Falha ao criar a sessão.'),
      variant: 'error'
    })
  }
}

export async function switchSession(sessionId: string): Promise<void> {
  const current = appState.session
  if (!current || sessionId === current.id) {
    closeSidebarOnMobile()
    return
  }

  const token = ++transitionToken
  const target = await getSession(sessionId)
  if (token !== transitionToken) return

  if (!target) {
    showToast({ title: 'Não foi possível carregar essa conversa', variant: 'error' })
    return
  }

  disconnectEvents()
  activateSession(target)
  await loadSessionHistory(target.id)
  if (token !== transitionToken) return

  await connectEvents(target.id)
  void loadRecentSessions()
  closeSidebarOnMobile()
}

export async function handleDeleteSession(sessionId: string): Promise<void> {
  const confirmed = await confirmDialog({
    title: 'Excluir conversa',
    message: 'Excluir esta conversa? Essa ação não pode ser desfeita.',
    confirmLabel: 'Excluir',
    danger: true
  })
  if (!confirmed) return

  try {
    await deleteSessionApi(sessionId)
  } catch (error) {
    showToast({
      title: 'Não foi possível excluir a conversa',
      message: errorMessage(error, 'Falha ao excluir a conversa.'),
      variant: 'error'
    })
    return
  }

  if (appState.session?.id === sessionId) await newChat()
  else await loadRecentSessions()
}

export async function handleRenameSession(sessionId: string, currentLabel: string): Promise<void> {
  const input = await promptDialog({
    title: 'Renomear conversa',
    label: 'Novo nome da conversa',
    initialValue: currentLabel,
    confirmLabel: 'Renomear'
  })

  const title = input?.trim()
  if (!title || title === currentLabel) return

  let updated: AgentSession
  try {
    updated = await renameSessionApi(sessionId, title)
  } catch (error) {
    showToast({
      title: 'Não foi possível renomear a conversa',
      message: errorMessage(error, 'Falha ao renomear a conversa.'),
      variant: 'error'
    })
    return
  }

  if (appState.session?.id === sessionId) appState.session.title = updated.title
  await loadRecentSessions()
}

export async function handleTagSession(sessionId: string, currentTag?: string): Promise<void> {
  const input = await promptDialog({
    title: 'Tag da conversa',
    label: 'Deixe em branco para remover',
    initialValue: currentTag ?? '',
    confirmLabel: 'Salvar',
    allowEmpty: true
  })
  if (input === null) return

  const nextTag = input.trim() || null
  if (nextTag === (currentTag || null)) return

  let updated: AgentSession
  try {
    updated = await tagSessionApi(sessionId, nextTag)
  } catch (error) {
    showToast({
      title: 'Não foi possível marcar a tag',
      message: errorMessage(error, 'Falha ao salvar a tag.'),
      variant: 'error'
    })
    return
  }

  if (appState.session?.id === sessionId) appState.session.tag = updated.tag
  await loadRecentSessions()
}
