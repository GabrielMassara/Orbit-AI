import { ref } from 'vue'

interface BaseDialog {
  title: string
  confirmLabel?: string
}

export interface ConfirmDialogOptions extends BaseDialog {
  message: string
  danger?: boolean
}

export interface PromptDialogOptions extends BaseDialog {
  label: string
  initialValue?: string
  placeholder?: string
  allowEmpty?: boolean
}

export type ActiveDialog =
  | ({ kind: 'confirm'; resolve: (confirmed: boolean) => void } & ConfirmDialogOptions)
  | ({ kind: 'prompt'; resolve: (value: string | null) => void } & PromptDialogOptions)

export const activeDialog = ref<ActiveDialog | null>(null)

function cancelPending(): void {
  const pending = activeDialog.value
  if (!pending) return
  if (pending.kind === 'confirm') pending.resolve(false)
  else pending.resolve(null)
}

export function confirmDialog(options: ConfirmDialogOptions): Promise<boolean> {
  cancelPending()
  return new Promise((resolve) => {
    activeDialog.value = { kind: 'confirm', ...options, resolve }
  })
}

export function promptDialog(options: PromptDialogOptions): Promise<string | null> {
  cancelPending()
  return new Promise((resolve) => {
    activeDialog.value = { kind: 'prompt', ...options, resolve }
  })
}

export function closeDialog(): void {
  activeDialog.value = null
}
