<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { activeDialog, closeDialog } from '../../state/dialogs'

const value = ref('')
const input = ref<HTMLInputElement | null>(null)
const confirmButton = ref<HTMLButtonElement | null>(null)

watch(activeDialog, async (dialog) => {
  if (!dialog) return
  value.value = dialog.kind === 'prompt' ? (dialog.initialValue ?? '') : ''
  await nextTick()
  if (dialog.kind === 'prompt') {
    input.value?.focus()
    input.value?.select()
  } else {
    confirmButton.value?.focus()
  }
})

function cancel(): void {
  const dialog = activeDialog.value
  if (!dialog) return
  closeDialog()
  if (dialog.kind === 'confirm') dialog.resolve(false)
  else dialog.resolve(null)
}

function confirm(): void {
  const dialog = activeDialog.value
  if (!dialog) return

  if (dialog.kind === 'prompt') {
    if (!dialog.allowEmpty && !value.value.trim()) return
    closeDialog()
    dialog.resolve(value.value)
  } else {
    closeDialog()
    dialog.resolve(true)
  }
}

function onEnter(event: KeyboardEvent): void {
  if (!event.isComposing) confirm()
}
</script>

<template>
  <div v-if="activeDialog" class="dialog-backdrop" @click.self="cancel" @keydown.esc="cancel">
    <div class="dialog" role="dialog" aria-modal="true" :aria-label="activeDialog.title">
      <h2 class="dialog__title">{{ activeDialog.title }}</h2>

      <p v-if="activeDialog.kind === 'confirm'" class="dialog__message">
        {{ activeDialog.message }}
      </p>

      <label v-else class="dialog__field">
        <span class="dialog__label">{{ activeDialog.label }}</span>
        <input
          ref="input"
          v-model="value"
          class="dialog__input"
          type="text"
          :placeholder="activeDialog.placeholder"
          @keydown.enter="onEnter"
        />
      </label>

      <div class="dialog__actions">
        <button type="button" class="dialog__btn dialog__btn--ghost" @click="cancel">
          Cancelar
        </button>
        <button
          ref="confirmButton"
          type="button"
          class="dialog__btn"
          :class="{ 'dialog__btn--danger': activeDialog.kind === 'confirm' && activeDialog.danger }"
          @click="confirm"
        >
          {{ activeDialog.confirmLabel ?? 'Confirmar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(20, 23, 31, 0.28);
  backdrop-filter: blur(3px);
}

.dialog {
  width: min(380px, 100%);
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 20px 48px rgba(20, 23, 31, 0.24);
}

.dialog__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}

.dialog__message {
  margin-top: 8px;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--text-muted);
}

.dialog__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
}

.dialog__label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-muted);
}

.dialog__input {
  padding: 10px 12px;
  border: 1px solid var(--text-ghost);
  border-radius: 10px;
  background: var(--surface);
  color: var(--ink);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease;
}

.dialog__input:focus {
  border-color: var(--accent);
}

.dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.dialog__btn {
  padding: 9px 16px;
  border: none;
  border-radius: 10px;
  background: var(--ink);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.dialog__btn:hover {
  background: #2c313e;
}

.dialog__btn--ghost {
  background: transparent;
  color: var(--text-muted);
}

.dialog__btn--ghost:hover {
  background: var(--surface-hover);
}

.dialog__btn--danger {
  background: var(--danger);
}

.dialog__btn--danger:hover {
  background: var(--danger-text);
}
</style>
