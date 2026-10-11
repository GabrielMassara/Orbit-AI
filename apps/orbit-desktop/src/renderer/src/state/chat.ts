import { reactive } from 'vue'

export type ChatMessage =
  | { id: number; kind: 'user'; text: string; messageId?: string }
  | { id: number; kind: 'assistant'; text: string; streaming: boolean; messageId?: string }
  | { id: number; kind: 'system'; text: string; error: boolean }
  | { id: number; kind: 'thinking' }

type AssistantMessage = Extract<ChatMessage, { kind: 'assistant' }>

export const messages = reactive<ChatMessage[]>([])

let nextId = 1
let currentAssistantId: number | null = null

function currentAssistant(): AssistantMessage | null {
  if (currentAssistantId === null) return null
  const found = messages.find((m) => m.id === currentAssistantId)
  return found?.kind === 'assistant' ? found : null
}

export function removeThinkingIndicator(): void {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]!.kind === 'thinking') messages.splice(i, 1)
  }
}

export function appendThinkingIndicator(): void {
  removeThinkingIndicator()
  messages.push({ id: nextId++, kind: 'thinking' })
}

export function appendUserMessage(text: string, messageId?: string): void {
  removeThinkingIndicator()
  messages.push({ id: nextId++, kind: 'user', text, messageId })
}

export function appendSystemMessage(text: string, isError = false): void {
  removeThinkingIndicator()
  messages.push({ id: nextId++, kind: 'system', text, error: isError })
}

export function beginAssistantMessage(): AssistantMessage {
  removeThinkingIndicator()
  const id = nextId++
  messages.push({ id, kind: 'assistant', text: '', streaming: true })
  currentAssistantId = id
  return currentAssistant()!
}

export function appendDelta(text: string): void {
  const target = currentAssistant() ?? beginAssistantMessage()
  target.text += text
}

export function finalizeAssistantMessage(fullText: string, messageId?: string): void {
  const target = currentAssistant() ?? beginAssistantMessage()
  target.text = fullText
  target.streaming = false
  target.messageId = messageId
  currentAssistantId = null
}

export function endAssistantTurn(): void {
  const target = currentAssistant()
  if (target) target.streaming = false
  currentAssistantId = null
}

export function clearMessages(): void {
  messages.splice(0, messages.length)
  currentAssistantId = null
}
