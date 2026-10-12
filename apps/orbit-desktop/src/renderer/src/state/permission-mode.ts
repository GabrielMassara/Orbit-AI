import { ref } from 'vue'
import { setCodexSandboxModeApi, setPermissionModeApi } from '../api/agentcore'
import type { CodexSandboxMode, PermissionMode } from '../api/types'
import type { IconName } from '../components/icons/icons'
import { appState } from './app-state'
import { showToast } from './toasts'

export const PERMISSION_MODE_LABELS: Record<PermissionMode, string> = {
  default: 'Padrão',
  acceptEdits: 'Aceitar edições',
  bypassPermissions: 'Ignorar permissões',
  plan: 'Modo plano',
  dontAsk: 'Não perguntar',
  auto: 'Automático'
}

export const CODEX_SANDBOX_MODE_LABELS: Record<CodexSandboxMode, string> = {
  'read-only': 'Somente leitura',
  'workspace-write': 'Workspace',
  'danger-full-access': 'Acesso total'
}

const PERMISSION_MODE_ICONS: Record<PermissionMode, IconName> = {
  default: 'shield-check',
  acceptEdits: 'pencil',
  bypassPermissions: 'bolt',
  plan: 'clipboard-list',
  dontAsk: 'bell-off',
  auto: 'infinity'
}

const CODEX_SANDBOX_ICONS: Record<CodexSandboxMode, IconName> = {
  'read-only': 'eye',
  'workspace-write': 'folder-edit',
  'danger-full-access': 'lock-open'
}

export const PERMISSION_MODES = Object.keys(PERMISSION_MODE_LABELS) as PermissionMode[]
export const CODEX_SANDBOX_MODES = Object.keys(CODEX_SANDBOX_MODE_LABELS) as CodexSandboxMode[]

const OPENCODE_PERMISSION_MODES: readonly PermissionMode[] = ['default', 'plan']

export const permissionModeMenuOpen = ref(false)
export const permissionModeBusy = ref(false)

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}

export function permissionModeIcon(mode: PermissionMode): IconName {
  return PERMISSION_MODE_ICONS[mode] ?? PERMISSION_MODE_ICONS.default
}

export function codexSandboxIcon(mode: CodexSandboxMode): IconName {
  return CODEX_SANDBOX_ICONS[mode] ?? CODEX_SANDBOX_ICONS['workspace-write']
}

export function isCodexSession(): boolean {
  return appState.session?.runtime === 'codex'
}

export function isOpenCodeSession(): boolean {
  return appState.session?.runtime === 'opencode'
}

export function availablePermissionModes(): PermissionMode[] {
  return isOpenCodeSession()
    ? PERMISSION_MODES.filter((mode) => OPENCODE_PERMISSION_MODES.includes(mode))
    : PERMISSION_MODES
}

export function togglePermissionModeMenu(): void {
  permissionModeMenuOpen.value = !permissionModeMenuOpen.value
}

export function closeAllPermissionModeMenus(): void {
  permissionModeMenuOpen.value = false
}

export function applyPermissionModeFromSession(): void {
  closeAllPermissionModeMenus()
}

export async function handlePermissionModeSelect(mode: PermissionMode): Promise<void> {
  const session = appState.session
  if (!session || permissionModeBusy.value || mode === appState.currentPermissionMode) {
    closeAllPermissionModeMenus()
    return
  }

  permissionModeBusy.value = true
  try {
    const result = await setPermissionModeApi(session.id, mode)
    appState.currentPermissionMode = mode
    session.permissionMode = mode

    const label = PERMISSION_MODE_LABELS[mode] ?? mode
    showToast({
      title: 'Permission mode alterado',
      message:
        result.applied === 'live'
          ? `Modo "${label}" aplicado imediatamente à execução em andamento.`
          : `Modo "${label}" definido como padrão da sessão. Vale a partir da próxima mensagem.`
    })
  } catch (error) {
    showToast({
      title: 'Não foi possível trocar o permission mode',
      message: errorMessage(error, 'Falha ao aplicar o novo modo.'),
      variant: 'error'
    })
  } finally {
    permissionModeBusy.value = false
    closeAllPermissionModeMenus()
  }
}

export async function handleCodexSandboxModeSelect(mode: CodexSandboxMode): Promise<void> {
  const session = appState.session
  if (!session || permissionModeBusy.value || mode === appState.currentCodexSandboxMode) {
    closeAllPermissionModeMenus()
    return
  }

  permissionModeBusy.value = true
  try {
    await setCodexSandboxModeApi(session.id, mode)
    appState.currentCodexSandboxMode = mode
    session.codexSandboxMode = mode

    const label = CODEX_SANDBOX_MODE_LABELS[mode] ?? mode
    showToast({
      title: 'Sandbox do Codex alterado',
      message: `Modo "${label}" definido como padrão da sessão. Vale a partir da próxima mensagem.`
    })
  } catch (error) {
    showToast({
      title: 'Não foi possível trocar o sandbox do Codex',
      message: errorMessage(error, 'Falha ao aplicar o novo modo.'),
      variant: 'error'
    })
  } finally {
    permissionModeBusy.value = false
    closeAllPermissionModeMenus()
  }
}
