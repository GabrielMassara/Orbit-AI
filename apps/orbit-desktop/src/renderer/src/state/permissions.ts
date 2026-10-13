import { resolvePermissionApi } from '../api/agentcore'
import { appState } from './app-state'
import {
  appendSystemMessage,
  markPermissionResolved,
  setPermissionCardButtonsDisabled,
  type PermissionAction
} from './chat'
import { promptDialog } from './dialogs'

async function resolvePermission(
  permissionId: string,
  action: PermissionAction,
  reason?: string
): Promise<void> {
  const session = appState.session
  if (!session) return

  setPermissionCardButtonsDisabled(permissionId, true)

  try {
    await resolvePermissionApi(session.id, permissionId, action, reason)
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : ''
    appendSystemMessage(
      message || 'Não foi possível responder a permissão: falha de conexão com a API.',
      true
    )
    setPermissionCardButtonsDisabled(permissionId, false)
    return
  }

  markPermissionResolved(permissionId, action)
}

export function approvePermission(permissionId: string): Promise<void> {
  return resolvePermission(permissionId, 'approve')
}

export async function rejectPermission(permissionId: string): Promise<void> {
  const reason = await promptDialog({
    title: 'Rejeitar permissão',
    label: 'Motivo da rejeição (opcional)',
    confirmLabel: 'Rejeitar',
    allowEmpty: true
  })
  if (reason === null) return

  await resolvePermission(permissionId, 'reject', reason.trim() || undefined)
}
