import type { AgentSession } from '../api/types'

const STORAGE_PROJECT_PATH = 'orbit.project-path'
const STORAGE_SESSION_ID = 'orbit.session-id'
const STORAGE_REWINDS = 'orbit.rewinds'

export interface RewindMark {
  at: string
  filesCount: number
  fileList: string[] | null
  insertions: number
  deletions: number
}

type RewindMarks = Record<string, Record<string, RewindMark>>

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {}
}

export function loadStoredSessionRef(): { projectPath: string | null; sessionId: string | null } {
  return { projectPath: read(STORAGE_PROJECT_PATH), sessionId: read(STORAGE_SESSION_ID) }
}

export function saveState(session: Pick<AgentSession, 'id' | 'projectPath'>): void {
  write(STORAGE_PROJECT_PATH, session.projectPath)
  write(STORAGE_SESSION_ID, session.id)
}

export function readRewindMarks(): RewindMarks {
  try {
    return (JSON.parse(read(STORAGE_REWINDS) ?? 'null') as RewindMarks | null) ?? {}
  } catch {
    return {}
  }
}

export function getRewindMark(sessionId: string, messageId: string): RewindMark | null {
  return readRewindMarks()[sessionId]?.[messageId] ?? null
}

export function saveRewindMark(sessionId: string, messageId: string, info: RewindMark): void {
  const all = readRewindMarks()
  all[sessionId] = { ...all[sessionId], [messageId]: info }
  write(STORAGE_REWINDS, JSON.stringify(all))
}
