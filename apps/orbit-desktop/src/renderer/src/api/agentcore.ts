import { request, requestOr } from './client'
import type {
  AgentEvent,
  AgentSession,
  AppliedState,
  AvailableAgent,
  ClaudeAvailableTools,
  ClaudeEffortLevel,
  CodexReasoningEffort,
  CodexSandboxMode,
  CodexWebSearchMode,
  PermissionMode,
  RewindResult,
  RuntimeName,
  SessionList,
  SessionUsage
} from './types'

const sessionPath = (sessionId: string): string => `/v1/sessions/${encodeURIComponent(sessionId)}`

export function createSession(projectPath: string, runtime: RuntimeName = 'claude') {
  return request<AgentSession>('/v1/sessions', {
    method: 'POST',
    body: { runtime, projectPath },
    failureMessage: 'Erro ao criar sessão'
  })
}

export function getSession(sessionId: string): Promise<AgentSession | null> {
  return requestOr<AgentSession | null>(sessionPath(sessionId), null)
}

export async function getSessionHistory(sessionId: string): Promise<AgentEvent[]> {
  const body = await requestOr<{ events?: AgentEvent[] }>(`${sessionPath(sessionId)}/history`, {})
  return body.events ?? []
}

export async function listSessions(limit = 20): Promise<AgentSession[]> {
  const body = await requestOr<Partial<SessionList>>(`/v1/sessions?limit=${limit}`, {})
  return body.sessions ?? []
}

export async function getSessionForks(sessionId: string): Promise<AgentSession[]> {
  const all = await listSessions(200)
  return all.filter((s) => s.forkedFrom === sessionId)
}

export function deleteSessionApi(sessionId: string) {
  return request<{ deleted: boolean }>(sessionPath(sessionId), {
    method: 'DELETE',
    failureMessage: 'Erro ao excluir sessão'
  })
}

export function renameSessionApi(sessionId: string, title: string) {
  return request<AgentSession>(sessionPath(sessionId), {
    method: 'PATCH',
    body: { title },
    failureMessage: 'Erro ao renomear sessão'
  })
}

export function forkSessionApi(sessionId: string, upToMessageId?: string) {
  return request<AgentSession>(`${sessionPath(sessionId)}/fork`, {
    method: 'POST',
    ...(upToMessageId ? { body: { upToMessageId } } : {}),
    failureMessage: 'Erro ao ramificar sessão'
  })
}

export function tagSessionApi(sessionId: string, tag: string | null) {
  return request<AgentSession>(`${sessionPath(sessionId)}/tag`, {
    method: 'POST',
    body: { tag },
    failureMessage: 'Erro ao marcar tag'
  })
}

export function setPermissionModeApi(sessionId: string, mode: PermissionMode) {
  return request<{ mode: PermissionMode; applied: AppliedState }>(
    `${sessionPath(sessionId)}/permission-mode`,
    { method: 'POST', body: { mode }, failureMessage: 'Erro ao trocar permission mode' }
  )
}

export function getClaudeAvailableToolsApi(sessionId: string) {
  return request<ClaudeAvailableTools>(`${sessionPath(sessionId)}/claude-tools`, {
    failureMessage: 'Erro ao buscar tools disponíveis'
  })
}

export function setClaudeToolPermissionsApi(sessionId: string, deny: string[]) {
  return request<{ deny: string[]; applied: AppliedState }>(
    `${sessionPath(sessionId)}/claude-tool-permissions`,
    { method: 'POST', body: { deny }, failureMessage: 'Erro ao trocar as permissões de tool' }
  )
}

export function setClaudeEffortLevelApi(sessionId: string, effort: ClaudeEffortLevel) {
  return request<{ effort: ClaudeEffortLevel; applied: AppliedState }>(
    `${sessionPath(sessionId)}/claude-effort-level`,
    { method: 'POST', body: { effort }, failureMessage: 'Erro ao trocar o esforço de raciocínio' }
  )
}

export function setCodexSandboxModeApi(sessionId: string, mode: CodexSandboxMode) {
  return request<{ mode: CodexSandboxMode; applied: AppliedState }>(
    `${sessionPath(sessionId)}/codex-sandbox-mode`,
    { method: 'POST', body: { mode }, failureMessage: 'Erro ao trocar o sandbox do Codex' }
  )
}

export function setCodexReasoningEffortApi(sessionId: string, effort: CodexReasoningEffort) {
  return request<{ effort: CodexReasoningEffort; applied: AppliedState }>(
    `${sessionPath(sessionId)}/codex-reasoning-effort`,
    { method: 'POST', body: { effort }, failureMessage: 'Erro ao trocar o esforço de raciocínio' }
  )
}

export function setCodexWebSearchModeApi(sessionId: string, mode: CodexWebSearchMode) {
  return request<{ mode?: CodexWebSearchMode; enabled?: boolean; applied: AppliedState }>(
    `${sessionPath(sessionId)}/codex-web-search`,
    { method: 'POST', body: { mode }, failureMessage: 'Erro ao trocar a busca na web' }
  )
}

export function setCodexAdditionalDirectoriesApi(sessionId: string, directories: string[]) {
  return request<{ directories: string[]; applied: AppliedState }>(
    `${sessionPath(sessionId)}/codex-additional-directories`,
    {
      method: 'POST',
      body: { directories },
      failureMessage: 'Erro ao atualizar as pastas adicionais'
    }
  )
}

export function setModelApi(sessionId: string, model: string) {
  return request<{ model: string | null; applied: AppliedState }>(
    `${sessionPath(sessionId)}/model`,
    { method: 'POST', body: { model: model || null }, failureMessage: 'Erro ao trocar o modelo' }
  )
}

export function rewindApi(sessionId: string, userMessageId: string, dryRun?: boolean) {
  return request<RewindResult>(`${sessionPath(sessionId)}/rewind`, {
    method: 'POST',
    body: { userMessageId, ...(dryRun ? { dryRun } : {}) },
    failureMessage: 'Erro ao fazer rewind'
  })
}

export function usageApi(sessionId: string) {
  return request<SessionUsage>(`${sessionPath(sessionId)}/usage`, {
    failureMessage: 'Erro ao buscar uso da sessão'
  })
}

export async function loadAvailableAgents(): Promise<AvailableAgent[]> {
  const body = await requestOr<{ agents?: AvailableAgent[] }>('/v1/agents', {})
  const agents = Array.isArray(body.agents) ? body.agents : []
  return agents.length > 0 ? agents : [{ runtime: 'claude', models: [] }]
}
