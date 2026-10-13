<script setup lang="ts">
import type { PermissionAction } from '../../state/chat'
import AppIcon from '../icons/AppIcon'

defineProps<{
  tool: string
  description: string
  pending: boolean
  resolution: PermissionAction | null
}>()

defineEmits<{ approve: []; reject: [] }>()
</script>

<template>
  <div
    class="permission"
    :class="{
      'permission--resolved': resolution,
      'permission--approved': resolution === 'approve',
      'permission--rejected': resolution === 'reject'
    }"
  >
    <div class="permission__header">
      <span class="permission__icon"><AppIcon name="lock" :size="16" /></span>
      <div class="permission__header-text">
        <span class="permission__kicker">Solicitação de permissão</span>
        <span class="permission__tool">{{ tool }}</span>
      </div>
    </div>

    <p class="permission__text">{{ description }}</p>

    <div v-if="!resolution" class="permission__actions">
      <button
        type="button"
        class="permission__btn permission__btn--reject"
        :disabled="pending"
        @click="$emit('reject')"
      >
        Rejeitar
      </button>
      <button
        type="button"
        class="permission__btn permission__btn--approve"
        :disabled="pending"
        @click="$emit('approve')"
      >
        Aprovar
      </button>
    </div>

    <div v-else class="permission__result">
      <AppIcon :name="resolution === 'approve' ? 'circle-check' : 'circle-x'" :size="14" />
      <span>{{ resolution === 'approve' ? 'Aprovado' : 'Rejeitado' }}</span>
    </div>
  </div>
</template>

<style scoped>
.permission {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 18px;
  border: 1.5px solid rgba(245, 165, 36, 0.55);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(18px);
  box-shadow:
    0 4px 16px rgba(20, 40, 90, 0.06),
    0 0 0 0 rgba(245, 165, 36, 0.35);
  animation: permission-pulse 2.4s ease-in-out infinite;
}

/* Respiração âmbar enquanto aguarda decisão. */
@keyframes permission-pulse {
  0%,
  100% {
    box-shadow:
      0 4px 16px rgba(20, 40, 90, 0.06),
      0 0 0 0 rgba(245, 165, 36, 0.35);
  }
  50% {
    box-shadow:
      0 4px 16px rgba(20, 40, 90, 0.06),
      0 0 18px 3px rgba(245, 165, 36, 0.35);
  }
}

.permission--resolved {
  animation: none;
  border-color: #edeef3;
  box-shadow: 0 4px 16px rgba(20, 40, 90, 0.06);
}

.permission--approved {
  animation: permission-glow-approve 1.3s ease-out forwards;
}

@keyframes permission-glow-approve {
  0% {
    border-color: #1fb894;
    box-shadow:
      0 4px 16px rgba(20, 40, 90, 0.06),
      0 0 0 0 rgba(31, 184, 148, 0.65);
  }
  30% {
    border-color: #1fb894;
    box-shadow:
      0 4px 16px rgba(20, 40, 90, 0.06),
      0 0 30px 7px rgba(31, 184, 148, 0.5);
  }
  100% {
    border-color: #bdeee1;
    box-shadow:
      0 4px 16px rgba(20, 40, 90, 0.06),
      0 0 0 0 rgba(31, 184, 148, 0);
  }
}

.permission--rejected {
  animation: permission-glow-reject 1.3s ease-out forwards;
}

@keyframes permission-glow-reject {
  0% {
    border-color: var(--danger);
    box-shadow:
      0 4px 16px rgba(20, 40, 90, 0.06),
      0 0 0 0 rgba(229, 72, 77, 0.55);
  }
  30% {
    border-color: var(--danger);
    box-shadow:
      0 4px 16px rgba(20, 40, 90, 0.06),
      0 0 24px 6px rgba(229, 72, 77, 0.35);
  }
  100% {
    border-color: #f6d6d7;
    box-shadow:
      0 4px 16px rgba(20, 40, 90, 0.06),
      0 0 0 0 rgba(229, 72, 77, 0);
  }
}

.permission__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.permission__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(245, 165, 36, 0.16);
  color: var(--warning);
  transition:
    background 0.4s ease,
    color 0.4s ease;
}

.permission--approved .permission__icon {
  background: rgba(31, 184, 148, 0.16);
  color: #1fb894;
}

.permission--rejected .permission__icon {
  background: rgba(229, 72, 77, 0.14);
  color: var(--danger);
}

.permission__header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.permission__kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--text-ghost);
}

.permission__tool {
  overflow: hidden;
  font-size: 14.5px;
  font-weight: 700;
  color: var(--ink);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.permission__text {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--text-muted);
  overflow-wrap: anywhere;
}

.permission__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.permission__btn {
  padding: 9px 18px;
  border: none;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.15s ease,
    opacity 0.15s ease;
}

.permission__btn:disabled {
  cursor: default;
  opacity: 0.5;
}

.permission__btn--reject {
  background: var(--surface-hover);
  color: var(--text-muted);
}

.permission__btn--reject:hover:not(:disabled) {
  background: #e5e8f0;
}

.permission__btn--approve {
  background: var(--ink);
  color: #fff;
}

.permission__btn--approve:hover:not(:disabled) {
  background: #262b38;
}

.permission__result {
  display: flex;
  align-items: center;
  align-self: flex-end;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 700;
}

.permission--approved .permission__result {
  color: #1fb894;
}

.permission--rejected .permission__result {
  color: var(--danger);
}
</style>
