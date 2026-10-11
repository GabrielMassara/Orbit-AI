<script setup lang="ts">
defineProps<{ text: string; error?: boolean }>()
</script>

<template>
  <div class="system-message" :class="{ 'system-message--error': error }">{{ text }}</div>
</template>

<style scoped>
.system-message {
  align-self: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--text-faint);
  font-size: 12.5px;
  font-weight: 600;
  text-align: center;
}

.system-message--error {
  background: var(--danger-surface);
  color: var(--danger-text);
}
</style>
