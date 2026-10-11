import { ref } from 'vue'
import { setModelApi } from '../api/agentcore'
import type { RuntimeName } from '../api/types'
import { appState } from './app-state'
import { startSession } from './sessions'
import { showToast } from './toasts'

export const PROVIDER_LABELS: Record<RuntimeName, string> = {
  claude: 'Claude',
  codex: 'Codex',
  opencode: 'OpenCode'
}

export const DEFAULT_MODEL_LABEL = 'Padrão do CLI'

export const modelMenuOpen = ref(false)
export const modelMenuBusy = ref(false)

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}

export function providerLabel(runtime: RuntimeName): string {
  return PROVIDER_LABELS[runtime] ?? runtime
}

export function modelDisplayName(runtime: RuntimeName, model: string): string {
  if (!model) return DEFAULT_MODEL_LABEL

  const agent = appState.availableAgents.find((a) => a.runtime === runtime)
  return agent?.models.find((m) => m.id === model)?.displayName || model
}

export function toggleModelMenu(): void {
  modelMenuOpen.value = !modelMenuOpen.value
}

export function closeModelMenu(): void {
  modelMenuOpen.value = false
}

async function applyModelToCurrentSession(model: string): Promise<void> {
  const session = appState.session
  if (!session || model === appState.currentModel) return

  try {
    const result = await setModelApi(session.id, model)
    appState.currentModel = model
    session.model = model || undefined

    const label = modelDisplayName(appState.currentRuntime, model)
    showToast({
      title: 'Modelo alterado',
      message:
        result.applied === 'live'
          ? `Modelo "${label}" aplicado imediatamente à execução em andamento.`
          : `Modelo "${label}" definido como padrão da sessão. Vale a partir da próxima mensagem.`
    })
  } catch (error) {
    showToast({
      title: 'Não foi possível trocar o modelo',
      message: errorMessage(error, 'Falha ao aplicar o novo modelo.'),
      variant: 'error'
    })
  }
}

async function startSessionWithProvider(runtime: RuntimeName, model: string): Promise<void> {
  try {
    const session = await startSession(runtime, model)
    if (!session) return

    showToast({
      title: 'Provedor alterado',
      message: `Nova conversa iniciada com ${providerLabel(runtime)} (${modelDisplayName(runtime, model)}).`
    })
  } catch (error) {
    showToast({
      title: 'Não foi possível trocar de provedor',
      message: errorMessage(error, 'Falha ao iniciar a nova conversa.'),
      variant: 'error'
    })
  }
}

// Same provider: the model is just changed. Different provider: the runtime is fixed when a session
// is created, so a new conversation is started with that provider.
export async function handleModelSelect(runtime: RuntimeName, model: string): Promise<void> {
  const session = appState.session
  if (!session || modelMenuBusy.value) {
    closeModelMenu()
    return
  }

  modelMenuBusy.value = true
  try {
    if (runtime === session.runtime) await applyModelToCurrentSession(model)
    else await startSessionWithProvider(runtime, model)
  } finally {
    modelMenuBusy.value = false
    closeModelMenu()
  }
}
