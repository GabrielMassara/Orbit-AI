<script setup lang="ts">
defineProps<{ tool: string; done: boolean }>()
</script>

<template>
  <div class="tool-message" :class="done ? 'tool-message--done' : 'tool-message--running'">
    <span class="tool-message__dot"></span>
    <span>{{ done ? `${tool} concluído` : `Usando ${tool}…` }}</span>
  </div>
</template>

<style scoped>
.tool-message {
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 999px;
  background: var(--glass-bg);
  backdrop-filter: blur(14px);
  box-shadow: 0 2px 8px rgba(20, 40, 90, 0.05);
  color: var(--text-muted);
  font-size: 12.5px;
  font-weight: 600;
}

.tool-message__dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--text-faint);
}

.tool-message--running .tool-message__dot {
  background: var(--warning);
  animation: pulse 1.2s ease-in-out infinite;
}

.tool-message--done .tool-message__dot {
  background: #1fb894;
}
</style>
