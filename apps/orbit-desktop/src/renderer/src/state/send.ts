import { cancelSessionApi, sendMessageApi } from '../api/agentcore'
import { ApiError, getApiBaseUrl } from '../api/client'
import { appState } from './app-state'
import { appendSystemMessage, appendUserMessage } from './chat'

async function describeFailure(error: unknown, fallback: string): Promise<string> {
  if (error instanceof ApiError) return error.message
  const baseUrl = await getApiBaseUrl().catch(() => null)
  return baseUrl ? `${fallback} A API está rodando em ${baseUrl}?` : fallback
}

export async function sendMessage(text: string): Promise<void> {
  const session = appState.session
  const content = text.trim()
  if (appState.isSending || !session || !content) return

  appendUserMessage(content)

  try {
    await sendMessageApi(session.id, content)
  } catch (error) {
    appendSystemMessage(await describeFailure(error, 'Não foi possível falar com a API.'), true)
  }
}

export async function cancelCurrentExecution(): Promise<void> {
  const session = appState.session
  if (!session) return

  try {
    await cancelSessionApi(session.id)
  } catch (error) {
    appendSystemMessage(await describeFailure(error, 'Não foi possível cancelar.'), true)
  }
}
