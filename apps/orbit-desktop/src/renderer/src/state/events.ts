import { openEventStream } from '../api/agentcore'
import type { AgentEvent } from '../api/types'
import { setSendingState, setSessionStatus } from './app-state'
import {
  appendDelta,
  appendSystemMessage,
  appendThinkingIndicator,
  endAssistantTurn,
  finalizeAssistantMessage,
  removeThinkingIndicator
} from './chat'

type EventOf<T extends AgentEvent['type']> = Extract<AgentEvent, { type: T }>

let eventSource: EventSource | null = null
let connectionToken = 0

function on<T extends AgentEvent['type']>(
  source: EventSource,
  type: T,
  handler: (event: EventOf<T>) => void
): void {
  source.addEventListener(type, (e) => handler(JSON.parse((e as MessageEvent<string>).data)))
}

export function disconnectEvents(): void {
  connectionToken++
  eventSource?.close()
  eventSource = null
}

export async function connectEvents(sessionId: string): Promise<void> {
  disconnectEvents()
  const token = connectionToken

  const source = await openEventStream(sessionId)

  if (token !== connectionToken) {
    source.close()
    return
  }

  eventSource = source

  on(source, 'agent.started', () => {
    setSessionStatus('running')
    setSendingState(true)
    endAssistantTurn()
    appendThinkingIndicator()
  })

  on(source, 'assistant.delta', (event) => {
    appendDelta(event.text)
  })

  on(source, 'assistant.message', (event) => {
    finalizeAssistantMessage(event.text, event.messageId)
    appendThinkingIndicator()
  })

  on(source, 'tool.completed', () => {
    appendThinkingIndicator()
  })

  on(source, 'permission.requested', () => {
    setSessionStatus('waiting_permission')
    setSendingState(true)
    endAssistantTurn()
  })

  on(source, 'agent.completed', () => {
    setSessionStatus('completed')
    setSendingState(false)
    endAssistantTurn()
    removeThinkingIndicator()
  })

  on(source, 'agent.cancelled', () => {
    setSessionStatus('cancelled')
    setSendingState(false)
    endAssistantTurn()
    appendSystemMessage('Execução cancelada.')
  })

  on(source, 'agent.error', (event) => {
    setSessionStatus('error')
    setSendingState(false)
    endAssistantTurn()
    appendSystemMessage(`Erro: ${event.message}`, true)
  })

  source.onerror = () => {
    console.warn('Conexão SSE perdida, tentando reconectar...')
  }
}
