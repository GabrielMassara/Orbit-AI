<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '../icons/AppIcon'

const rating = ref<'like' | 'dislike' | null>(null)

function rate(value: 'like' | 'dislike'): void {
  rating.value = rating.value === value ? null : value
}
</script>

<template>
  <div class="feedback-row">
    <button
      type="button"
      class="feedback-btn"
      :class="{ 'feedback-btn--like': rating === 'like' }"
      aria-label="Good response"
      :aria-pressed="rating === 'like'"
      @click="rate('like')"
    >
      <AppIcon name="thumbs-up" :size="16" />
    </button>
    <button
      type="button"
      class="feedback-btn"
      :class="{ 'feedback-btn--dislike': rating === 'dislike' }"
      aria-label="Bad response"
      :aria-pressed="rating === 'dislike'"
      @click="rate('dislike')"
    >
      <AppIcon name="thumbs-down" :size="16" />
    </button>
  </div>
</template>

<style scoped>
.feedback-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: -2px;
}

.feedback-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-ghost);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.feedback-btn:hover {
  background: var(--surface-hover);
  color: var(--text-muted);
}

.feedback-btn--like {
  color: #1fb894;
}

.feedback-btn--dislike {
  color: var(--danger);
}
</style>
