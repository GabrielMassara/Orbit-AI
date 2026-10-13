import { reactive } from 'vue'
import type { TodoItemStatus } from '../api/types'

export type PermissionAction = 'approve' | 'reject'

export type ChatMessage =
  | { id: number; kind: 'user'; text: string; messageId?: string }
  | { id: number; kind: 'assistant'; text: string; streaming: boolean; messageId?: string }
  | { id: number; kind: 'system'; text: string; error: boolean }
  | { id: number; kind: 'thinking' }
  | { id: number; kind: 'tool'; tool: string; done: boolean }
  | { id: number; kind: 'todo'; items: { text: string; status: TodoItemStatus }[] }
  | {
      id: number
      kind: 'permission'
      permissionId: string
      tool: string
      description: string
      pending: boolean
      resolution: PermissionAction | null
    }

type AssistantMessage = Extract<ChatMessage, { kind: 'assistant' }>
type ToolMessage = Extract<ChatMessage, { kind: 'tool' }>
type PermissionMessage = Extract<ChatMessage, { kind: 'permission' }>

export const messages = reactive<ChatMessage[]>([])

let nextId = 1
let currentAssistantId: number | null = null
let currentTodoId: number | null = null

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

// O plano é reescrito inteiro a cada evento: dentro de um turno só existe um card, e ele é
// atualizado no lugar. Um novo turno (agent.started) começa um card novo.
export function startNewTurn(): void {
  endAssistantTurn()
  currentTodoId = null
}

export function appendToolStarted(tool: string): void {
  removeThinkingIndicator()
  endAssistantTurn()
  messages.push({ id: nextId++, kind: 'tool', tool, done: false })
}

export function appendToolCompleted(tool: string): void {
  const running = messages.filter((m): m is ToolMessage => m.kind === 'tool' && !m.done)
  const found = running.findLast((m) => m.tool === tool) ?? running.at(-1)
  if (found) found.done = true
}

export function renderTodoList(items: { text: string; status: TodoItemStatus }[]): void {
  removeThinkingIndicator()
  endAssistantTurn()

  const existing =
    currentTodoId === null ? undefined : messages.find((m) => m.id === currentTodoId)

  if (existing?.kind === 'todo') {
    existing.items = items
    return
  }

  currentTodoId = nextId++
  messages.push({ id: currentTodoId, kind: 'todo', items })
}

export function appendPermissionRequest(
  permissionId: string,
  tool: string,
  description: string
): void {
  removeThinkingIndicator()
  endAssistantTurn()
  messages.push({
    id: nextId++,
    kind: 'permission',
    permissionId,
    tool,
    description,
    pending: false,
    resolution: null
  })
}

export function findPermission(permissionId: string): PermissionMessage | undefined {
  return messages.find(
    (m): m is PermissionMessage => m.kind === 'permission' && m.permissionId === permissionId
  )
}

export function setPermissionCardButtonsDisabled(permissionId: string, disabled: boolean): void {
  const card = findPermission(permissionId)
  if (card) card.pending = disabled
}

export function markPermissionResolved(permissionId: string, action: PermissionAction): void {
  const card = findPermission(permissionId)
  if (!card) return
  card.pending = false
  card.resolution = action
}

export function clearMessages(): void {
  messages.splice(0, messages.length)
  currentAssistantId = null
  currentTodoId = null
}
