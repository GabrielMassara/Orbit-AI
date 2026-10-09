
export type RuntimeName = 'claude' | 'codex' | 'opencode'

export type SessionStatus =
  'ready' | 'running' | 'waiting_permission' | 'completed' | 'cancelled' | 'error'

export type PermissionMode =
  'default' | 'acceptEdits' | 'bypassPermissions' | 'plan' | 'dontAsk' | 'auto'

export type CodexSandboxMode = 'read-only' | 'workspace-write' | 'danger-full-access'
export type CodexReasoningEffort = 'minimal' | 'low' | 'medium' | 'high' | 'xhigh'
export type CodexWebSearchMode = 'disabled' | 'cached' | 'live'
export type ClaudeEffortLevel = 'low' | 'medium' | 'high' | 'xhigh'

export interface AgentSession {
  id: string
  runtime: RuntimeName
  projectPath: string
  providerSessionId?: string
  status: SessionStatus
  createdAt: string
  title?: string
  forkedFrom?: string
  forkedFromMessageId?: string
  tag?: string
  permissionMode?: PermissionMode
  claudeDeniedTools?: string[]
  claudeEffortLevel?: ClaudeEffortLevel
  codexSandboxMode?: CodexSandboxMode
  codexReasoningEffort?: CodexReasoningEffort
  codexWebSearchMode?: CodexWebSearchMode
  codexWebSearchEnabled?: boolean
  codexAdditionalDirectories?: string[]
  model?: string
}

export interface SessionList {
  sessions: AgentSession[]
  total: number
  limit: number
  offset: number
}

export interface AgentModel {
  id: string
  displayName: string
  description?: string
}

export interface AvailableAgent {
  runtime: RuntimeName
  models: AgentModel[]
}

export interface UserMessageAttachment {
  mediaType: string
  data: string
  kind: 'image' | 'document'
  filename?: string
}

export type TodoItemStatus = 'pending' | 'in_progress' | 'completed'

export type AgentEvent =
  | { type: 'agent.started'; sessionId: string }
  | {
      type: 'user.message'
      sessionId: string
      text: string
      messageId?: string
      attachments?: UserMessageAttachment[]
    }
  | { type: 'assistant.delta'; sessionId: string; text: string }
  | { type: 'assistant.message'; sessionId: string; text: string; messageId?: string }
  | { type: 'tool.started'; sessionId: string; tool: string; input: unknown }
  | { type: 'tool.completed'; sessionId: string; tool: string; output?: unknown }
  | {
      type: 'permission.requested'
      sessionId: string
      permissionId: string
      tool: string
      description: string
    }
  | { type: 'agent.completed'; sessionId: string }
  | { type: 'agent.cancelled'; sessionId: string }
  | { type: 'agent.error'; sessionId: string; message: string }
  | {
      type: 'agent.todo_list'
      sessionId: string
      items: { text: string; status: TodoItemStatus }[]
    }

export interface MessageAttachment {
  kind: 'image' | 'document'
  mediaType: string
  data: string
  filename?: string
}

export type AppliedState = 'live' | 'pending'

export interface ClaudeAvailableTools {
  tools: string[] | null
  updatedAt: string | null
}

export interface ClaudeUsage {
  totalCostUsd: number
  inputTokens: number
  outputTokens: number
  cacheReadInputTokens: number
  cacheCreationInputTokens: number
  modelUsage?: Record<string, unknown>
}

export interface CodexUsage {
  inputTokens: number
  cachedInputTokens: number
  cacheWriteInputTokens: number
  outputTokens: number
  reasoningOutputTokens: number
}

export interface OpenCodeUsage {
  costUsd: number
  inputTokens: number
  outputTokens: number
  reasoningTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
}

export type SessionUsage = ClaudeUsage | CodexUsage | OpenCodeUsage

export interface RewindResult {
  canRewind: boolean
  error?: string
  filesChanged?: string[] | number
  insertions?: number
  deletions?: number
}
