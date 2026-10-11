<script setup lang="ts">
import { dismissToast, removeToast, toasts, type Toast } from '../../state/toasts'
import AppIcon from '../icons/AppIcon'

function runAction(toast: Toast): void {
  toast.onAction?.()
  dismissToast(toast.id)
}

function onAnimationEnd(toast: Toast): void {
  if (toast.leaving) removeToast(toast.id)
}
</script>

<template>
  <div class="toast-stack" aria-live="polite">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="{ 'toast--error': toast.variant === 'error', 'toast--leaving': toast.leaving }"
      :role="toast.variant === 'error' ? 'alert' : 'status'"
      @animationend="onAnimationEnd(toast)"
    >
      <div class="toast-icon">
        <AppIcon :name="toast.variant === 'error' ? 'alert-circle' : 'fork'" :size="15" />
      </div>

      <div class="toast-body">
        <p class="toast-title">{{ toast.title }}</p>
        <p v-if="toast.message" class="toast-message">{{ toast.message }}</p>
        <div v-if="toast.actionLabel && toast.onAction" class="toast-actions">
          <button type="button" class="toast-action-btn" @click="runAction(toast)">
            {{ toast.actionLabel }}
          </button>
        </div>
      </div>

      <button type="button" class="toast-close" aria-label="Fechar" @click="dismissToast(toast.id)">
        <AppIcon name="close" :size="12" :stroke-width="2" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  z-index: 999;
  right: 24px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(340px, calc(100vw - 32px));
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(24px) saturate(1.4);
  box-shadow: 0 12px 32px rgba(20, 23, 31, 0.16);
  pointer-events: auto;
  animation: toast-in 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.toast--leaving {
  animation: toast-out 0.18s ease forwards;
}

.toast-icon {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: var(--accent-gradient);
}

.toast--error .toast-icon {
  background: linear-gradient(135deg, #ff9a8e 0%, var(--danger) 100%);
}

.toast-body {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink);
}

.toast-message {
  margin-top: 2px;
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--text-muted);
}

.toast-actions {
  display: flex;
  margin-top: 10px;
}

.toast-action-btn {
  border: none;
  border-radius: 8px;
  padding: 7px 13px;
  background: var(--ink);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.toast-action-btn:hover {
  background: #2c313e;
}

.toast-close {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-ghost);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.toast-close:hover {
  background: var(--surface-hover);
  color: var(--text-muted);
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
